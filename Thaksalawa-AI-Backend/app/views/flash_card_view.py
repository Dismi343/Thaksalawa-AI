from fastapi import APIRouter, HTTPException
from app.services.flash_card_service import (
    safe_create_flashcard,
    safe_create_multiple_flashcards,
    safe_get_all_flashcards,
    safe_get_flashcards_by_lesson,
    safe_get_flashcard_by_id,
    safe_delete_flashcard,
    safe_delete_flashcards_by_lesson,
    safe_generate_and_store_flashcards_for_lesson,
    safe_generate_and_store_flashcards_for_subject
)

router = APIRouter(prefix="/flashcards", tags=["flashcards"])


@router.post("/create")
def create_flashcard_route(payload: dict):
    """Create a single flashcard"""
    return safe_create_flashcard(payload)


@router.post("/create-multiple/{lesson_id}")
def create_multiple_route(lesson_id: int, flashcards_data: list):
    """Create multiple flashcards for a lesson"""
    return safe_create_multiple_flashcards(flashcards_data, lesson_id)


@router.get("/all")
def get_all_route():
    """Get all flashcards"""
    return safe_get_all_flashcards()


@router.get("/lesson/{lesson_id}")
def get_by_lesson_route(lesson_id: int):
    """Get flashcards for a specific lesson"""
    return safe_get_flashcards_by_lesson(lesson_id)


@router.get("/{card_id}")
def get_by_id_route(card_id: int):
    """Get a specific flashcard"""
    return safe_get_flashcard_by_id(card_id)


@router.delete("/{card_id}")
def delete_route(card_id: int):
    """Delete a flashcard"""
    return safe_delete_flashcard(card_id)


@router.delete("/lesson/{lesson_id}")
def delete_by_lesson_route(lesson_id: int):
    """Delete all flashcards for a lesson"""
    return safe_delete_flashcards_by_lesson(lesson_id)


@router.post("/generate-lesson/{lesson_id}")
def generate_lesson_route(lesson_id: int):
    """Generate and store flashcards for a lesson"""
    return safe_generate_and_store_flashcards_for_lesson(lesson_id)


@router.post("/generate-subject/{subject_id}")
def generate_subject_route(subject_id: int):
    """Generate and store flashcards for all lessons in a subject"""
    return safe_generate_and_store_flashcards_for_subject(subject_id)