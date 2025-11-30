from fastapi import APIRouter
from app.services.student_service import safe_create_student,safe_get_all_students,safe_get_student_by_id,safe_delete_student
from app.schema.student_schema import StudentSchema

router =APIRouter(
    prefix="/students",
    tags=["students"],
)

@router.post('/create')
def create_student_endpoint(payload: StudentSchema):
    return safe_create_student(payload)

@router.get('/get_all')
def get_all_students_endpoint():
    return safe_get_all_students()

@router.get('/get_student/{student_id}')
def get_student_by_id_endpoint(student_id: int):
    return safe_get_student_by_id(student_id)

@router.delete('/delete_student/{student_id}')
def delete_student_endpoint(student_id: int):
    return safe_delete_student(student_id)