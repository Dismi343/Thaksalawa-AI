from fastapi import APIRouter
from app.services.lesson_key_points_service import (
    safe_get_key_points_by_lesson_id
)

router =APIRouter(
    prefix="/lesson-key-points",
    tags=["lesson-key-points"],
)

@router.get('/get-key-points-by-lesson/{lesson_id}')
def get_key_points_by_lesson(lesson_id:int):
    return safe_get_key_points_by_lesson_id(lesson_id)
