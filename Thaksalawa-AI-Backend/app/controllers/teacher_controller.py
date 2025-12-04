from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from app.database.mysql_database import SessionLocal
from app.models.teacher_model import TeacherModel
from app.models.student_model import StudentModel
from app.models.admin_model import AdminModel
from app.models.user_role_model import UserRole
from app.auth.auth_config import hash_password

def creat_teacher(payload):
    session=SessionLocal()
    try:
        data=payload if isinstance(payload,dict) else payload.__dict__
        if session.query(TeacherModel).filter_by(email=data.get("email")).first():
            raise HTTPException(status_code=400, detail="Email already exists in teacher records")
        if session.query(StudentModel).filter_by(email=data.get("email")).first():
            raise HTTPException(status_code=400, detail="Email already exists in student records")
        if session.query(AdminModel).filter_by(email=data.get("email")).first():
            raise HTTPException(status_code=400, detail="Email already exists in admin records")
        role_id = data.get("role_id")
        if role_id and not session.query(UserRole).filter_by(role_id=role_id).first():
            raise HTTPException(status_code=400, detail="Role not found")
        user_password=data.get("password")
        hashed_pwd=hash_password(user_password)
        teacher=TeacherModel(
            name=data.get('name'),
            email=data.get("email"),
            password=hashed_pwd,
            user_role_role_id =data.get("role_id")
        )
        session.add(teacher)
        session.commit()
        session.refresh(teacher)
        return teacher
    except HTTPException:
        session.rollback()
        raise
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
        session.close()

def get_all_teachers():
    session=SessionLocal()
    try:
        return session.query(TeacherModel).all()
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()
def get_teacher_by_id(teacher_id: int):
    session=SessionLocal()
    try:
        teacher=session.query(TeacherModel).filter_by(teacher_id=teacher_id).first()
        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")
        return teacher
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()
def delete_teacher_by_id(teacher_id:int):
    session=SessionLocal()
    try:
        teacher=session.query(TeacherModel).filter_by(teacher_id=teacher_id).first()
        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")
        session.delete(teacher)
        session.commit()
        return{"message":"Teacher deleted successfully"}
    except SQLAlchemyError:
        session.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()