from fastapi import APIRouter
from app.services.user_role_service import safe_create_user_role,safe_get_all_user_roles,safe_get_user_role_by_id,delete_user_role
from app.schema.user_role_schema import UserRoleSchema

router = APIRouter(
    prefix="/users_roles",
    tags=["user_roles"],
)

@router.post("/create")
def create_user_role_endpoint(payload: UserRoleSchema):
    return safe_create_user_role(payload)
@router.get("/get_all")
def get_all_user_roles_endpoint():
    return safe_get_all_user_roles()
