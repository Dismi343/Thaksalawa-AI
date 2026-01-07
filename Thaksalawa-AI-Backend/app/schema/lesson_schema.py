from pydantic import BaseModel
from typing import List, Optional

class LessonSchema(BaseModel):
    lesson_number: int
    name: str
    content: str
    
    class Config:
        from_attributes = True


class LessonCreateSchema(BaseModel):
    lesson_number: int
    name: str
    content: str
    subject_id: int


class LessonResponseSchema(BaseModel):
    lesson_id: int
    lesson_number: int
    name: str
    content: str
    brief_summary :str
    Subject_sub_id: int
    
    class Config:
        from_attributes = True


class StoreLessonsRequest(BaseModel):
    pdf_filename: str
    subject_id: int
    lesson_count: Optional[int] = None