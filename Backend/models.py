# models.py
from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class RoleEnum(str, Enum):
    student = "Student"
    teacher = "Teacher"

class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role:  RoleEnum = RoleEnum.student
    remember: bool = False

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)