from fastapi import HTTPException
from app.controllers.quiz_controller import (
    create_quiz_with_questions,
    get_quiz_by_id,
    submit_answer,
    get_quiz_progress,
    finish_quiz,
    get_quiz_results,
    get_student_quiz_history
)

def safe_create_quiz(lesson_id: int, student_id: int, num_questions: int, question_type: str, title: str = None):
    try:
        return create_quiz_with_questions(lesson_id, student_id, num_questions, question_type, title)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")

def safe_get_quiz(quiz_id: int, student_id: int):
    try:
        return get_quiz_by_id(quiz_id, student_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")

def safe_submit_answer(quiz_id: int, question_id: int, student_id: int, selected_option: int = None, written_answer: str = None):
    try:
        return submit_answer(quiz_id, question_id, student_id, selected_option, written_answer)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")

def safe_get_quiz_progress(quiz_id: int, student_id: int):
    try:
        return get_quiz_progress(quiz_id, student_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")

def safe_finish_quiz(quiz_id: int, student_id: int):
    try:
        return finish_quiz(quiz_id, student_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")

def safe_get_quiz_results(quiz_id: int, student_id: int):
    try:
        return get_quiz_results(quiz_id, student_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")

def safe_get_student_quiz_history(student_id: int):
    try:
        return get_student_quiz_history(student_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Unexpected error: {str(e)}")