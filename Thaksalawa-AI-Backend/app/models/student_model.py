from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base
from .user_role_model import UserRole
from .associations import teacher_student_association  # Import the TABLE, not the module


class StudentModel(Base):
    __tablename__ = "student"
    
    student_id = Column(Integer, primary_key=True, autoincrement=True)
    st_name = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    user_role_role_id = Column(Integer, ForeignKey("user_role.role_id"))
    role = relationship(UserRole)

    # Relationship to TeacherModel through association table
    teachers = relationship(
        "TeacherModel",
        secondary=teacher_student_association,
        back_populates="students"
    )

    login_logs = relationship("LoginLogsModel", back_populates="student")
    quizzes = relationship("QuizModel", back_populates="student", cascade="all, delete-orphan")
    answers = relationship("StudentAnswerModel", back_populates="student", cascade="all, delete-orphan")
    chats = relationship("ChatModel", back_populates="student", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Student(id={self.student_id}, name={self.st_name})>"

    def to_dict(self):
        return {
            "id": self.student_id,
            "email": self.email,
            "name": self.st_name,
            "role_id": self.user_role_role_id,
            "type": "student"
        }