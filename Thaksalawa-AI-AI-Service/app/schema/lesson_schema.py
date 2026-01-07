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


class FlashCard(BaseModel):
    question: str
    answer: str
    difficulty: str  # 'easy', 'medium', 'hard'

class LessonNotes(BaseModel):
    flashcards: List[FlashCard]

class LessonSummary(BaseModel):
    brief_summary: str
    key_points: List[str]

class LessonWithNotesSchema(BaseModel):
    lesson_number: int
    name: str
    content: str

class LessonWithSummarySchema(BaseModel):
    lesson_number: int
    name: str
    content: str
    summary: LessonSummary

class LessonWithNotesAndSummarySchema(BaseModel):
    lesson_number: int
    name: str
    content: str
    summary: LessonSummary

class DividedLessonsWithNotesResponse(BaseModel):
    lessons: List[LessonWithNotesSchema]
    total_lessons: int
    pdf_filename: str

class DividedLessonsWithSummaryResponse(BaseModel):
    lessons: List[LessonWithSummarySchema]
    total_lessons: int
    pdf_filename: str

class DividedLessonsWithNotesAndSummaryResponse(BaseModel):
    lessons: List[LessonWithNotesAndSummarySchema]
    total_lessons: int
    pdf_filename: str