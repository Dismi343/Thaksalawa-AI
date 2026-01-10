from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base
from .user_role_model import UserRole
from .associations import teacher_student_association  # Import the TABLE, not the module


class TeacherModel(Base):
    __tablename__ = "teacher"
    
    teacher_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    user_role_role_id = Column(Integer, ForeignKey("user_role.role_id"))
    role = relationship("UserRole", back_populates="teacher")

    # Relationship to StudentModel through association table
    students = relationship(
        "StudentModel",
        secondary=teacher_student_association,
        back_populates="teachers"
    )

    quizzes = relationship("QuizModel", back_populates="teacher")

    def __repr__(self):
        return f"<Teacher(id={self.teacher_id}, name={self.name})>"

    def to_dict(self):
        return {
            "id": self.teacher_id,
            "email": self.email,
            "name": self.name,
            "role_id": self.user_role_role_id,
            "type": "teacher"
        }