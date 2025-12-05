from pydantic import BaseModel
from datetime import datetime

class LoginLogCreate(BaseModel):
    student_id:int

class LoginLogsResponse(BaseModel):
    login_id:int
    login_time:datetime
    student_id:int

    class config:
        from_attributes = True