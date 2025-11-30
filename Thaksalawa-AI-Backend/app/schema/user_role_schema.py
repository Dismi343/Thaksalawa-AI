from pydantic import BaseModel
from enum import Enum

class RoleEnum(str, Enum):
    student = "Student"
    teacher = "Teacher"
    admin = "Admin"

class UserRoleSchema(BaseModel):
    role_name: RoleEnum
    
    class Config:
         from_attributes = True