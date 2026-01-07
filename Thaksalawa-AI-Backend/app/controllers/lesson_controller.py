from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from app.database.mysql_database import SessionLocal
from app.models.lesson_model import LessonModel
from app.models.subject_model import SubjectModel
from typing import List, Dict
import requests
import os
from app.models.lesson_key_points_model import LessonKeyPointsModel


AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8001") #if not using nginx reverse proxy use this value


def create_lesson(payload):
    """Create a single lesson"""
    session = SessionLocal()
    try:
        data = payload if isinstance(payload, dict) else payload.__dict__
        
        # Validate subject exists
        subject_id = data.get("subject_id")
        if not session.query(SubjectModel).filter_by(sub_id=subject_id).first():
            raise HTTPException(status_code=404, detail="Subject not found")
        
        lesson = LessonModel(
            lesson_number=data.get("lesson_number"),
            name=data.get("name"),
            content=data.get("content"),
            brief_summary=data.get("summary", {}).get("brief_summary") if isinstance(data.get("summary"), dict) else data.get("brief_summary"),
            Subject_sub_id=subject_id
        )
        
        session.add(lesson)
        session.flush()  # Flush to get the lesson_id before adding key points
        
        # Extract and add key points from nested summary object or directly
        key_points = []
        if isinstance(data.get("summary"), dict):
            key_points = data["summary"].get("key_points", [])
        else:
            key_points = data.get("key_points", [])
        
        # Add each key point to the database
        if key_points:
            for point in key_points:
                key_point_record = LessonKeyPointsModel(
                    lesson_lesson_id=lesson.lesson_id,
                    key_point=str(point).strip()
                )
                session.add(key_point_record)
        
        session.commit()
        session.refresh(lesson)
        return lesson
        
    except HTTPException:
        session.rollback()
        raise
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        session.close()


def create_multiple_lessons(lessons_data: List[Dict], subject_id: int):
    """Create multiple lessons at once"""
    session = SessionLocal()
    try:
        # Validate subject exists
        if not session.query(SubjectModel).filter_by(sub_id=subject_id).first():
            raise HTTPException(status_code=404, detail="Subject not found")
        
        created_lessons = []
        for lesson_data in lessons_data:
            # Extract brief_summary from nested summary object or directly
            brief_summary = None
            if isinstance(lesson_data.get("summary"), dict):
                brief_summary = lesson_data["summary"].get("brief_summary")
            else:
                brief_summary = lesson_data.get("brief_summary")
            
            # Create lesson
            lesson = LessonModel(
                lesson_number=lesson_data.get("lesson_number"),
                name=lesson_data.get("name"),
                content=lesson_data.get("content"),
                brief_summary=brief_summary,
                Subject_sub_id=subject_id
            )
            session.add(lesson)
            session.flush()  # Flush to get the lesson_id
            
            # Extract and add key points from nested summary object or directly
            key_points = []
            if isinstance(lesson_data.get("summary"), dict):
                key_points = lesson_data["summary"].get("key_points", [])
            else:
                key_points = lesson_data.get("key_points", [])
            
            # Add each key point to the database
            if key_points:
                for point in key_points:
                    key_point_record = LessonKeyPointsModel(
                        lesson_lesson_id=lesson.lesson_id,
                        key_point=str(point).strip()
                    )
                    session.add(key_point_record)
            
            created_lessons.append(lesson)
        
        session.commit()
        
        # Refresh all lessons
        for lesson in created_lessons:
            session.refresh(lesson)
        
        return created_lessons
        
    except HTTPException:
        session.rollback()
        raise
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        session.close()


def get_all_lessons():
    """Get all lessons"""
    session = SessionLocal()
    try:
        return session.query(LessonModel).all()
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()


def get_lessons_by_subject(subject_id: int):
    """Get all lessons for a specific subject"""
    session = SessionLocal()
    try:
        lessons = session.query(LessonModel).filter_by(Subject_sub_id=subject_id).order_by(LessonModel.lesson_number).all()
        return lessons
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()


def get_lesson_by_id(lesson_id: int):
    """Get a specific lesson by ID"""
    session = SessionLocal()
    try:
        lesson = session.query(LessonModel).filter_by(lesson_id=lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        return lesson
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()


def get_lesson_by_number(subject_id: int, lesson_number: int):
    """Get a specific lesson by subject and lesson number"""
    session = SessionLocal()
    try:
        lesson = session.query(LessonModel).filter_by(
            Subject_sub_id=subject_id,
            lesson_number=lesson_number
        ).first()
        
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        return lesson
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()


def delete_lesson(lesson_id: int):
    """Delete a specific lesson"""
    session = SessionLocal()
    try:
        lesson = session.query(LessonModel).filter_by(lesson_id=lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        
        session.delete(lesson)
        session.commit()
        return {"message": "Lesson deleted successfully"}
    except SQLAlchemyError:
        session.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()


def delete_lessons_by_subject(subject_id: int):
    """Delete all lessons for a specific subject"""
    session = SessionLocal()
    try:
        lessons = session.query(LessonModel).filter_by(Subject_sub_id=subject_id).all()
        count = len(lessons)
        
        for lesson in lessons:
            session.delete(lesson)
        
        session.commit()
        return {"message": f"Deleted {count} lessons", "count": count}
    except SQLAlchemyError:
        session.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()


def process_and_store_lessons(pdf_filename: str, subject_id: int, lesson_count: int = None):
    """
    Call AI service to divide PDF into lessons and store them in database
    """
    try:
        # Call AI service to divide lessons
        ai_response = requests.post(
            f"http://localhost:8080/ai/lessons/divide-lessons-with-notes-and-summary",      #if you are not using nginx reverse proxy change the url to AI_SERVICE_URL
            json={
                "pdf_filename": pdf_filename,
                "lesson_count": lesson_count
            },
            timeout=300  # 5 minutes timeout for large PDFs
        )
        
        if ai_response.status_code != 200:
            raise HTTPException(
                status_code=ai_response.status_code,
                detail=f"AI service error: {ai_response.text}"
            )
        
        ai_data = ai_response.json()
        lessons_data = ai_data.get("lessons", [])
        
        if not lessons_data:
            raise HTTPException(status_code=400, detail="No lessons generated by AI")
        
        # Store lessons in database
        created_lessons = create_multiple_lessons(lessons_data, subject_id)
        
        return {
            "message": "Lessons processed and stored successfully",
            "total_lessons": len(created_lessons),
            "lessons": created_lessons
        }
        
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Failed to connect to AI service: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing lessons: {str(e)}")