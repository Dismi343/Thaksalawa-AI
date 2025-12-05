from fastapi import HTTPException
from app.controllers.subject_controller import create_subject,get_all_subjects,get_subject_by_id,delete_subject

def safe_create_subject(payload):
    try:
        return create_subject(payload)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    
def safe_get_all_subjects():
    try:
        return get_all_subjects()
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    
def safe_get_subject_by_id(subject_id:int):
    try:
        return get_subject_by_id(subject_id)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")

def safe_delete_subject(subject_id:int):
    try:
        return delete_subject(subject_id)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")