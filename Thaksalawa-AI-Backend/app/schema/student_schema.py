from pydantic import BaseModel
from typing import Optional

class StudentSchema(BaseModel):
    st_name: str
    email: str
    password: str
    role_id: int
    teacher_id: Optional[int] = None 
    
    class Config:
        from_attributes = True