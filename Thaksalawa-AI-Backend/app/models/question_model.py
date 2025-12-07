from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base
import enum

class QuestionTypeEnum(str, enum.Enum):
    mcq = "mcq"
    short = "short"

class QuestionSourceEnum(str, enum.Enum):
    AI = "AI"
    Teacher = "Teacher"

class QuestionModel(Base):
    __tablename__ = "questions"
    
    question_id = Column(Integer, primary_key=True, autoincrement=True)
    question_text = Column(Text, nullable=False)
    question_type = Column(Enum(QuestionTypeEnum), nullable=False)
    source = Column(Enum(QuestionSourceEnum), nullable=False, default=QuestionSourceEnum.AI)
    explanation = Column(Text, nullable=True)  # For MCQ explanations
    
    # Foreign Key
    quiz_quiz_id = Column(Integer, ForeignKey("quiz.quiz_id"), nullable=False)
    
    # Relationships
    quiz = relationship("QuizModel", back_populates="questions")
    mcq_options = relationship("MCQOptionModel", back_populates="question", cascade="all, delete-orphan")
    model_answers = relationship("ModelAnswerModel", back_populates="question", cascade="all, delete-orphan")
    student_answers = relationship("StudentAnswerModel", back_populates="question", cascade="all, delete-orphan")