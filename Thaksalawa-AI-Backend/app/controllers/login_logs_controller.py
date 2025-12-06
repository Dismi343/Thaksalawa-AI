from sqlalchemy.orm import Session
from fastapi import HTTPException,Depends
from app.schema.login_logs_schema import LoginLogCreate
from app.models.login_logs_model import LoginLogsModel
from app.database.mysql_database import get_db
from sqlalchemy.exc import SQLAlchemyError

def create_login_log(data:LoginLogCreate, db:Session=Depends(get_db)):
    try:
        log = LoginLogsModel(student_id=data.student_id)
        db.add(log)
        db.commit()
        db.refresh(log)
        return log
    except HTTPException:
        db.rollback()
        raise
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
        db.close()

def get_login_logs_by_student_id(student_id: int, db: Session = Depends(get_db)):
    try:
        logs = db.query(LoginLogsModel).filter(LoginLogsModel.student_id == student_id).all()

        result=[]

        for log in logs[:-1]:
            if log.logout_time is None:
                duration=30*60
            else:
                duration=(log.logout_time-log.login_time).total_seconds()

            result.append({
                "login_id": log.login_id,
                "student_id": log.student_id,
                "login_time": log.login_time,
                "logout_time": log.logout_time,
                "duration_seconds": duration
            })
        return result
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
        db.close()

def delete_login_log_by_student_id(student_id: int, db: Session = Depends(get_db)):
    try:
        logs = db.query(LoginLogsModel).filter(LoginLogsModel.student_id ==student_id).all()
        if not logs:
            raise HTTPException(status_code=404, detail="Login log not found")
        for log in logs[:-1]:
            db.delete(log)
        db.commit()
        return {"message": "Student's login logs deleted successfully"}
    except HTTPException:
        db.rollback()
        raise
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
        db.close()

def get_total_login_in_hours_by_student_id(student_id: int, db: Session = Depends(get_db)):
    try:
        logs = db.query(LoginLogsModel).filter(LoginLogsModel.student_id == student_id).all()
        total_duration=0
        for log in logs[:-1]:
            if log.logout_time is None:
                duration=30*60
            else:
                duration=(log.logout_time-log.login_time).total_seconds()
            total_duration+=duration
            print(total_duration)

        return total_duration /3600
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
        db.close()

def get_last_login_log_by_student_id(student_id: int, db: Session = Depends(get_db)):
    try:
        log = db.query(LoginLogsModel).filter(LoginLogsModel.student_id == student_id).order_by(LoginLogsModel.login_id.desc()).offset(1).first()
        logout_time=None
        if not log:
            raise HTTPException(status_code=404, detail="Login log not found")
        if log.logout_time is None:
            duration = None 
            logout_time=30*60
        else:
            duration=(log.logout_time-log.login_time).total_seconds()
            logout_time=log.logout_time 
        return ({
                "login_id": log.login_id,
                "student_id": log.student_id,
                "login_time": log.login_time,
                "logout_time": logout_time,
                "duration_seconds": duration
            })
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error:  {str(e)}")
    finally:
        db.close()