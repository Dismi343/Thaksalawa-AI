from typing import Annotated
from fastapi import APIRouter, HTTPException, HTTPException,UploadFile,File,Depends
from app.services.pdf_service import safe_upload_pdf, safe_get_pdf_by_id, safe_delete_pdf, safe_download_pdf,safe_get_all_pdfs
from app.database.mysql_database import get_db
from app.schema.pdf_schema import PDFUploadResponse
from app.dependencies.teacher_dependencies import require_teacher
from app.auth.auth_config import get_current_active_user
router = APIRouter(
    prefix="/pdfs",
    tags=["pdfs"]
)

@router.post('/upload',response_model=PDFUploadResponse)
async def upload_pdf_endpoint(current_user : Annotated[dict,Depends(get_current_active_user)],file: UploadFile = File(...), user=Depends(require_teacher),db=Depends(get_db)):
    if not user:
        raise HTTPException(status_code=403, detail="Teacher access required to generate flashcards.")
    teacher_id = current_user['profile']['id']
    return await safe_upload_pdf(file, db, teacher_id)

@router.get('/get-all',response_model=list[PDFUploadResponse])
def get_all_pdfs_endpoint(db=Depends(get_db)):
    return safe_get_all_pdfs(db)

@router.get('/get/{pdf_id}')
def get_pdf_by_id_endpoint(pdf_id: int, db=Depends(get_db)):
    return safe_get_pdf_by_id(pdf_id, db)

@router.delete('/delete/{pdf_id}')
def delete_pdf_endpoint(pdf_id: int, db=Depends(get_db)):
    return safe_delete_pdf(pdf_id, db)

@router.get('/download/{pdf_id}')
def download_pdf_endpoint(pdf_id: int, db=Depends(get_db)):
    return safe_download_pdf(pdf_id, db)