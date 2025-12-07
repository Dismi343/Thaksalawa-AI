from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base

class StudentAnswerModel(Base):
    __tablename__ = "student_answer"
    
    answer_id = Column(Integer, primary_key=True, autoincrement=True)
    
    # For MCQ
    selected_option = Column(Integer, nullable=True)  # 0, 1, 2, 3
    is_correct = Column(Boolean, nullable=True)
    
    # For Short Answer
    written_answer = Column(Text, nullable=True)
    score_obtained = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)
    
    # Foreign Keys
    question_id = Column(Integer, ForeignKey("questions.question_id"), nullable=False)
    Student_id = Column(Integer, ForeignKey("student.student_id"), nullable=False)
    
    # Relationships
    question = relationship("QuestionModel", back_populates="student_answers")
    student = relationship("StudentModel", back_populates="answers")
    