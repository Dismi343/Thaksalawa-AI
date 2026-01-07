from fastapi import HTTPException, Depends
from sqlalchemy.exc import SQLAlchemyError
from app.database.mysql_database import SessionLocal
from app.models.flash_card_model import FlashCardModel
from app.models.lesson_model import LessonModel
from app.schema.flash_card_schema import FlashCardResponseSchema, Difficulty
from typing import List, Dict
import requests
import os

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL")


def create_flashcard(payload: Dict) -> FlashCardModel:
    """Create a single flashcard"""
    session = SessionLocal()
    try:
        data = payload if isinstance(payload, dict) else payload.__dict__
        
        # Validate lesson exists
        lesson_id = data.get("lesson_id")
        if not session.query(LessonModel).filter_by(lesson_id=lesson_id).first():
            raise HTTPException(status_code=404, detail="Lesson not found")
        
        # Validate difficulty level
        difficulty = data.get("difficulty", "medium").lower()
        if difficulty not in ["easy", "medium", "hard"]:
            raise HTTPException(status_code=400, detail="Invalid difficulty level")
        
        flashcard = FlashCardModel(
            question=data.get("question"),
            answer=data.get("answer"),
            difficulty=difficulty,
            lesson_id=lesson_id,
            teacher_id=data.get("teacher_id"),
            student_id=data.get("student_id")
        )
        
        session.add(flashcard)
        session.commit()
        session.refresh(flashcard)
        return flashcard
        
    except HTTPException:
        session.rollback()
        raise
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        session.close()


def create_multiple_flashcards(flashcards_data: List[Dict], lesson_id: int) -> List[FlashCardModel]:
    """Create multiple flashcards at once"""
    session = SessionLocal()
    try:
        # Validate lesson exists
        if not session.query(LessonModel).filter_by(lesson_id=lesson_id).first():
            raise HTTPException(status_code=404, detail="Lesson not found")
        
        created_flashcards = []
        for card_data in flashcards_data:
            # Validate difficulty level
            difficulty = card_data.get("difficulty", "medium").lower()
            if difficulty not in ["easy", "medium", "hard"]:
                raise HTTPException(status_code=400, detail="Invalid difficulty level")
            
            flashcard = FlashCardModel(
                question=card_data.get("question"),
                answer=card_data.get("answer"),
                difficulty=difficulty,
                lesson_id=lesson_id,
                teacher_id=card_data.get("teacher_id"),
                student_id=card_data.get("student_id")
            )
            session.add(flashcard)
            created_flashcards.append(flashcard)
        
        session.commit()
        
        # Refresh all flashcards
        for flashcard in created_flashcards:
            session.refresh(flashcard)
        
        return created_flashcards
        
    except HTTPException:
        session.rollback()
        raise
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        session.close()


def get_all_flashcards():
    """Get all flashcards"""
    session = SessionLocal()
    try:
        return session.query(FlashCardModel).all()
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()


def get_flashcards_by_lesson(lesson_id: int):
    """Get all flashcards for a specific lesson"""
    session = SessionLocal()
    try:
        flashcards = session.query(FlashCardModel).filter_by(lesson_id=lesson_id).all()
        return flashcards
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()


def get_flashcard_by_id(card_id: int):
    """Get a specific flashcard by ID"""
    session = SessionLocal()
    try:
        flashcard = session.query(FlashCardModel).filter_by(card_id=card_id).first()
        if not flashcard:
            raise HTTPException(status_code=404, detail="Flashcard not found")
        return flashcard
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()


def delete_flashcard(card_id: int):
    """Delete a specific flashcard"""
    session = SessionLocal()
    try:
        flashcard = session.query(FlashCardModel).filter_by(card_id=card_id).first()
        if not flashcard:
            raise HTTPException(status_code=404, detail="Flashcard not found")
        
        session.delete(flashcard)
        session.commit()
        return {"message": "Flashcard deleted successfully"}
    except SQLAlchemyError:
        session.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()


def delete_flashcards_by_lesson(lesson_id: int):
    """Delete all flashcards for a specific lesson"""
    session = SessionLocal()
    try:
        flashcards = session.query(FlashCardModel).filter_by(lesson_id=lesson_id).all()
        count = len(flashcards)
        
        for flashcard in flashcards:
            session.delete(flashcard)
        
        session.commit()
        return {"message": f"Deleted {count} flashcards", "count": count}
    except SQLAlchemyError:
        session.rollback()
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()


