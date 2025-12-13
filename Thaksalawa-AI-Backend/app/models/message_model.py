from sqlalchemy import Column,Integer,ForeignKey   
from sqlalchemy.dialects.mysql import MEDIUMTEXT 
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base
from .chat_model import ChatModel


class ChatMessageModel(Base):
    __tablename__ = "message"
    message_id = Column(Integer, primary_key=True, autoincrement=True)
    query= Column(MEDIUMTEXT,nullable=False)
    message= Column(MEDIUMTEXT,nullable=False)
    chat_chat_id=Column(Integer, ForeignKey("chat.chat_id"))
    chat=relationship(ChatModel, back_populates="messages")