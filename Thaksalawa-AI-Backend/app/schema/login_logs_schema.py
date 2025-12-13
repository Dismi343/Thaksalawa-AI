from pydantic import BaseModel
from datetime import datetime,timedelta,date

class LoginLogCreate(BaseModel):
    student_id:int

class LoginLogsResponse(BaseModel):
    login_id:int |None
    login_date:date |None
    login_time:timedelta |None
    logout_time:timedelta | None
    student_id:int
    duration_seconds: float | None

    class Config:
        from_attributes = True