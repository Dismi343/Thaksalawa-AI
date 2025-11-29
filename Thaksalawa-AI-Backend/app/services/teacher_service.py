from fastapi import HTTPException
from app.controllers.teacher_controller import creat_teacher,get_all_teachers,get_teacher_by_id,delete_teacher_by_id


def safe_create_teacher(payload):
    try:
        return creat_teacher(payload)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
def safe_get_all_teachers():
    try:
        return get_all_teachers()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
def safe_get_teacher_by_id(teacher_id: int):
    try:
        return get_teacher_by_id(teacher_id)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
def safe_delete_teacher_by_id(teacher_id: int):
    try:
        return delete_teacher_by_id(teacher_id)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")