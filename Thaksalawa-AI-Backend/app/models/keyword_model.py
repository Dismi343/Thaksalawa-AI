from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base

class KeywordModel(Base):
    __tablename__ = "keywords"
    
    keyword_id = Column(Integer, primary_key=True, autoincrement=True)
    keyword_text = Column(String(200), nullable=False)
    
    # Foreign Key
    model_answer_model_answer_id = Column(Integer, ForeignKey("model_answer.model_answer_id"), nullable=False)
    
    # Relationship
    model_answer = relationship("ModelAnswerModel", back_populates="keywords")