from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base
from app.models.pdf_model import PdfModel


class SubjectModel(Base):
    __tablename__ = "subject"
    
    sub_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=True)
    pdf_pdf_id = Column(Integer, ForeignKey("pdf.pdf_id"), nullable=False)
    
    # Relationships
    pdf = relationship("PdfModel", back_populates="subjects")
    lessons = relationship("LessonModel", back_populates="subject", cascade="all, delete-orphan")