from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base

class MCQOptionModel(Base):
    __tablename__ = "mcq_options"
    
    option_id = Column(Integer, primary_key=True, autoincrement=True)
    option_text = Column(String(500), nullable=False)
    is_correct = Column(Boolean, nullable=False, default=False)
    option_order = Column(Integer, nullable=False)  # 0, 1, 2, 3
    
    # Foreign Key
    question_id = Column(Integer, ForeignKey("questions.question_id"), nullable=False)
    
    # Relationship
    question = relationship("QuestionModel", back_populates="mcq_options")