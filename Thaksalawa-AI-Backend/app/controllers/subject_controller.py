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
        # subjects=session.query(SubjectModel).all()
        # return subjects

        results = (
        session.query(
            SubjectModel.sub_id,
            SubjectModel.name,
            SubjectModel.pdf_pdf_id,
            PdfModel.file_name
        )
        .outerjoin(PdfModel, SubjectModel.pdf_pdf_id == PdfModel.pdf_id)
        .all()
    )

        return [
        {
            "sub_id": r.sub_id,
            "name": r.name,
            "pdf_pdf_id": r.pdf_pdf_id,
            "file_name": r.file_name
        }
        for r in results
        ]

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
        session.close()


def get_subject_by_id(subject_id: int):
    session = SessionLocal()
    try:
        subject = session.query( 
            SubjectModel.sub_id,
            SubjectModel.name,
            SubjectModel.pdf_pdf_id,
            PdfModel.file_name
        ).outerjoin(PdfModel, SubjectModel.pdf_pdf_id == PdfModel.pdf_id).filter(
            SubjectModel.sub_id == subject_id
        ).first()
        
        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")
        
        return {
            "sub_id": subject.sub_id,
            "name": subject.name,
            "pdf_pdf_id": subject.pdf_pdf_id,
            "file_name": subject.file_name
        }
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
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