from sqlalchemy import Column,Integer,DateTime,ForeignKey
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base
from .student_model import StudentModel
from .subject_model import SubjectModel

class ChatModel(Base):
    __tablename__="chat"
    chat_id=Column(Integer, primary_key=True, autoincrement=True)
    timestamp=Column(DateTime, nullable=False)
    Student_id=Column(Integer, ForeignKey("student.student_id"))
    subject_sub_id=Column(Integer, ForeignKey("subject.sub_id"),nullable=False)
    student=relationship(StudentModel, back_populates="chats")
    subject=relationship(SubjectModel, back_populates="chats")
    messages=relationship("ChatMessageModel", back_populates="chat", cascade="all, delete-orphan")