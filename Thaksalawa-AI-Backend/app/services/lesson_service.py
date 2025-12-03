from fastapi import HTTPException
from app.controllers.lesson_controller import (
    create_lesson,
    create_multiple_lessons,
    get_all_lessons,
    get_lessons_by_subject,
    get_lesson_by_id,
    get_lesson_by_number,
    delete_lesson,
    delete_lessons_by_subject,
    process_and_store_lessons
)


def safe_create_lesson(payload):
    try:
        return create_lesson(payload)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_create_multiple_lessons(lessons_data, subject_id):
    try:
        return create_multiple_lessons(lessons_data, subject_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_get_all_lessons():
    try:
        return get_all_lessons()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_get_lessons_by_subject(subject_id: int):
    try:
        return get_lessons_by_subject(subject_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_get_lesson_by_id(lesson_id: int):
    try:
        return get_lesson_by_id(lesson_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_get_lesson_by_number(subject_id: int, lesson_number: int):
    try:
        return get_lesson_by_number(subject_id, lesson_number)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_delete_lesson(lesson_id: int):
    try:
        return delete_lesson(lesson_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_delete_lessons_by_subject(subject_id: int):
    try:
        return delete_lessons_by_subject(subject_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_process_and_store_lessons(pdf_filename: str, subject_id: int, lesson_count: int = None):
    try:
        return process_and_store_lessons(pdf_filename, subject_id, lesson_count)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")