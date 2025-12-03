from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
from pathlib import Path
from app.services.lesson_divider import divide_pdf_into_lessons, divide_pdf_with_custom_count
from app.schema.lesson_schema import DividedLessonsResponse

router = APIRouter()

UPLOAD_DIR = Path("./uploads")


class DivideLessonsRequest(BaseModel):
    pdf_filename: str
    lesson_count: Optional[int] = None  # If None, AI decides the number


@router.post("/divide-lessons", response_model=DividedLessonsResponse)
async def divide_lessons(req: DivideLessonsRequest):
    """
    Divide a PDF into lessons using AI.
    If lesson_count is provided, divide into that many lessons.
    Otherwise, let AI determine the optimal number of lessons.
    """
    pdf_path = UPLOAD_DIR / req.pdf_filename
    
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail=f"PDF file not found: {req.pdf_filename}")
    
    try:
        if req.lesson_count and req.lesson_count > 0:
            lessons = divide_pdf_with_custom_count(str(pdf_path), req.lesson_count)
        else:
            lessons = divide_pdf_into_lessons(str(pdf_path))
        
        return {
            "lessons": lessons,
            "total_lessons": len(lessons),
            "pdf_filename": req.pdf_filename
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error dividing PDF: {str(e)}")