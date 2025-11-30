from fastapi import HTTPException
from app.controllers.user_role_controller import create_user_role,get_all_user_roles,get_user_role_by_id,delete_user_role

def safe_create_user_role(payload):
    try:
        return create_user_role(payload)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
def safe_get_all_user_roles():
    try:
        return get_all_user_roles()
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
def safe_get_user_role_by_id(role_id: int):
    try:
        return get_user_role_by_id(role_id)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    
def safe_delete_user_role(role_id: int):
    try:
        return delete_user_role(role_id)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")