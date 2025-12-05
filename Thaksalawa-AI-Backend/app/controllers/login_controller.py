from sqlalchemy.orm import Session
from app.models.student_model import StudentModel
from app.models.teacher_model import TeacherModel
from app.models.admin_model import AdminModel
from fastapi import HTTPException,Depends
from app.auth.auth_config import verify_password,create_access_token
from app.schema.login_schema import LoginRequest
from app.database.mysql_database import get_db
from app.controllers.login_logs_controller import create_login_log
from app.schema.login_logs_schema import LoginLogCreate
from app.models.login_logs_model import LoginLogsModel
from datetime import datetime, timedelta, timezone
from sqlalchemy.exc import SQLAlchemyError


SL_TZ = timezone(timedelta(hours=5, minutes=30))

def login_user(request: LoginRequest, db:Session = Depends(get_db)):
    user=None
    role = None

    student = db.query(StudentModel).filter(StudentModel.email==request.email).first()
    teacher = db.query(TeacherModel).filter(TeacherModel.email==request.email).first()
    admin = db.query(AdminModel).filter(AdminModel.email==request.email).first()

    if student and verify_password(request.password, student.password):
        user=student
        role="student"
        email=student.email
        create_login_log(LoginLogCreate(student_id=student.student_id), db)
    elif teacher and verify_password(request.password, teacher.password):
        user=teacher
        role="teacher"
        email=teacher.email
    elif admin and verify_password(request.password, admin.password):
        user=admin
        role="admin"
        email=admin.email
    elif not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token=  create_access_token({"sub":email, "role":role})
    return {"access_token": access_token, "token_type": "bearer"}

def logout_user(user_id:int,user_type,db:Session=Depends(get_db)):
    try:
        if(user_type=="student"):
            log=db.query(LoginLogsModel).filter(LoginLogsModel.student_id==user_id, LoginLogsModel.logout_time==None).order_by(LoginLogsModel.login_id.desc()).first()
            if log:
                log.logout_time=datetime.now(SL_TZ)
                db.commit()
                db.refresh(log)

    except Exception as e:
     db.rollback()
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
     db.close()