from pydantic import BaseModel
from enum import Enum

class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class FlashCardSchema(BaseModel):
    question:str
    answer:str
    difficulty:Difficulty
    lesson_lesson_id:int
    teacher_teacher_id:int = None
    student_student_id:int = None

class FlashCardCreateSchema(BaseModel):
    question:str
    answer:str
    difficulty:Difficulty
    lesson_lesson_id:int
    teacher_teacher_id:int = None
    student_student_id:int = None

class FlashCardResponseSchema(BaseModel):
    card_id:int
    question:str
    answer:str
    difficulty:Difficulty
    lesson_lesson_id:int
    teacher_teacher_id:int = None
    student_student_id:int = None

    class Config:
        from_attributes = True