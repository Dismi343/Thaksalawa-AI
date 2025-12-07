from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base

class ModelAnswerModel(Base):
    __tablename__ = "model_answer"
    
    model_answer_id = Column(Integer, primary_key=True, autoincrement=True)
    answer_text = Column(Text, nullable=False)
    max_score = Column(Integer, nullable=False, default=10)
    
    # Foreign Key
    question_id = Column(Integer, ForeignKey("questions.question_id"), nullable=False)
    
    # Relationships
    question = relationship("QuestionModel", back_populates="model_answers")
    keywords = relationship("KeywordModel", back_populates="model_answer", cascade="all, delete-orphan")