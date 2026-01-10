from fastapi import APIRouter, HTTPException, Depends
from app.services.flash_card_service import (
    safe_create_flashcard_by_student,
    safe_create_flashcard_by_teacher,
    safe_create_multiple_flashcards,
    safe_get_all_flashcards,
    safe_get_flashcards_by_lesson,
    safe_get_flashcard_by_id,
    safe_delete_flashcard,
    safe_delete_flashcards_by_lesson,
    safe_generate_and_store_flashcards_for_lesson,
    safe_generate_and_store_flashcards_for_subject,
    safe_get_all_flashcards_student,
    safe_get_all_flashcards_teacher,
    safe_update_flashcard
    
)
from app.dependencies.teacher_dependencies import require_teacher
from typing import Annotated
from app.auth.auth_config import get_current_active_user

router = APIRouter(prefix="/flashcards", tags=["flashcards"])


@router.post("/create_by_teacher")
def create_flashcard_route(payload: dict,current_user : Annotated[dict,Depends(get_current_active_user)], user=Depends(require_teacher)):
    """Create a single flashcard"""
    if not user:
        raise HTTPException(status_code=403, detail="Teacher access required to generate flashcards.")
    teacher_id = current_user['profile']['id']
    return safe_create_flashcard_by_teacher(payload,teacher_id)

@router.post("/create_by_student")
def create_flashcard_route(payload: dict,current_user : Annotated[dict,Depends(get_current_active_user)]):
    """Create a single flashcard"""
    student_id = current_user['profile']['id']
    return safe_create_flashcard_by_student(payload,student_id)


# @router.post("/create-multiple/{lesson_id}")
# def create_multiple_route(lesson_id: int, flashcards_data: list):
#     """Create multiple flashcards for a lesson"""
#     return safe_create_multiple_flashcards(flashcards_data, lesson_id)


@router.get("/all")
def get_all_route():
    """Get all flashcards"""
    return safe_get_all_flashcards()

@router.get("/all-by-student/{student_id}")
def get_all_route_student(student_id: int):
    """Get all flashcards"""
    return safe_get_all_flashcards_student(student_id)


@router.get("/all-by-teacher/{teacher_id}")
def get_all_route(teacher_id:int):
    """Get all flashcards"""
    return safe_get_all_flashcards_teacher(teacher_id)


@router.get("/lesson/{lesson_id}")
def get_by_lesson_route(lesson_id: int):
    """Get flashcards for a specific lesson"""
    return safe_get_flashcards_by_lesson(lesson_id)


@router.get("/get-card/{card_id}")
def get_by_id_route(card_id: int):
    """Get a specific flashcard"""
    return safe_get_flashcard_by_id(card_id)


@router.delete("/delete-card/{card_id}")
def delete_route(card_id: int):
    """Delete a flashcard"""
    return safe_delete_flashcard(card_id)


@router.delete("/delete_by_lesson/{lesson_id}")
def delete_by_lesson_route(lesson_id: int):
    """Delete all flashcards for a lesson"""
    return safe_delete_flashcards_by_lesson(lesson_id)


@router.post("/generate-lesson/{lesson_id}")
def generate_lesson_route(lesson_id: int,current_user : Annotated[dict,Depends(get_current_active_user)], user=Depends(require_teacher) ):
    """Generate and store flashcards for a lesson"""
    if not user:
        raise HTTPException(status_code=403, detail="Teacher access required to generate flashcards.")
    teacher_id = current_user['profile']['id']
    return safe_generate_and_store_flashcards_for_lesson(lesson_id,teacher_id)


@router.put("/update/{card_id}")
def update_route(card_id: int, payload: dict ,user=Depends(require_teacher)):
    """Update a flashcard"""
    if not user:
        raise HTTPException(status_code=403, detail="Teacher access required to generate flashcards.")
    return safe_update_flashcard(card_id, payload)


#---------------------------------------------------------------------------
#create flashcards for subject route is disabled for now
#---------------------------------------------------------------------------
# @router.post("/generate-subject/{subject_id}")
# def generate_subject_route(subject_id: int):
#     """Generate and store flashcards for all lessons in a subject"""
#     return safe_generate_and_store_flashcards_for_subject(subject_id)