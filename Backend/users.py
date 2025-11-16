from fastapi import APIRouter, HTTPException, Depends
from models import User,LoginRequest
from database import users_collection
from auth import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register")
def register(user: User):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(400, "Email already exists")

    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)

    result = users_collection.insert_one(user_dict)

    return {"id": str(result.inserted_id), "email": user.email, "role": user.role}


@router.post("/login")
def login(request: LoginRequest):
    user = users_collection.find_one({"email": request.email})
    if not user:
        raise HTTPException(401, "Invalid credentials")

    if not verify_password(request.password, user["password"]):
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token({"sub": user["email"], "role": user["role"]})

    return {"access_token": token, "token_type": "bearer"}
