from fastapi import HTTPException,UploadFile,File,Depends
from sqlalchemy.orm import Session
from app.models.pdf_model import PdfModel
from app.database.mysql_database import get_db
from app.schema.pdf_schema import PDFUploadResponse
from datetime import datetime,timezone
from fastapi.responses import StreamingResponse

async def upload_pdf(file:UploadFile = File(...),db:Session=Depends(get_db)):
    if file.content_type not in ["application/pdf"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")
    
    file_bytes = await file.read()
    pdf  = PdfModel(
        file_name=file.filename,
        file_data=file_bytes,
        uploaded_at=datetime.now(timezone.utc)
    ) 
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
        "file_id":m.pdf_id,
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