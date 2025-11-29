from fastapi import APIRouter
from app.services.admin_service import safe_create_admin,safe_get_all_admins,safe_get_admin_by_id,safe_delete_admin_by_id
from app.schema.admin_schema import AdminSchema

router=APIRouter(
    prefix="/admins",
    tags=["admins"],
)

@router.post('/create_admin')
def create_admin_endpoint(payload: AdminSchema):
    return safe_create_admin(payload)

@router.get('/get_all_admins')
def get_all_admins_endpoint():
    return safe_get_all_admins()
@router.get('/get_admin/{admin_id}')
def get_admin_by_id_endpoint(admin_id: int):
    return safe_get_admin_by_id(admin_id)

@router.delete('/delete_admin/{admin_id}')
def delete_admin_endpoint(admin_id: int):
    return safe_delete_admin_by_id(admin_id)