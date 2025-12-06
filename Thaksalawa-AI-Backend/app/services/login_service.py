from fastapi import HTTPException
from app.controllers.login_controller import logout_user,login_user

def safe_login_user(request, db):
    try:
        return login_user(request, db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    
def safe_logout_user(user_id,user_type,db):
    try:
        return logout_user(user_id,user_type,db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")