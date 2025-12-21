from fastapi import APIRouter,Depends
from app.auth.auth_config import get_current_active_user
from app.services.quiz_service import (
    safe_create_quiz,
    safe_get_quiz,
    safe_submit_answer,
    safe_get_quiz_progress,
    safe_finish_quiz,
    safe_get_quiz_results,
    safe_get_student_quiz_history,
    safe_get_quize_by_student
)
from app.schema.quiz_schema import (
    CreateQuizRequest,
    SubmitAnswerRequest,
    FinishQuizRequest,
    ResponseQuizList
)
from typing import Annotated


router = APIRouter(
    prefix="/quizzes",
    tags=["quizzes"],
)

@router.post('/create')
def create_quiz_endpoint(request: CreateQuizRequest , current_user : Annotated[dict,Depends(get_current_active_user)]):
    """
    Create a new quiz with AI-generated questions
    """
    student_id=current_user['profile']['id']
    return safe_create_quiz(
        lesson_id=request.lesson_id,
        student_id=student_id,
        num_questions=request.num_questions,
        question_type=request.question_type,
        title=request.title
    )

@router.get('/get/{quiz_id}/student')
def get_quiz_endpoint(quiz_id: int, current_user : Annotated[dict,Depends(get_current_active_user)]):
    """
    Get quiz details with questions (before completion - no answers shown)
    """
    student_id=current_user['profile']['id']
    return safe_get_quiz(quiz_id, student_id)

@router.post('/submit-answer')
def submit_answer_endpoint(request: SubmitAnswerRequest, current_user : Annotated[dict,Depends(get_current_active_user)] ):

    """
    Submit or update an answer for a specific question
    """
    student_id=current_user['profile']['id']
    return safe_submit_answer(
        quiz_id=request.quiz_id,
        question_id=request.question_id,
        student_id=student_id,
        selected_option=request.selected_option,
        written_answer=request.written_answer
    )

@router.get('/progress/{quiz_id}/student')
def get_quiz_progress_endpoint(quiz_id: int, current_user : Annotated[dict,Depends(get_current_active_user)]):
    """
    Get current progress of quiz (how many questions answered)
    """
    student_id = current_user['profile']['id']
    return safe_get_quiz_progress(quiz_id, student_id)

@router.post('/finish')
def finish_quiz_endpoint(request: FinishQuizRequest,current_user : Annotated[dict,Depends(get_current_active_user)]):
    """
    Finish quiz and calculate final score (SAVES SCORE TO DATABASE)
    """
    student_id = current_user['profile']['id']
    return safe_finish_quiz(request.quiz_id, student_id)

@router.get('/results/{quiz_id}/student')
def get_quiz_results_endpoint(quiz_id: int, current_user : Annotated[dict,Depends(get_current_active_user)]):
    """
    Get detailed quiz results with correct answers and explanations
    """
    student_id = current_user['profile']['id']
    return safe_get_quiz_results(quiz_id, student_id)

@router.get('/history/student/{student_id}')
def get_student_quiz_history_endpoint(student_id: int):
    """
    Get all quizzes taken by a student
    """
    return safe_get_student_quiz_history(student_id)

@router.get('/student-quizes',response_model=list[ResponseQuizList])
def get_quize_by_student_endpoint(current_user : Annotated[dict,Depends(get_current_active_user)]):
    """
    Get all quizzes taken by a student
    """
    student_id = current_user['profile']['id']
    return safe_get_quize_by_student(student_id)