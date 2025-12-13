from fastapi import HTTPException,Depends
from sqlalchemy.orm import Session
from app.database.mysql_database import get_db
from app.models.message_model import ChatMessageModel

def save_chat_message(chat_id:int,query:str,ai_message:str,db:Session=Depends(get_db)):
    try:
        message= ChatMessageModel(
            query=query,
            message=ai_message,
            chat_chat_id=chat_id
        )
        db.add(message)
        db.commit()
        db.refresh(message)

        return {
            "message_id": message.message_id,
            "query": message.query,
            "message": message.message,
            "chat_id": message.chat_chat_id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        db.close()

def update_chat_message(message_id:int,query:str,ai_message:str,db:Session=Depends(get_db)):
    try:
        message= db.query(ChatMessageModel).filter(ChatMessageModel.message_id==message_id).first()
        if not message:
            raise HTTPException(404, "Message not found")
        
        message.query=query
        message.message=ai_message
        db.commit()
        db.refresh(message)

        return {
            "message_id": message.message_id,
            "query": message.query,
            "message": message.message,
            "chat_id": message.chat_chat_id
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        db.close()
    
def get_messages_by_chat(chat_id:int,db:Session=Depends(get_db)):
    try:
        messages= db.query(ChatMessageModel).filter_by(chat_chat_id=chat_id).all()
        result=[]
        for message in messages:
            result.append({
                "message_id": message.message_id,
                "query": message.query,
                "message": message.message,
                "chat_id": message.chat_chat_id
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        db.close()