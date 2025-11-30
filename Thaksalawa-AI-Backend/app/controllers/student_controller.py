from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from app.database.mysql_database import SessionLocal
from app.models.student_model import StudentModel
from app.models.teacher_model import TeacherModel
from app.models.user_role_model import UserRole
from app.auth.auth_config import hash_password

def create_student(payload):
    session = SessionLocal()
    try:
        data= payload if isinstance(payload,dict) else payload.__dict__
        if session.query(StudentModel).filter_by(email=data.get("email")).first():
            raise HTTPException(status_code=400, detail="Email already exists")
        # optional: validate role exists
        role_id = data.get("role_id")
        if role_id and not session.query(UserRole).filter_by(role_id=role_id).first():
            raise HTTPException(status_code=400, detail="Role not found")
        teacher_id = data.get("teacher_id")
        if teacher_id and not session.query(TeacherModel).filter_by(teacher_id=teacher_id).first():
            raise HTTPException(status_code=400, detail="Teacher not found")
        
        user_password = data.get("password")
        hashed_password = hash_password(user_password)
        student= StudentModel(
            st_name=data.get("st_name"),
            email=data.get("email"),
            password=hashed_password,
            user_role_role_id=data.get("role_id"),
            teacher_teacher_id=data.get("teacher_id")
        )
        session.add(student)
        session.commit()
        session.refresh(student)
        return student
    except HTTPException:
        session.rollback()
        raise
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
        session.close()

def get_all_students():
    session = SessionLocal()
    try:
        return session.query(StudentModel).all()
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()
def get_student_by_id(student_id: int):
    session = SessionLocal()
    try:
        student = session.query(StudentModel).filter_by(student_id=student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()

def delete_student(student_id: int):
    session = SessionLocal()
    try:
        student = session.query(StudentModel).filter_by(student_id=student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        session.delete(student)
        session.commit()
        return {"message": "Student deleted successfully"}
    except SQLAlchemyError:
        session.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()