from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
from pathlib import Path
from app.services.lesson_divider import divide_pdf_into_lessons, divide_pdf_with_custom_count
from app.schema.lesson_schema import DividedLessonsResponse,DividedLessonsWithNotesResponse
# from app.services.flash_card_service import generate_notes_for_lessons

from app.schema.lesson_schema import DividedLessonsWithSummaryResponse
from app.schema.lesson_schema import DividedLessonsWithNotesAndSummaryResponse


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
    

# @router.post("/divide-lessons-with-notes", response_model=DividedLessonsWithNotesResponse)
# async def divide_lessons_with_notes(req: DivideLessonsRequest):
#     """
#     Divide a PDF into lessons AND generate flashcards + notes for each lesson.
    
#     This endpoint:
#     1. Divides the PDF into lessons
#     2. For each lesson, generates:
#        - A 2-3 sentence summary
#        - 5-7 key learning points
#        - 5-8 flashcards with varying difficulty (easy, medium, hard)
    
#     Query Parameters:
#     - pdf_filename: Name of the uploaded PDF file
#     - lesson_count: (Optional) Exact number of lessons to create
#     """
#     pdf_path = UPLOAD_DIR / req.pdf_filename
    
#     if not pdf_path.exists():
#         raise HTTPException(status_code=404, detail=f"PDF file not found: {req.pdf_filename}")
    
#     try:
#         # Step 1: Divide into lessons
#         if req.lesson_count and req.lesson_count > 0:
#             lessons = divide_pdf_with_custom_count(str(pdf_path), req.lesson_count)
#         else:
#             lessons = divide_pdf_into_lessons(str(pdf_path))
        
#         # Step 2: Generate flashcards and notes for each lesson
#         # lessons_with_notes = generate_notes_for_lessons(lessons)
        
#         return {
#             "lessons": lessons,
#             "total_lessons": len(lessons),
#             "pdf_filename": req.pdf_filename
#         }
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
    

@router.post("/divide-lessons-with-summary", response_model=DividedLessonsWithSummaryResponse)
async def divide_lessons_with_summary(req: DivideLessonsRequest):
    """
    Divide a PDF into lessons AND generate summaries for each lesson.
    
    This endpoint:
    1. Divides the PDF into lessons
    2. For each lesson, generates:
       - Brief 2-3 sentence summary
       - Detailed paragraph summary
       - 5-7 key learning points
       - Learning objectives
       - Important terms with definitions
    
    Query Parameters:
    - pdf_filename: Name of the uploaded PDF file
    - lesson_count: (Optional) Exact number of lessons to create
    """
    pdf_path = UPLOAD_DIR / req.pdf_filename
    
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail=f"PDF file not found: {req.pdf_filename}")
    
    try:
        # Step 1: Divide into lessons
        if req.lesson_count and req.lesson_count > 0:
            lessons = divide_pdf_with_custom_count(str(pdf_path), req.lesson_count)
        else:
            lessons = divide_pdf_into_lessons(str(pdf_path))
        
        # Step 2: Generate summaries for each lesson
        from app.services.summary_note_service import generate_summaries_for_lessons
        lessons_with_summaries = generate_summaries_for_lessons(lessons)
        
        # Step 3: Explicitly structure response to match schema
        validated_lessons = [
            {
                "lesson_number": lesson.get("lesson_number"),
                "name": lesson.get("name"),
                "content": lesson.get("content"),
                "summary": lesson.get("summary", {
                    "brief_summary": "",
                    "detailed_summary": "",
                    "key_points": [],
                    "learning_objectives": [],
                    "important_terms": []
                })
            }
            for lesson in lessons_with_summaries
        ]
        
        return {
            "lessons": validated_lessons,
            "total_lessons": len(validated_lessons),
            "pdf_filename": req.pdf_filename
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@router.post("/divide-lessons-with-notes-and-summary", response_model=DividedLessonsWithNotesAndSummaryResponse)
async def divide_lessons_with_notes_and_summary(req: DivideLessonsRequest):
    """
    Divide a PDF into lessons AND generate BOTH flashcards AND summaries for each lesson.
    
    This endpoint:
    1. Divides the PDF into lessons
    2. For each lesson, generates:
       - Flashcards (5-8 cards with varying difficulty)
       - Summary with key points and learning objectives
    
    Query Parameters:
    - pdf_filename: Name of the uploaded PDF file
    - lesson_count: (Optional) Exact number of lessons to create
    """
    pdf_path = UPLOAD_DIR / req.pdf_filename
    
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail=f"PDF file not found: {req.pdf_filename}")
    
    try:
        # Step 1: Divide into lessons
        if req.lesson_count and req.lesson_count > 0:
            lessons = divide_pdf_with_custom_count(str(pdf_path), req.lesson_count)
        else:
            lessons = divide_pdf_into_lessons(str(pdf_path))
        
        # Step 2: Generate flashcards        
        # Step 3: Generate summaries
        from app.services.summary_note_service import generate_summaries_for_lessons
        lessons_with_both = generate_summaries_for_lessons(lessons)
        
        # Step 4: Explicitly structure response to match schema
        validated_lessons = [
            {
                "lesson_number": lesson.get("lesson_number"),
                "name": lesson.get("name"),
                "content": lesson.get("content"),
                "summary": lesson.get("summary", {
                    "brief_summary": "",
                    "detailed_summary": "",
                    "key_points": [],
                    "important_terms": []
                })
            }
            for lesson in lessons_with_both
        ]
        
        return {
            "lessons": validated_lessons,
            "total_lessons": len(validated_lessons),
            "pdf_filename": req.pdf_filename
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")