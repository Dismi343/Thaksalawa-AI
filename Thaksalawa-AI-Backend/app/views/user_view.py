from fastapi import APIRouter
from app.models.user_model import User
from app.services.user_service import safe_create_user, safe_delete_user, safe_get_all_users

router=APIRouter()


router = APIRouter(
    prefix="/users",
    tags=["user"],
)

@router.post("/register")
def create_user_endpoint(user: User):
    return safe_create_user(user)

@router.get("/all")
def get_all_users_endpoint():
    return safe_get_all_users()

@router.delete("/delete/{email}")
def delete_user_endpoint(email: str):
    return safe_delete_user(email)
    