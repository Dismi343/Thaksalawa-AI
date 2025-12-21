from pydantic import BaseModel
from typing import List, Optional
from datetime import time, datetime

# Request Schemas
class CreateQuizRequest(BaseModel):
    lesson_id: int
    num_questions: int
    question_type: str  # "mcq" or "short"
    title: Optional[str] = None

class SubmitAnswerRequest(BaseModel):
    quiz_id: int
    question_id: int
    # For MCQ
    selected_option: Optional[int] = None
    # For Short Answer
    written_answer: Optional[str] = None

class FinishQuizRequest(BaseModel):
    quiz_id: int

# Response Schemas
class MCQOptionResponse(BaseModel):
    option_id: int
    option_text: str
    option_order: int
    is_correct: Optional[bool] = None  # Only sent after quiz completion
    
    class Config:
        from_attributes = True

class QuestionResponse(BaseModel):
    question_id: int
    question_text: str
    question_type: str
    options: Optional[List[MCQOptionResponse]] = None
    explanation: Optional[str] = None  # For MCQ, shown after completion
    
    class Config:
        from_attributes = True

class StudentAnswerResponse(BaseModel):
    question_id: int
    selected_option: Optional[int] = None
    written_answer: Optional[str] = None
    is_correct: Optional[bool] = None
    score_obtained: Optional[int] = None
    feedback: Optional[str] = None
    
    class Config:
        from_attributes = True

class QuizResponse(BaseModel):
    quiz_id: int
    title: str
    q_count: int
    score: int
    duration: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    lesson_id: int
    student_id: int
    questions: List[QuestionResponse]
    
    class Config:
        from_attributes = True

class QuizResultResponse(BaseModel):
    quiz_id: int
    title: str
    total_questions: int
    score: int
    max_score: int
    percentage: float
    duration: Optional[str] = None
    completed_at: datetime
    questions_with_answers: List[dict]  # Detailed breakdown
    
    class Config:
        from_attributes = True

class QuizProgressResponse(BaseModel):
    quiz_id: int
    total_questions: int
    answered_questions: int
    remaining_questions: int
    current_score: int
    
    class Config:
        from_attributes = True

class ResponseQuizList(BaseModel):
    quiz_id:int
    score:int |Optional[None]
    title:str
    created_at:datetime