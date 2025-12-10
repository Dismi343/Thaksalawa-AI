from sqlalchemy import Column,Integer,DateTime,ForeignKey
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base
from .student_model import StudentModel

class ChatModel(Base):
    __tablename__="chat"
    chat_id=Column(Integer, primary_key=True, autoincrement=True)
    timestamp=Column(DateTime, nullable=False)

    Student_id=Column(Integer, ForeignKey("student.student_id"))
    student=relationship(StudentModel, back_populates="chats")
    messages=relationship("ChatMessageModel", back_populates="chat", cascade="all, delete-orphan")