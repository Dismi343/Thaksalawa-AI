from fastapi import APIRouter,Depends,HTTPException
from app.database.mysql_database import get_db
from app.auth.auth_config import get_current_active_user
from typing import Annotated
from app.schema.message_schema import Messagerequest
from app.services.chat_service import (
    safe_create_chat,
    safe_send_message_to_ai,
    safe_delete_chat_by_id,
    safe_get_chats_by_student,
    safe_edit_sent_message
)
from app.schema.chat_schema import (
    ChatResponse,
    ChatCreate
)
from app.dependencies.student_dependencies import require_student
router= APIRouter(
    prefix="/chat",
    tags=["chat"],
)

@router.post("/start-chat", response_model=ChatResponse)
def start_chat_endpoint(data:ChatCreate, current_user : Annotated[dict,Depends(get_current_active_user)], user=Depends(require_student),db=Depends(get_db)):
    """Start a new chat session for a student"""
    student_id=current_user['profile']['id']
    return safe_create_chat(student_id,data.subject_id, user,db)

@router.post("/{chat_id}/message")
def send_message_endpoint(chat_id:int,data:Messagerequest, db=Depends(get_db)):
    """Send a message to the AI and get a response"""
    return safe_send_message_to_ai(chat_id, data.query, data.source, db)

@router.get("/get-all-chats/{subject_id}", response_model=list[ChatResponse])
def get_student_chats_endpoint(subject_id:int, current_user : Annotated[dict,Depends(get_current_active_user)], db=Depends(get_db)):
    """Get all chat sessions for a student"""
    student_id=current_user['profile']['id']
    return safe_get_chats_by_student(student_id, subject_id, db)

@router.delete("/delete-chat/{chat_id}")
def delete_chat_endpoint(chat_id:int,user=Depends(require_student), db=Depends(get_db)):
    """Delete a chat session by its ID"""
    return safe_delete_chat_by_id(chat_id,user, db)

@router.put("/edit-message/{message_id}")
def edit_message_endpoint(message_id:int,data:Messagerequest, db=Depends(get_db)):
    """Edit a sent message and get an updated AI response"""
    return safe_edit_sent_message(message_id, data.query, data.source, db)