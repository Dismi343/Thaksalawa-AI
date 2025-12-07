from pydantic import BaseModel

class CreateBlacklistTokenSchema(BaseModel):
    token: str
    
    class Config:
        from_attributes = True