from fastapi import HTTPException
from app.controllers.pdf_controller import upload_pdf, get_pdf_by_id, delete_pdf, download_pdf,get_all_pdfs

async def safe_upload_pdf(file, db):
    try:
        return await upload_pdf(file=file, db=db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    
def safe_get_pdf_by_id(pdf_id: int, db):
    try:
        return get_pdf_by_id(pdf_id=pdf_id, db=db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")

def safe_get_all_pdfs(db):
    try:
        return get_all_pdfs(db=db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}") 

def safe_delete_pdf(pdf_id: int, db):
    try:
        return delete_pdf(pdf_id=pdf_id, db=db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")

def safe_download_pdf(pdf_id: int, db):
    try:
        return download_pdf(pdf_id=pdf_id, db=db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")