def generate_and_store_flashcards_for_subject(subject_id: int):
    """
    Generate flashcards from AI service for all lessons in a subject and store in database.
    
    Process:
    1. Call AI service to generate flashcards for all lessons in subject
    2. Store all generated flashcards in database
    3. Return summary with counts
    """
    try:
        print(f"[Subject {subject_id}] Calling AI service to generate flashcards...", flush=True)
        
        # Call AI service to generate flashcards for subject
        ai_response = requests.post(
            f"{AI_SERVICE_URL}/ai/flashcards/generate-flashcards-subject/{subject_id}",
            timeout=1200  # 10 minutes timeout for large subjects
        )
        
        if ai_response.status_code != 200:
            raise HTTPException(
                status_code=ai_response.status_code,
                detail=f"AI service error: {ai_response.text}"
            )
        
        ai_data = ai_response.json()
        lessons = ai_data.get("lessons", [])
        
        if not lessons:
            raise HTTPException(status_code=400, detail="No flashcards generated by AI service")
        
        # Store all flashcards in database
        total_stored = 0
        session = SessionLocal()
        
        try:
            for lesson_data in lessons:
                lesson_id = lesson_data.get("lesson_id")
                flashcards = lesson_data["lessons"][0].get("flashcards", [])                
                # Validate lesson exists
                if not session.query(LessonModel).filter_by(lesson_id=lesson_id).first():
                    print(f"[Subject {subject_id}] ✗ Lesson {lesson_id} not found, skipping", flush=True)
                    continue
                
                # Create flashcard records
                for card in flashcards:
                    try:
                        difficulty = card.get("difficulty", "medium").lower()
                        if difficulty not in ["easy", "medium", "hard"]:
                            difficulty = "medium"
                        
                        flashcard_model = FlashCardModel(
                            question=card.get("question", ""),
                            answer=card.get("answer", ""),
                            difficulty=difficulty,
                            lesson_lesson_id=lesson_id,
                            teacher_teacher_id=card.get("teacher_teacher_id"),
                            student_student_id=card.get("student_student_id")
                        )
                        session.add(flashcard_model)
                        total_stored += 1
                    
                    except Exception as e:
                        print(f"[Subject {subject_id}] ✗ Error storing flashcard: {str(e)}", flush=True)
                        continue
            
            session.commit()
            print(f"[Subject {subject_id}] ✓ Stored {total_stored} flashcards in database", flush=True)
        
        except SQLAlchemyError as e:
            session.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        finally:
            session.close()
        
        return {
            "message": "Flashcards generated and stored successfully",
            "subject_id": subject_id,
            "total_lessons": ai_data.get("total_lessons", 0),
            "total_flashcards_generated": ai_data.get("total_flashcards", 0),
            "total_flashcards_stored": total_stored,
            "lessons": lessons
        }
        
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Failed to connect to AI service: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating flashcards: {str(e)}")


def generate_and_store_flashcards_for_lesson(lesson_id: int):
    """
    Generate flashcards from AI service for a single lesson and store in database.
    
    Process:
    1. Call AI service to generate flashcards for lesson
    2. Store all generated flashcards in database
    3. Return stored flashcards
    """
    try:
        # Validate lesson exists
        session = SessionLocal()
        lesson = session.query(LessonModel).filter_by(lesson_id=lesson_id).first()
        if not lesson:
            session.close()
            raise HTTPException(status_code=404, detail="Lesson not found")
        session.close()
        
        print(f"[Lesson {lesson_id}] Calling AI service to generate flashcards...", flush=True)
        
        # Call AI service to generate flashcards for lesson
        ai_response = requests.post(
            f"{AI_SERVICE_URL}/ai/flashcards/generate-flashcards/{lesson_id}",
            timeout=300  # 5 minutes timeout
        )
        
        if ai_response.status_code != 200:
            raise HTTPException(
                status_code=ai_response.status_code,
                detail=f"AI service error: {ai_response.text}"
            )
        
        ai_data = ai_response.json()
        flashcards_data = ai_data.get("flashcards", [])
        
        if not flashcards_data:
            raise HTTPException(status_code=400, detail="No flashcards generated by AI service")
        
        # Store flashcards in database
        print(f"[Lesson {lesson_id}] Storing {len(flashcards_data)} flashcards in database...", flush=True)
        
        session = SessionLocal()
        try:
            created_flashcards = []
            
            for card in flashcards_data:
                try:
                    difficulty = card.get("difficulty", "medium").lower()
                    if difficulty not in ["easy", "medium", "hard"]:
                        difficulty = "medium"
                    
                    flashcard_model = FlashCardModel(
                        question=card.get("question", ""),
                        answer=card.get("answer", ""),
                        difficulty=difficulty,
                        lesson_lesson_id=lesson_id,
                        teacher_teacher_id=card.get("teacher_teacher_id"),
                        student_student_id=card.get("student_student_id")
                    )
                    session.add(flashcard_model)
                    created_flashcards.append(flashcard_model)
                
                except Exception as e:
                    print(f"[Lesson {lesson_id}] ✗ Error storing flashcard: {str(e)}", flush=True)
                    continue
            
            session.commit()
            
            # Refresh all flashcards
            for flashcard in created_flashcards:
                session.refresh(flashcard)
            
            print(f"[Lesson {lesson_id}] ✓ Stored {len(created_flashcards)} flashcards", flush=True)
            
            return {
                "message": "Flashcards generated and stored successfully",
                "lesson_id": lesson_id,
                "total_flashcards": len(created_flashcards),
                "flashcards": created_flashcards
            }
        
        except SQLAlchemyError as e:
            session.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        finally:
            session.close()
        
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Failed to connect to AI service: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating flashcards: {str(e)}")