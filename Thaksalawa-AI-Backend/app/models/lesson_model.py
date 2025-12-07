from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base

class LessonModel(Base):
    __tablename__ = "lesson"
    
    lesson_id = Column(Integer, primary_key=True, autoincrement=True)
    lesson_number = Column(Integer, nullable=False)
    name = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    Subject_sub_id = Column(Integer, ForeignKey("subject.sub_id"), nullable=False)
    
    # Relationship
    subject = relationship("SubjectModel", back_populates="lessons")
    quizzes = relationship("QuizModel", back_populates="lesson", cascade="all, delete-orphan")
