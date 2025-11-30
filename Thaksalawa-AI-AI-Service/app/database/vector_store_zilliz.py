from typing import List, Dict
import uuid
import app.config.config as cfg
from app.config.config import get_zilliz_vectorstore
from langchain_milvus import Milvus

ZILLIZ_COLLECTION = cfg.ZILLIZ_COLLECTION
VECTOR_DIM = 384

def index_chunks_zilliz(chunks: List[Dict], pdf_filename: str) -> int:
    """
    Index chunks into Zilliz/Milvus. Ensures texts, metadatas and ids have matching lengths.
    Returns number of indexed chunks (0 on error or if none).
    """
    if not chunks:
        print("No chunks to index.")
        return 0

    vector_store = get_zilliz_vectorstore()
    texts: List[str] = []
    metadatas: List[Dict] = []
    ids: List[str] = []

    for i, c in enumerate(chunks):
        source = c.get("source", pdf_filename)
        page_num = c.get("page_num", -1)
        text = c.get("text", "") or ""
        chunk_id = c.get("chunk_id")
        if not chunk_id:
            # include uuid to avoid accidental duplicates
            chunk_id = f"{source}_p{page_num}_c{i}_{uuid.uuid4().hex}"

        texts.append(text)
        metadatas.append({
            "page_num": page_num,
            "source": source,
            "chunk_id": chunk_id
        })
        ids.append(chunk_id)

    if not texts:
        print("No texts to index.")
        return 0

    try:
        vector_store.add_texts(
            texts=texts,
            metadatas=metadatas,
            ids=ids
        )
        print(f"Indexed {len(texts)} chunks into Zilliz collection '{ZILLIZ_COLLECTION}'")
        return len(texts)
    except Exception as e:
        print(f"Error while indexing chunks: {e}")
        return 0

def delete_chunks_by_pdf(pdf_filename: str) -> int:
    """
    Delete all chunks that have metadata {"source": pdf_filename}
    directly via the Milvus/Zilliz collection using an expr filter.

    Returns:
        int: number of rows deleted (approx, based on a pre-count).
    """
    vector_store: Milvus = get_zilliz_vectorstore()

    # 1) Get underlying Milvus collection object
    collection = vector_store.col  # in current langchain_milvus/Milvus, this is the collection

    # 2) (Optional) count how many will be deleted
    expr = f"source == '{pdf_filename}'"

    try:
        # load collection into memory (safe to call multiple times)
        collection.load()

        # count rows matching this expr
        count_result = collection.query(
            expr=expr,
            output_fields=["count(*)"],
        )
        # Different Milvus versions can return counts differently.
        # Fallback to len of a normal query if needed.
        if count_result and isinstance(count_result, list) and "count(*)" in count_result[0]:
            n_docs = count_result[0]["count(*)"]
        else:
            rows = collection.query(expr=expr, output_fields=["id"])
            n_docs = len(rows)
    except Exception as e:
        print(f"Error while counting chunks for {pdf_filename}: {e}")
        n_docs = 0

    if n_docs == 0:
        print(f"No chunks found for PDF: {pdf_filename}")
        return 0

    # 3) Actual delete by expr
    try:
        collection.delete(expr=expr)
        print(f"Deleted ~{n_docs} chunks for PDF: {pdf_filename}")
        return n_docs
    except Exception as e:
        print(f"Error while deleting chunks for {pdf_filename}: {e}")
        return 0