from pydantic import BaseModel
from datetime import datetime,timedelta

class LoginLogCreate(BaseModel):
    student_id:int

class LoginLogsResponse(BaseModel):
    login_id:int
    login_time:timedelta
    logout_time:timedelta | None
    student_id:int
    duration_seconds: float | None

    class Config:
        from_attributes = True