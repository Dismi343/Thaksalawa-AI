from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base


class LessonKeyPointsModel(Base):
    __tablename__ = "lesson_key_points"
    
    point_id = Column(Integer, primary_key=True, autoincrement=True)
    lesson_lesson_id = Column(Integer, ForeignKey("lesson.lesson_id"), nullable=False)
    key_point = Column(Text, nullable=False)
    
    # Relationship
    lesson = relationship("LessonModel", back_populates="key_points")