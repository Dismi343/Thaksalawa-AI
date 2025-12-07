from fastapi import APIRouter
from app.services.quiz_service import (
    safe_create_quiz,
    safe_get_quiz,
    safe_submit_answer,
    safe_get_quiz_progress,
    safe_finish_quiz,
    safe_get_quiz_results,
    safe_get_student_quiz_history
)
from app.schema.quiz_schema import (
    CreateQuizRequest,
    SubmitAnswerRequest,
    FinishQuizRequest
)

router = APIRouter(
    prefix="/quizzes",
    tags=["quizzes"],
)

@router.post('/create')
def create_quiz_endpoint(request: CreateQuizRequest):
    """
    Create a new quiz with AI-generated questions
    """
    return safe_create_quiz(
        lesson_id=request.lesson_id,
        student_id=request.student_id,
        num_questions=request.num_questions,
        question_type=request.question_type,
        title=request.title
    )

@router.get('/get/{quiz_id}/student/{student_id}')
def get_quiz_endpoint(quiz_id: int, student_id: int):
    """
    Get quiz details with questions (before completion - no answers shown)
    """
    return safe_get_quiz(quiz_id, student_id)

@router.post('/submit-answer')
def submit_answer_endpoint(request: SubmitAnswerRequest):
    """
    Submit or update an answer for a specific question
    """
    return safe_submit_answer(
        quiz_id=request.quiz_id,
        question_id=request.question_id,
        student_id=request.student_id,
        selected_option=request.selected_option,
        written_answer=request.written_answer
    )

@router.get('/progress/{quiz_id}/student/{student_id}')
def get_quiz_progress_endpoint(quiz_id: int, student_id: int):
    """
    Get current progress of quiz (how many questions answered)
    """
    return safe_get_quiz_progress(quiz_id, student_id)

@router.post('/finish')
def finish_quiz_endpoint(request: FinishQuizRequest):
    """
    Finish quiz and calculate final score (SAVES SCORE TO DATABASE)
    """
    return safe_finish_quiz(request.quiz_id, request.student_id)

@router.get('/results/{quiz_id}/student/{student_id}')
def get_quiz_results_endpoint(quiz_id: int, student_id: int):
    """
    Get detailed quiz results with correct answers and explanations
    """
    return safe_get_quiz_results(quiz_id, student_id)

@router.get('/history/student/{student_id}')
def get_student_quiz_history_endpoint(student_id: int):
    """
    Get all quizzes taken by a student
    """
    return safe_get_student_quiz_history(student_id)