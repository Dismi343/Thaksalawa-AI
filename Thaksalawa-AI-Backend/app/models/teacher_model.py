from sqlalchemy import  Column,Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base
from .user_role_model import UserRole

class TeacherModel(Base):
    __tablename__ = "teacher"
    teacher_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    user_role_role_id = Column(Integer, ForeignKey("user_role.role_id"))
    role = relationship("UserRole")