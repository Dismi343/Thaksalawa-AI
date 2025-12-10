from pydantic import BaseModel

class MessageCreate(BaseModel):
    query:str
    message:str
    chat_id:int

class MessageRespone(BaseModel):
    message_id:int
    query:str
    message:str
    chat_id:int

    class Config:
        from_attributes = True

class Messagerequest(BaseModel):
    query:str
    source:str