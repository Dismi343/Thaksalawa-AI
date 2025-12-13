from pydantic import BaseModel
from datetime import datetime

class ChatCreate(BaseModel):
    subject_id:int


class ChatResponse(BaseModel):
    chat_id:int
    student_id:int
    timestamp:datetime
    subject_id:int

    class Config:
        from_attributes = True