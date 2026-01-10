from sqlalchemy import Table, Column, Integer, ForeignKey
from app.database.mysql_database import Base

teacher_student_association = Table(
    "teacher_has_student",
    Base.metadata,
    Column(
        "teacher_teacher_id",
        Integer,
        ForeignKey("teacher.teacher_id"),
        primary_key=True
    ),
    Column(
        "student_student_id",
        Integer,
        ForeignKey("student.student_id"),
        primary_key=True
    ),
)
