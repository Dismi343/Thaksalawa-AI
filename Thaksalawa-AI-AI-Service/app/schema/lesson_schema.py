from pydantic import BaseModel
from typing import List

class LessonSchema(BaseModel):
    lesson_number: int
    name: str
    content: str

class DividedLessonsResponse(BaseModel):
    lessons: List[LessonSchema]
    total_lessons: int
    pdf_filename: str