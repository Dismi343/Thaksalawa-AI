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
