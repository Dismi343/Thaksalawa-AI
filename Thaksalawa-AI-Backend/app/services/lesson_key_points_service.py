from fastapi import HTTPException
from app.controllers.lesson_key_points_controller import get_key_points_by_lesson_id

def safe_get_key_points_by_lesson_id(lesson_id: int):
    try:
        return get_key_points_by_lesson_id(lesson_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
