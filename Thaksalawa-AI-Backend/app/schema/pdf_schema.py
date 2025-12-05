from pydantic import BaseModel
from datetime import datetime

class PDFUploadResponse(BaseModel):
    pdf_id: int
    file_name: str
    uploaded_at: datetime  # ISO formatted datetime string

    class Config:
        from_attributes = True