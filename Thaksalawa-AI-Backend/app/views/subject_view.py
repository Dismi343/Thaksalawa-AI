from fastapi import APIRouter
from app.services.subject_service import safe_create_subject,safe_delete_subject,safe_get_all_subjects,safe_get_subject_by_id
from app.schema.subject_schema import SubjectSchema

router = APIRouter(
    prefix="/subjects",
    tags=["subjects"]
)

@router.post('/create')
def create_subject_endpoint(payload: SubjectSchema):
    return safe_create_subject(payload)

@router.get('/get-all')
def get_all_subjects_endpoint():
    return safe_get_all_subjects()

@router.get('/get/{sub_id}')
def get_subject_by_id_endpoint(sub_id: int):
    return safe_get_subject_by_id(sub_id)

@router.delete('/delete-subject/{sub_id}')
def delete_subject_endpoint(sub_id: int):
    return safe_delete_subject(sub_id)