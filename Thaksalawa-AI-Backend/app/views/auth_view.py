from app.models.login_model import LoginRequest
from fastapi import APIRouter
from app.services.user_service import safe_login
from fastapi import HTTPException


router =APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post("/login")
def login_endpoint(request: LoginRequest):
    try:
        return safe_login(request)
    except HTTPException  as e:
        return {
            "success": False,
            "status": e.status_code,
            "message": e.detail
        }

