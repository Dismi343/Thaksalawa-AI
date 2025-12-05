from fastapi import HTTPException
from app.database.mysql_database import SessionLocal
from app.models.subject_model import SubjectModel
from app.models.pdf_model import PdfModel
from sqlalchemy.exc import SQLAlchemyError

def create_subject(payload):
    session=SessionLocal()
    try:
        data= payload if isinstance(payload,dict) else payload.__dict__
        if session.query(SubjectModel).filter_by(name=data.get("name")).first():
            raise HTTPException(status_code=400, detail="Subject with this name already exists")
        pdf_id = data.get("pdf_id")
        if pdf_id and not session.query(PdfModel).filter_by(pdf_id=pdf_id).first():
            raise HTTPException(status_code=404, detail="PDF not found")
        subject=SubjectModel(
            name=data.get("name"),
            pdf_pdf_id=data.get("pdf_id")
        )
        session.add(subject)
        session.commit()
        session.refresh(subject)
        return subject
    except HTTPException:
        session.rollback()
        raise
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
        session.close()

def get_all_subjects():
    session=SessionLocal()
    try:
        subjects=session.query(SubjectModel).all()
        return subjects
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
        session.close()
def get_subject_by_id(subject_id:int):
    session = SessionLocal()
    try:
        subject = session.query(SubjectModel).filter_by(subject_id=subject_id).first()
        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")
        return subject
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
        session.close()

def delete_subject(Subject_id:int):
    session=SessionLocal()
    try:
        subject=session.query(SubjectModel).filter_by(subject_id=Subject_id).first()
        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")
        session.delete(subject)
        session.commit()
        return {"detail":"Subject deleted successfully"}
    except HTTPException:
        session.rollback()
        raise
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
        session.close()