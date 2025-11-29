from pydantic import BaseModel

class AdminSchema(BaseModel):
    name: str
    email: str
    password: str
    role_id: int
    
    class Config:
        from_attributes = True 