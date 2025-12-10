from fastapi import APIRouter,Depends
from app.database.mysql_database import get_db
from app.services.message_service import safe_get_messages_by_chat
from app.schema.message_schema import MessageRespone


router = APIRouter(
    prefix="/messages",
    tags=["messages"],
)

@router.get("/get-all/{chat_id}", response_model=list[MessageRespone])
def read_messages(chat_id: int, db=Depends(get_db)):
    return safe_get_messages_by_chat(chat_id, db)