from pydantic import BaseModel

class User(BaseModel):
    email: str | None = None
    name: str | None = None
    user_role_role_id: int | None = None
    class Config:
        orm_mode = True