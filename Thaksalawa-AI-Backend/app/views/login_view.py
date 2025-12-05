from app.controllers.login_controller import login_user,logout_user
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.schema.login_schema import LoginRequest
from app.database.mysql_database import get_db
from typing import Annotated
from app.auth.auth_config import get_current_active_user
router = APIRouter(
    tags=["login"]
)

@router.post("/login", response_model=None)
def login_endpoint(request: LoginRequest, db:Session = Depends(get_db)):
    return login_user(request, db)

@router.get("/dashboard",response_model=dict)
async def read_users_me(current_user : Annotated[dict,Depends(get_current_active_user)]):
    return current_user

@router.post("/logout",response_model=dict)
def logout_user_endpoint(current_user :int= Depends(get_current_active_user),db:Session = Depends(get_db)):
    if isinstance(current_user, int):
        user_id = current_user
    else:
        user_id = current_user['profile']['id']

    user_type= current_user['role']
    result = logout_user(user_id,user_type,db)
    return  {"message": "Logout successful", "data": result}
