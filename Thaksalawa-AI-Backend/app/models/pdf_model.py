from sqlalchemy import Column, Integer, String, LargeBinary, DateTime,ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.mysql_database import Base

class PdfModel(Base):
    __tablename__ = "pdf"
    
    pdf_id = Column(Integer, primary_key=True, autoincrement=True)
    file_name = Column(String(255), nullable=False)
    file_data = Column(LargeBinary, nullable=False)
    uploaded_at = Column(DateTime, nullable=False, default=func.now())
    teacher_teacher_id = Column(Integer ,ForeignKey("teacher.teacher_id"), nullable=False )
    
    # Relationship
    subjects = relationship("SubjectModel", back_populates="pdf", cascade="all, delete-orphan")