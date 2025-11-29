from fastapi import HTTPException
from app.controllers.student_controller import create_student, get_all_students,get_student_by_id,delete_student

def safe_create_student(payload):
    try:
        return create_student(payload)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")

def safe_get_all_students():
    try:
        return get_all_students()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")

def safe_get_student_by_id(student_id: int):
    try:
        return get_student_by_id(student_id)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
def safe_delete_student(student_id: int):
    try:
        return delete_student(student_id)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")