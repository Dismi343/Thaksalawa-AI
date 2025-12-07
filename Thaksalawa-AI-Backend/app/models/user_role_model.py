from sqlalchemy import Column, Integer, ForeignKey,Enum
from sqlalchemy.orm import relationship
from app.database.mysql_database import Base
from app.schema.user_role_schema import RoleEnum


class UserRole(Base):
    __tablename__ = "user_role"
    role_id = Column(Integer, primary_key=True, autoincrement=True)
    role_name = Column(Enum(RoleEnum), unique=True, nullable=False)


    student= relationship("StudentModel", back_populates="role")
    teacher= relationship("TeacherModel", back_populates="role")
    admin= relationship("AdminModel", back_populates="role")
