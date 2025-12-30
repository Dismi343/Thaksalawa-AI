# from typing import List, Dict

# def chunk_text(
#     pages: List[Dict],
#     max_chars: int = 800,
#     overlap: int = 150
# ) -> List[Dict]:
  
#     chunks = []
#     chunk_id = 0

#     for page in pages:
#         text = page["text"]
#         start = 0

#         while start < len(text):
#             end = start + max_chars
#             chunk = text[start:end].strip()
#             if chunk:
#                 chunks.append({
#                     "chunk_id": f"{page['source']}_p{page['page_num']}_c{chunk_id}",
#                     "text": chunk,
#                     "page_num": page["page_num"],
#                     "source": page["source"],
#                 })
#                 chunk_id += 1

#             start = end - overlap  # move with overlap

#     return chunks

from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List, Dict

def chunk_text(pages: List[Dict], chunk_size: int = 1200, chunk_overlap: int = 150) -> List[Dict]:
    """
    Split each page's text into chunks using LangChain's RecursiveCharacterTextSplitter.

    Args:
        pages: List of dictionaries with keys 'text', 'page_num', 'source'
        chunk_size: Max characters per chunk
        chunk_overlap: Number of characters to overlap between chunks

    Returns:
        List of chunk dictionaries with chunk_id, text, page_num, source
    """
    chunks = []
    chunk_id = 0

    # Create a LangChain text splitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", "!", "?", ",", " "],  # preserves sentences/paragraphs
    )

    for page in pages:
        page_text = page.get("text", "")
        if not page_text.strip():
            continue

        # Split text into chunks
        page_chunks = text_splitter.split_text(page_text)

        for chunk_text in page_chunks:
            chunks.append({
                "chunk_id": f"{page['source']}_p{page['page_num']}_c{chunk_id}",
                "text": chunk_text,
                "page_num": page["page_num"],
                "source": page["source"],
            })
            chunk_id += 1
    return chunks


