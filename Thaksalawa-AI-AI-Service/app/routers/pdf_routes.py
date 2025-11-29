from fastapi import APIRouter, UploadFile, File
from app.services.ingest_pdf import ingest_pdf
from app.database.vector_store_zilliz import delete_chunks_by_pdf
import shutil
from pathlib import Path

router = APIRouter()
UPLOAD_DIR = Path("./uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    ingest_pdf(str(file_path))
    return {"status": "ok", "filename": file.filename}

@router.delete("/delete-pdf-chunks/{pdf_filename}")
async def delete_pdf_chunks(pdf_filename: str):
    deleted_count = delete_chunks_by_pdf(pdf_filename)
    return {"deleted_chunks": deleted_count}
