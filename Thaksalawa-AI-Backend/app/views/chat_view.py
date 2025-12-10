from fastapi import APIRouter,Depends
from app.database.mysql_database import get_db
from app.auth.auth_config import get_current_active_user
from typing import Annotated
from app.schema.message_schema import Messagerequest
from app.services.chat_service import (
    safe_create_chat,
    safe_send_message_to_ai
)
from app.schema.chat_schema import (
    ChatResponse
)
router= APIRouter(
    prefix="/chat",
    tags=["chat"],
)

@router.post("/start-chat", response_model=ChatResponse)
def start_chat_endpoint(current_user : Annotated[dict,Depends(get_current_active_user)], db=Depends(get_db)):
    """Start a new chat session for a student"""
    student_id=current_user['profile']['id']
    return safe_create_chat(student_id, db)

@router.post("/{chat_id}/message")
def send_message_endpoint(chat_id:int,data:Messagerequest, db=Depends(get_db)):
    """Send a message to the AI and get a response"""
    return safe_send_message_to_ai(chat_id, data.query, db)


