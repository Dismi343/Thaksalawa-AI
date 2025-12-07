from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Time, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.mysql_database import Base
import enum

class QuestionTypeEnum(str, enum.Enum):
    AI = "AI"
    Teacher = "Teacher"

class QuizModel(Base):
    __tablename__ = "quiz"
    
    quiz_id = Column(Integer, primary_key=True, autoincrement=True)
    score = Column(Integer, nullable=False, default=0)
    q_count = Column(Integer, nullable=False)
    duration = Column(Time, nullable=True)
    title = Column(String(200), nullable=False)
    q_type = Column(Enum(QuestionTypeEnum), nullable=False, default=QuestionTypeEnum.AI)
    created_at = Column(DateTime, nullable=False, default=func.now())
    completed_at = Column(DateTime, nullable=True)
    
    # Foreign Keys
    Lesson_lesson_id = Column(Integer, ForeignKey("lesson.lesson_id"), nullable=False)
    Analysis_id = Column(Integer, nullable=True)  # For progress tracking 
    Analysis_Student_id = Column(Integer, nullable=True)  # For progress tracking
    Student_id = Column(Integer, ForeignKey("student.student_id"), nullable=False)
    teacher_teacher_id = Column(Integer, ForeignKey("teacher.teacher_id"), nullable=True)
    
    # Relationships
    lesson = relationship("LessonModel", back_populates="quizzes")
    student = relationship("StudentModel", back_populates="quizzes")
    teacher = relationship("TeacherModel", back_populates="quizzes")
    questions = relationship("QuestionModel", back_populates="quiz", cascade="all, delete-orphan")