from fastapi import HTTPException
from app.controllers.user_controller import create_user, get_all_users,delete_user,login
from app.models.user_model import User
from app.database import users_collection
from app.auth.auth_config import verify_password


def safe_create_user(user: User):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(400, "Email already exists")
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(400, "username already exists")
    try:
        return create_user(user)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    
def safe_get_all_users():
    try:
        return get_all_users()
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    

def safe_delete_user(email: str):
    try:
        return delete_user(email)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    

def safe_login(request):
    user = users_collection.find_one({"username": request.username})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    try:
        return login(request)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")