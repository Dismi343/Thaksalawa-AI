from fastapi import HTTPException
from app.controllers.message_controller import get_messages_by_chat

def safe_get_messages_by_chat(chat_id:int,db):
    try:
        return get_messages_by_chat(chat_id,db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")



