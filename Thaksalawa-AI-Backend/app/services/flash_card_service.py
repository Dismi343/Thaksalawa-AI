from fastapi import HTTPException
from app.controllers.flash_card_controller import (
    create_flashcard,
    create_multiple_flashcards,
    get_all_flashcards,
    get_flashcards_by_lesson,
    get_flashcard_by_id,
    delete_flashcard,
    delete_flashcards_by_lesson,
    generate_and_store_flashcards_for_lesson,
    generate_and_store_flashcards_for_subject
)
from typing import List, Dict


def safe_create_flashcard(payload: Dict):
    """Safely create a single flashcard with exception handling"""
    try:
        return create_flashcard(payload)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_create_multiple_flashcards(flashcards_data: List[Dict], lesson_id: int):
    """Safely create multiple flashcards with exception handling"""
    try:
        return create_multiple_flashcards(flashcards_data, lesson_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_get_all_flashcards():
    """Safely get all flashcards with exception handling"""
    try:
        return get_all_flashcards()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_get_flashcards_by_lesson(lesson_id: int):
    """Safely get flashcards by lesson with exception handling"""
    try:
        return get_flashcards_by_lesson(lesson_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_get_flashcard_by_id(card_id: int):
    """Safely get flashcard by ID with exception handling"""
    try:
        return get_flashcard_by_id(card_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_delete_flashcard(card_id: int):
    """Safely delete a flashcard with exception handling"""
    try:
        return delete_flashcard(card_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_delete_flashcards_by_lesson(lesson_id: int):
    """Safely delete flashcards by lesson with exception handling"""
    try:
        return delete_flashcards_by_lesson(lesson_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_generate_and_store_flashcards_for_lesson(lesson_id: int):
    """Safely generate and store flashcards for a lesson with exception handling"""
    try:
        return generate_and_store_flashcards_for_lesson(lesson_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")


def safe_generate_and_store_flashcards_for_subject(subject_id: int):
    """Safely generate and store flashcards for a subject with exception handling"""
    try:
        return generate_and_store_flashcards_for_subject(subject_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")