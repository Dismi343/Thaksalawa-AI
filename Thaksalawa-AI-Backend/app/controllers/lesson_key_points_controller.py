from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from app.database.mysql_database import SessionLocal
from typing import List, Dict
import requests
from app.models.lesson_key_points_model import LessonKeyPointsModel

def get_key_points_by_lesson_id(lesson_id: int) -> List[Dict]:
    """Retrieve key points for a given lesson ID"""
    session = SessionLocal()
    try:
        key_points_records = session.query(LessonKeyPointsModel).filter_by(lesson_lesson_id=lesson_id).all()
        key_points = [{"point_id": kp.point_id, "key_point": kp.key_point} for kp in key_points_records]
        return key_points
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred")
    finally:
        session.close()