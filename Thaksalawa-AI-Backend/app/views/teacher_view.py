from fastapi import APIRouter
from app.services.teacher_service import safe_create_teacher,safe_get_all_teachers,safe_get_teacher_by_id,safe_delete_teacher_by_id
from app.schema.teacher_schema import TeacherSchema

router= APIRouter(
    prefix="/teachers",
    tags=["teachers"],
)

@router.post('/create_teacher')
def create_teacher_endpoint(payload: TeacherSchema):
    return safe_create_teacher(payload)

@router.get('/get_all_teachers')
def get_all_teachers_endpoint():
    return safe_get_all_teachers()
@router.get('/get_teacher/{teacher_id}')
def get_teacher_by_id_endpoint(teacher_id: int):
    return safe_get_teacher_by_id(teacher_id)
@router.delete('/delete_teacher/{teacher_id}')
def delete_teacher_endpoint(teacher_id: int):
    return safe_delete_teacher_by_id(teacher_id)