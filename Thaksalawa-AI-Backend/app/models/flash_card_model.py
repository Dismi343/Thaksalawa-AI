from sqlalchemy import Column, Integer, String, ForeignKey, Enum,DateTime
from app.database.mysql_database import Base
from app.schema.flash_card_schema import Difficulty
from sqlalchemy.sql import func


class FlashCardModel(Base):
    __tablename__ = "flash_card"

    card_id = Column(Integer, primary_key=True, autoincrement=True)
    question = Column(String(500), nullable=False)
    answer = Column(String(1000), nullable=False)
    difficulty = Column(Enum(Difficulty), nullable=False)
    created_at=Column(DateTime, nullable=False, default=func.now())

    lesson_lesson_id  = Column(Integer, ForeignKey("lesson.lesson_id"), nullable=False)
    teacher_teacher_id = Column(Integer, ForeignKey("teacher.teacher_id"), nullable=True)
    student_student_id = Column(Integer, ForeignKey("student.student_id"), nullable=True)