from fastapi import HTTPException
from app.controllers.admin_controller import creat_admin,get_admin_by_id,get_all_admins,delete_admin_by_id

def safe_create_admin(payload):
    try:
        return creat_admin(payload)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    
def safe_get_admin_by_id(admin_id: int):
    try:
        return get_admin_by_id(admin_id)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
def safe_get_all_admins():
    try:
        return get_all_admins()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
def safe_delete_admin_by_id(admin_id: int):
    try:
        return delete_admin_by_id(admin_id)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")