from sqlalchemy.orm import Session
from app.models.student_model import StudentModel
from app.models.teacher_model import TeacherModel
from app.models.admin_model import AdminModel
from fastapi import HTTPException,Depends
from app.auth.auth_config import verify_password,create_access_token
from app.schema.login_schema import LoginRequest
from app.database.mysql_database import get_db

def login_user(request: LoginRequest, db:Session = Depends(get_db)):
    user=None
    role = None

    student = db.query(StudentModel).filter(StudentModel.email==request.email).first()
    teacher = db.query(TeacherModel).filter(TeacherModel.email==request.email).first()
    admin = db.query(AdminModel).filter(AdminModel.email==request.email).first()

    if student and verify_password(request.password, student.password):
        user=student
        role="student"
    elif teacher and verify_password(request.password, teacher.password):
        user=teacher
        role="teacher"
    elif admin and verify_password(request.password, admin.password):
        user=admin
        role="admin"
    elif not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token=create_access_token({"sub":user.email, "role":role})
    return {"access_token": access_token, "token_type": "bearer"}