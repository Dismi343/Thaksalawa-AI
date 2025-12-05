from sqlalchemy import Column, Integer, DateTime,ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta, timezone
from app.database.mysql_database import Base

SL_TZ = timezone(timedelta(hours=5, minutes=30))

class LoginLogsModel(Base):
    __tablename__="login_logs"

    login_id=Column(Integer,primary_key=True, autoincrement=True)
    login_time=Column(DateTime,default=lambda : datetime.now(SL_TZ))
    logout_time=Column(DateTime, nullable=True)
    student_id=Column(Integer, ForeignKey("student.student_id"))

    student=relationship("StudentModel",back_populates="login_logs")
