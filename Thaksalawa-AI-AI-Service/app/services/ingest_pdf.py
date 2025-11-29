# backend/ingest_pdf.py
from app.data.pdf_utils import extract_text_from_pdf
from app.data.chunk_utils import chunk_text
from app.database.vector_store_zilliz import index_chunks_zilliz
import os


def ingest_pdf(pdf_path: str):
    
    file_name = os.path.basename(pdf_path)

    pages = extract_text_from_pdf(pdf_path)
    if not pages:
        print(f"No text extracted from: {pdf_path}")
        return

    chunks = chunk_text(pages)
    if not chunks:
        print(f"No chunks created from: {pdf_path}")
        return

    # Set "source" = file name for all chunks
    for c in chunks:
        c["source"] = file_name

    index_chunks_zilliz(chunks,file_name)
    print(f"Ingested {len(chunks)} chunks from {pdf_path}")


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python ingest_pdf.py path/to/file.pdf")
    else:
        ingest_pdf(sys.argv[1])
