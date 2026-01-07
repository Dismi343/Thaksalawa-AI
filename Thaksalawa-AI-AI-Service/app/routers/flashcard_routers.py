from fastapi import APIRouter

from app.services.flash_card_service import generate_flashcards_for_lesson, generate_flashcards_for_subject

router = APIRouter()

@router.post("/generate-flashcards/{lesson_id}")
def generate(lesson_id: int):
    return {
        "lesson_id": lesson_id,
        "flashcards": generate_flashcards_for_lesson(lesson_id)
    }
@router.post("/generate-flashcards-subject/{subject_id}")
def generate(subject_id: int):
    return {
        "subject_id": subject_id,
        "flashcards": generate_flashcards_for_subject(subject_id)
    }