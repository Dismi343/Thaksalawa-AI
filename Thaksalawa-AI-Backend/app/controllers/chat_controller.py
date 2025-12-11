from fastapi import HTTPException,Depends
from sqlalchemy.orm import Session
from datetime import datetime,timezone,timedelta
import requests

from app.models.chat_model import ChatModel
from app.database.mysql_database import get_db
import os
from dotenv import load_dotenv
from app.controllers.message_controller import save_chat_message,update_chat_message
load_dotenv()

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL/ai/chat-bot/ask", "http://localhost:8080/ai/chat-bot/ask")

def create_chat(student_id:int,db:Session=Depends(get_db) ):
    chat= ChatModel(
        Student_id=student_id,
        timestamp=datetime.now(timezone.utc)+timedelta(hours=5,minutes=30)
    )
    db.add(chat)
    db.commit()
    db.refresh(chat)

    return {
        "chat_id": chat.chat_id,
        "student_id": chat.Student_id,
        "timestamp": chat.timestamp
    }

def send_message_to_ai(chat_id:int,query:str,source:str,db:Session=Depends(get_db)):
    try:
        ai_resp = requests.post(
            AI_SERVICE_URL,
            json={"query": query, "source":source},
            timeout=1000
        )
        ai_resp.raise_for_status()
        ai_data = ai_resp.json()
        ai_message = ai_data.get("answer", "")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    
    message = save_chat_message(chat_id,query,ai_message,db)
    return message  

def edit_sent_message(message_id:int,query:str,source:str,db:Session=Depends(get_db)):
    try:
        ai_resp = requests.post(
            AI_SERVICE_URL,
            json={"query": query, "source":source},
            timeout=1000
        )
        ai_resp.raise_for_status()
        ai_data = ai_resp.json()
        ai_message = ai_data.get("answer", "")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    message = update_chat_message(message_id,query,ai_message,db)
    return message

def delete_chat_by_id(chat_id:int,db:Session=Depends(get_db)):
    try:
        chat= db.query(ChatModel).filter(ChatModel.chat_id==chat_id).first()
        if not chat:
            raise HTTPException(404, "Chat not found")
        db.delete(chat)
        db.commit()
        return {"detail": "Chat deleted successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    finally:
        db.close()

def get_chats_by_student(student_id:int,db:Session=Depends(get_db)):
    try:
        chats= db.query(ChatModel).filter(ChatModel.Student_id==student_id).all()
        result=[]
        for chat in chats:
            result.append({
                "chat_id": chat.chat_id,
                "student_id": chat.Student_id,
                "timestamp": chat.timestamp
            })
        return result
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")
    finally:
        db.close()