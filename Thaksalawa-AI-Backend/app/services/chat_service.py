from fastapi import HTTPException
from app.controllers.chat_controller import create_chat,send_message_to_ai,delete_chat_by_id,get_chats_by_student,edit_sent_message

def safe_create_chat(student_id:int,subject_id:int,user,db):
    try:
        if(user is None):
            raise HTTPException(403, "Unauthorized to create chat for this student")
        return create_chat(student_id,subject_id,db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    
def safe_send_message_to_ai(chat_id:int,query:str,source:str,db):
    try:
        return send_message_to_ai(chat_id,query,source,db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")

def safe_delete_chat_by_id(chat_id:int,user,db):
    try:
        if(user is None):
            raise HTTPException(403, "Unauthorized to delete chat for this student")
        return delete_chat_by_id(chat_id,db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
def safe_get_chats_by_student(student_id:int,subject_id:int,db):
    try:

        return get_chats_by_student(student_id,subject_id,db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    
def safe_edit_sent_message(message_id:int,query:str,source:str,db):
    try:
        return edit_sent_message(message_id,query,source,db)
    except HTTPException:
        raise 
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")