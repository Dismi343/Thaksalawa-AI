from fastapi import HTTPException,UploadFile,File,Depends
from sqlalchemy.orm import Session
from app.models.pdf_model import PdfModel
from app.database.mysql_database import get_db
from app.schema.pdf_schema import PDFUploadResponse
from datetime import datetime,timezone
from fastapi.responses import StreamingResponse
import os
from dotenv import load_dotenv
import httpx

load_dotenv()

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8080")


async def upload_pdf(file:UploadFile = File(...),db:Session=Depends(get_db),teacher_id:int=None):
    if file.content_type not in ["application/pdf"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")
    
    file_bytes = await file.read()
    pdf  = PdfModel(
        file_name=file.filename,
        file_data=file_bytes,
        teacher_teacher_id=teacher_id,
        uploaded_at=datetime.now(timezone.utc)
    ) 
    async with httpx.AsyncClient() as client:
        files = {'file': (file.filename, file_bytes, file.content_type)}
        try:
            ai_response = await client.post(f"{AI_SERVICE_URL}/ai/pdf/upload-pdf", files=files, timeout=1000)
            ai_response.raise_for_status()
        except Exception as e:
            print(f"Failed to upload PDF to AI-Service: {e}")

    db.add(pdf)
    db.commit()
    db.refresh(pdf)
    return pdf

def get_all_pdfs(db:Session=Depends(get_db)):
    pdfs = db.query(PdfModel).all()
    if not pdfs:
        raise HTTPException(status_code=404, detail="PDF not found")
    pdf_list=[]
    for m in pdfs:
        pdf_list.append({
        "pdf_id":m.pdf_id,
        "file_name":m.file_name,
        "uploaded_at":m.uploaded_at
        })
    return pdf_list


def get_pdf_by_id(pdf_id:int, db:Session=Depends(get_db)):
    pdf = db.query(PdfModel).filter(PdfModel.pdf_id == pdf_id).first()
    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")
    return {
        "pdf_id": pdf.pdf_id,
        "file_name": pdf.file_name,
        "uploaded_at": pdf.uploaded_at
    }

def delete_pdf(pdf_id:int, db:Session=Depends(get_db)):
    pdf = db.query(PdfModel).filter(PdfModel.pdf_id == pdf_id).first()
    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    ai_delete_url = f"{AI_SERVICE_URL}/ai/pdf/delete-pdf-chunks/{pdf.file_name}"
    try:
        with httpx.Client() as client:
            ai_response = client.delete(ai_delete_url, timeout=30)
            ai_response.raise_for_status()
    except Exception as e:
        print(f"Failed to delete PDF from AI-Service: {e}")

    db.delete(pdf)
    db.commit()
    return {"detail": "PDF deleted successfully"}

def download_pdf(pdf_id:int, db:Session=Depends(get_db)):
    pdf = db.query(PdfModel).filter(PdfModel.pdf_id == pdf_id).first()
    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")
    return StreamingResponse(
        iter([pdf.file_data]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={pdf.file_name}"}
    )