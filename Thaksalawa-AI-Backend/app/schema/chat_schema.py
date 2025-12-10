from pydantic import BaseModel
from datetime import datetime

class ChatCreate(BaseModel):
    student_id:int


class ChatResponse(BaseModel):
    chat_id:int
    student_id:int
    timestamp:datetime

    class Config:
        from_attributes = True