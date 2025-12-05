from pydantic import BaseModel

class SubjectSchema(BaseModel):
    name:str
    pdf_id:int

    class Config:
        from_attributes = True 