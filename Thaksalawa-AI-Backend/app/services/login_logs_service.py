from fastapi import HTTPException
from app.controllers.login_logs_controller import get_login_logs_by_student_id,delete_login_log_by_student_id,get_total_login_in_hours_by_student_id,get_last_login_log_by_student_id

def safe_get_login_logs_by_student_id(student_id: int, db):
    try:
        return get_login_logs_by_student_id(student_id, db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    
def safe_delete_login_log_by_student_id(student_id: int, db):
    try:
        return delete_login_log_by_student_id(student_id, db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}") 

def safe_get_total_login_in_hours_by_student_id(student_id: int, db):
    try:
        return get_total_login_in_hours_by_student_id(student_id, db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    
def safe_get_last_login_log_by_student_id(student_id: int, db):
    try:
        return get_last_login_log_by_student_id(student_id, db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")