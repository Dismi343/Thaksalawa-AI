from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.quiz_service import (
    generate_mcq_questions,
    generate_short_answer_questions,
    evaluate_short_answer
)

router = APIRouter()

class GenerateQuestionsRequest(BaseModel):
    lesson_content: str
    num_questions: int
    question_type: str  # "mcq" or "short"

class EvaluateAnswerRequest(BaseModel):
    student_answer: str
    model_answer: str
    keywords: List[str]
    max_score: int

class GeneratedQuestionsResponse(BaseModel):
    questions: List[dict]
    total_questions: int
    question_type: str

@router.post("/generate-questions", response_model=GeneratedQuestionsResponse)
async def generate_questions(req: GenerateQuestionsRequest):
    """
    Generate quiz questions from lesson content.
    question_type: 'mcq' or 'short'
    """
    try:
        if req.question_type == "mcq":
            questions = generate_mcq_questions(req.lesson_content, req.num_questions)
        elif req.question_type == "short":
            questions = generate_short_answer_questions(req.lesson_content, req.num_questions)
        else:
            raise HTTPException(status_code=400, detail="Invalid question_type. Must be 'mcq' or 'short'")
        
        return {
            "questions": questions,
            "total_questions": len(questions),
            "question_type": req.question_type
        }
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating questions: {str(e)}")

@router.post("/evaluate-answer")
async def evaluate_answer(req: EvaluateAnswerRequest):
    """
    Evaluate a short answer question
    """
    try:
        result = evaluate_short_answer(
            req.student_answer,
            req.model_answer,
            req.keywords,
            req.max_score
        )
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating answer: {str(e)}")