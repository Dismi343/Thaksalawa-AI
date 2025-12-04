from fastapi import APIRouter
from app.services.lesson_service import (
    safe_create_lesson,
    safe_get_all_lessons,
    safe_get_lessons_by_subject,
    safe_get_lesson_by_id,
    safe_get_lesson_by_number,
    safe_delete_lesson,
    safe_delete_lessons_by_subject,
    safe_process_and_store_lessons
)
from app.schema.lesson_schema import (
    LessonCreateSchema,
    LessonResponseSchema,
    StoreLessonsRequest
)
from typing import List

router = APIRouter(
    prefix="/lessons",
    tags=["lessons"],
)


@router.post('/create', response_model=LessonResponseSchema)
def create_lesson_endpoint(payload: LessonCreateSchema):
    """Create a single lesson manually"""
    return safe_create_lesson(payload)


@router.post('/process-and-store')
def process_and_store_lessons_endpoint(request: StoreLessonsRequest):
    """
    Process PDF with AI service and store lessons in database.
    This is the main endpoint for dividing and storing lessons.
    """
    return safe_process_and_store_lessons(
        pdf_filename=request.pdf_filename,
        subject_id=request.subject_id,
        lesson_count=request.lesson_count
    )


@router.get('/all', response_model=List[LessonResponseSchema])
def get_all_lessons_endpoint():
    """Get all lessons from all subjects"""
    return safe_get_all_lessons()


@router.get('/subject/{subject_id}', response_model=List[LessonResponseSchema])
def get_lessons_by_subject_endpoint(subject_id: int):
    """Get all lessons for a specific subject"""
    return safe_get_lessons_by_subject(subject_id)


@router.get('/id/{lesson_id}', response_model=LessonResponseSchema)
def get_lesson_by_id_endpoint(lesson_id: int):
    """Get a specific lesson by its ID"""
    return safe_get_lesson_by_id(lesson_id)


@router.get('/subject/{subject_id}/number/{lesson_number}', response_model=LessonResponseSchema)
def get_lesson_by_number_endpoint(subject_id: int, lesson_number: int):
    """Get a specific lesson by subject ID and lesson number"""
    return safe_get_lesson_by_number(subject_id, lesson_number)


@router.delete('/delete/{lesson_id}')
def delete_lesson_endpoint(lesson_id: int):
    """Delete a specific lesson"""
    return safe_delete_lesson(lesson_id)


@router.delete('/subject/{subject_id}/delete-all')
def delete_lessons_by_subject_endpoint(subject_id: int):
    """Delete all lessons for a specific subject"""
    return safe_delete_lessons_by_subject(subject_id)