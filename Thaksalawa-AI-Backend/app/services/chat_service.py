from fastapi import HTTPException
from app.controllers.chat_controller import create_chat,send_message_to_ai

def safe_create_chat(student_id:int,db):
    try:
        return create_chat(student_id,db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    
def safe_send_message_to_ai(chat_id:int,query:str,db):
    try:
        return send_message_to_ai(chat_id,query,db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")