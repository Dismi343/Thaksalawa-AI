from fastapi import HTTPException
from app.models.user_model import User
from app.database import users_collection
from app.auth.auth_config import hash_password
from app.utils.userUtility import serialize_list
from app.models.login_model import LoginRequest
from app.auth.auth_config import  verify_password, create_access_token

def create_user(user:User):
     user_dict = user.dict()
     user_dict["password"] = hash_password(user.password)

     result = users_collection.insert_one(user_dict)

     return {"id": str(result.inserted_id), "email": user.email, "role": user.role}



def get_all_users():
    users = users_collection.find()
    return serialize_list(list(users))



def delete_user(email: str):
    result = users_collection.delete_one({"email": email})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}



def login(request: LoginRequest):
    user = users_collection.find_one({"username": request.username})
    
    token = create_access_token({"sub": user["username"], "role": user["role"]})

    return {
        "success": True,
        "access_token": token,
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "role": user["role"],
            "email": user["email"]
        }
        }