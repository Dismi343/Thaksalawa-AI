from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schema.login_logs_schema import LoginLogsResponse
from app.services.login_logs_service import safe_get_login_logs_by_student_id,safe_delete_login_log_by_student_id,safe_get_total_login_in_hours_by_student_id,safe_get_last_login_log_by_student_id
from typing import Annotated
from app.auth.auth_config import get_current_active_user
from app.database.mysql_database import get_db

router=APIRouter(
    prefix="/login-logs",
    tags=["login-logs"],
)

@router.get('/logs-by-active-student',response_model=list[LoginLogsResponse])
def get_login_logs_by_student_id_endpoint(current_user : Annotated[dict,Depends(get_current_active_user)],db:Session=Depends(get_db)):
    student_id=current_user['profile']['id']
    return safe_get_login_logs_by_student_id(student_id,db)

@router.delete('/delete-logs-by-active-student')
def delete_login_log_by_student_id_endpoint(current_user : Annotated[dict,Depends(get_current_active_user)],db:Session=Depends(get_db)):
    student_id=current_user['profile']['id']
    return safe_delete_login_log_by_student_id(student_id,db)

@router.get('/total-logs-by-student',response_model=float)
def get_total_login_in_hours_by_student_id_endpoint(current_user : Annotated[dict,Depends(get_current_active_user)],db:Session=Depends(get_db)):
    student_id=current_user['profile']['id']
    return safe_get_total_login_in_hours_by_student_id(student_id,db)

@router.get('/last-log-by-student',response_model=LoginLogsResponse)
def get_last_login_log_by_student_id_endpoint(current_user : Annotated[dict,Depends(get_current_active_user)],db:Session=Depends(get_db)):
    student_id=current_user['profile']['id']
    return safe_get_last_login_log_by_student_id(student_id,db)