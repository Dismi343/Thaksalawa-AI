from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from app.database.mysql_database import SessionLocal
from app.models.quiz_model import QuizModel
from app.models.question_model import QuestionModel, QuestionTypeEnum, QuestionSourceEnum
from app.models.mcq_option_model import MCQOptionModel
from app.models.model_answer_model import ModelAnswerModel
from app.models.keyword_model import KeywordModel
from app.models.student_answer_model import StudentAnswerModel
from app.models.lesson_model import LessonModel
from app.models.student_model import StudentModel
from typing import List, Dict
from datetime import datetime, time
import requests
import os

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8001")

def create_quiz_with_questions(lesson_id: int, student_id: int, num_questions: int, question_type: str, title: str = None):
    """Create a new quiz with AI-generated questions"""
    session = SessionLocal()
    try:
        # Validate lesson exists
        lesson = session.query(LessonModel).filter_by(lesson_id=lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        
        # Validate student exists
        student = session.query(StudentModel).filter_by(student_id=student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Call AI service to generate questions
        try:
            ai_response = requests.post(
                f"{AI_SERVICE_URL}/ai/quiz/generate-questions",
                json={
                    "lesson_content": lesson.content,
                    "num_questions": num_questions,
                    "question_type": question_type
                },
                timeout=120
            )
            
            if ai_response.status_code != 200:
                raise HTTPException(status_code=ai_response.status_code, 
                                  detail=f"AI service error: {ai_response.text}")
            
            ai_data = ai_response.json()
            questions_data = ai_data.get("questions", [])
            
        except requests.RequestException as e:
            raise HTTPException(status_code=503, detail=f"Failed to connect to AI service: {str(e)}")
        
        # Create quiz
        if not title:
            title = f"{lesson.name} - Quiz"
        
        quiz = QuizModel(
            score=0,
            q_count=num_questions,
            title=title,
            q_type="AI",
            Lesson_lesson_id=lesson_id,
            Student_id=student_id
        )
        
        session.add(quiz)
        session.flush()  # Get quiz_id
        
        # Create questions
        for q_data in questions_data:
            if question_type == "mcq":
                # Create MCQ question
                question = QuestionModel(
                    question_text=q_data["question_text"],
                    question_type=QuestionTypeEnum.mcq,
                    source=QuestionSourceEnum.AI,
                    explanation=q_data.get("explanation", ""),
                    quiz_quiz_id=quiz.quiz_id
                )
                session.add(question)
                session.flush()
                
                # Create options
                for idx, option_text in enumerate(q_data["options"]):
                    option = MCQOptionModel(
                        option_text=option_text,
                        is_correct=(idx == q_data["correct_answer"]),
                        option_order=idx,
                        question_id=question.question_id
                    )
                    session.add(option)
            
            elif question_type == "short":
                # Create short answer question
                question = QuestionModel(
                    question_text=q_data["question_text"],
                    question_type=QuestionTypeEnum.short,
                    source=QuestionSourceEnum.AI,
                    quiz_quiz_id=quiz.quiz_id
                )
                session.add(question)
                session.flush()
                
                # Create model answer
                model_answer = ModelAnswerModel(
                    answer_text=q_data["model_answer"],
                    max_score=q_data.get("max_score", 10),
                    question_id=question.question_id
                )
                session.add(model_answer)
                session.flush()
                
                # Create keywords
                for kw_text in q_data.get("keywords", []):
                    keyword = KeywordModel(
                        keyword_text=kw_text,
                        model_answer_model_answer_id=model_answer.model_answer_id
                    )
                    session.add(keyword)
        
        session.commit()
        session.refresh(quiz)
        
        # Build response with questions
        quiz_response = {
            "quiz_id": quiz.quiz_id,
            "title": quiz.title,
            "score": quiz.score,
            "q_count": quiz.q_count,
            "duration": str(quiz.duration) if quiz.duration else None,
            "q_type": quiz.q_type.value,
            "created_at": quiz.created_at.isoformat() if quiz.created_at else None,
            "completed_at": quiz.completed_at.isoformat() if quiz.completed_at else None,
            "Lesson_lesson_id": quiz.Lesson_lesson_id,
            "Student_id": quiz.Student_id,
            "questions": []
        }
        
        # Add questions with options (but not correct answers yet)
        for question in quiz.questions:
            question_data = {
                "question_id": question.question_id,
                "question_text": question.question_text,
                "question_type": question.question_type.value
            }
            
            if question.question_type == QuestionTypeEnum.mcq:
                # Add options without showing which is correct
                options = []
                for opt in sorted(question.mcq_options, key=lambda x: x.option_order):
                    options.append({
                        "option_id": opt.option_id,
                        "option_text": opt.option_text,
                        "option_order": opt.option_order
                    })
                question_data["options"] = options
            
            quiz_response["questions"].append(question_data)
        
        return quiz_response
        
    except HTTPException:
        session.rollback()
        raise
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        session.close()

def get_quiz_by_id(quiz_id: int, student_id: int):
    """Get quiz with questions (without answers before completion)"""
    session = SessionLocal()
    try:
        quiz = session.query(QuizModel).filter_by(quiz_id=quiz_id, Student_id=student_id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        # Build response with questions
        quiz_response = {
            "quiz_id": quiz.quiz_id,
            "title": quiz.title,
            "score": quiz.score,
            "q_count": quiz.q_count,
            "duration": str(quiz.duration) if quiz.duration else None,
            "q_type": quiz.q_type.value,
            "created_at": quiz.created_at.isoformat() if quiz.created_at else None,
            "completed_at": quiz.completed_at.isoformat() if quiz.completed_at else None,
            "Lesson_lesson_id": quiz.Lesson_lesson_id,
            "Student_id": quiz.Student_id,
            "questions": []
        }
        
        # Add questions with options
        for question in quiz.questions:
            question_data = {
                "question_id": question.question_id,
                "question_text": question.question_text,
                "question_type": question.question_type.value
            }
            
            if question.question_type == QuestionTypeEnum.mcq:
                options = []
                for opt in sorted(question.mcq_options, key=lambda x: x.option_order):
                    options.append({
                        "option_id": opt.option_id,
                        "option_text": opt.option_text,
                        "option_order": opt.option_order
                    })
                question_data["options"] = options
            
            quiz_response["questions"].append(question_data)
        
        return quiz_response
        
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()

def submit_answer(quiz_id: int, question_id: int, student_id: int, selected_option: int = None, written_answer: str = None):
    """Submit an answer for a question"""
    session = SessionLocal()
    try:
        # Validate quiz and question
        quiz = session.query(QuizModel).filter_by(quiz_id=quiz_id, Student_id=student_id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        if quiz.completed_at:
            raise HTTPException(status_code=400, detail="Quiz already completed")
        
        question = session.query(QuestionModel).filter_by(question_id=question_id, quiz_quiz_id=quiz_id).first()
        if not question:
            raise HTTPException(status_code=404, detail="Question not found in this quiz")
        
        # Check if answer already exists
        existing_answer = session.query(StudentAnswerModel).filter_by(
            question_id=question_id,
            Student_id=student_id
        ).first()
        
        if existing_answer:
            # Update existing answer
            if question.question_type == QuestionTypeEnum.mcq:
                existing_answer.selected_option = selected_option
            else:
                existing_answer.written_answer = written_answer
        else:
            # Create new answer
            student_answer = StudentAnswerModel(
                question_id=question_id,
                Student_id=student_id,
                selected_option=selected_option if question.question_type == QuestionTypeEnum.mcq else None,
                written_answer=written_answer if question.question_type == QuestionTypeEnum.short else None
            )
            session.add(student_answer)
        
        session.commit()
        return {"message": "Answer submitted successfully"}
        
    except HTTPException:
        session.rollback()
        raise
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        session.close()

def get_quiz_progress(quiz_id: int, student_id: int):
    """Get current progress of the quiz"""
    session = SessionLocal()
    try:
        quiz = session.query(QuizModel).filter_by(quiz_id=quiz_id, Student_id=student_id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        total_questions = len(quiz.questions)
        answered_count = session.query(StudentAnswerModel).filter_by(Student_id=student_id).join(
            QuestionModel
        ).filter(QuestionModel.quiz_quiz_id == quiz_id).count()
        
        return {
            "quiz_id": quiz_id,
            "total_questions": total_questions,
            "answered_questions": answered_count,
            "remaining_questions": total_questions - answered_count,
            "current_score": quiz.score
        }
        
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()

def finish_quiz(quiz_id: int, student_id: int):
    """Complete quiz and calculate final score"""
    session = SessionLocal()
    try:
        quiz = session.query(QuizModel).filter_by(quiz_id=quiz_id, Student_id=student_id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        if quiz.completed_at:
            raise HTTPException(status_code=400, detail="Quiz already completed")
        
        total_score = 0
        max_possible_score = 0
        
        # Evaluate all answers
        for question in quiz.questions:
            student_answer = session.query(StudentAnswerModel).filter_by(
                question_id=question.question_id,
                Student_id=student_id
            ).first()
            
            if not student_answer:
                continue
            
            if question.question_type == QuestionTypeEnum.mcq:
                # Evaluate MCQ
                correct_option = session.query(MCQOptionModel).filter_by(
                    question_id=question.question_id,
                    is_correct=True
                ).first()
                
                if correct_option and student_answer.selected_option == correct_option.option_order:
                    student_answer.is_correct = True
                    student_answer.score_obtained = 1
                    total_score += 1
                else:
                    student_answer.is_correct = False
                    student_answer.score_obtained = 0
                
                max_possible_score += 1
                
            elif question.question_type == QuestionTypeEnum.short:
                # Evaluate short answer using AI
                model_answer = session.query(ModelAnswerModel).filter_by(
                    question_id=question.question_id
                ).first()
                
                if model_answer and student_answer.written_answer:
                    keywords = [kw.keyword_text for kw in model_answer.keywords]
                    
                    try:
                        eval_response = requests.post(
                            f"{AI_SERVICE_URL}/quiz/evaluate-answer",
                            json={
                                "student_answer": student_answer.written_answer,
                                "model_answer": model_answer.answer_text,
                                "keywords": keywords,
                                "max_score": model_answer.max_score
                            },
                            timeout=60
                        )
                        
                        if eval_response.status_code == 200:
                            eval_data = eval_response.json()
                            student_answer.score_obtained = eval_data["score"]
                            student_answer.feedback = eval_data["feedback"]
                            total_score += eval_data["score"]
                        else:
                            student_answer.score_obtained = 0
                            student_answer.feedback = "Error evaluating answer"
                    
                    except:
                        # Fallback scoring
                        student_answer.score_obtained = 0
                        student_answer.feedback = "Unable to evaluate answer"
                    
                    max_possible_score += model_answer.max_score
        
        # Update quiz with final score and completion time
        quiz.score = total_score
        quiz.completed_at = datetime.now()
        
        session.commit()
        
        return {
            "quiz_id": quiz_id,
            "total_score": total_score,
            "max_possible_score": max_possible_score,
            "percentage": (total_score / max_possible_score * 100) if max_possible_score > 0 else 0
        }
        
    except HTTPException:
        session.rollback()
        raise
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        session.close()

def get_quiz_results(quiz_id: int, student_id: int):
    """Get detailed quiz results after completion"""
    session = SessionLocal()
    try:
        quiz = session.query(QuizModel).filter_by(quiz_id=quiz_id, Student_id=student_id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        if not quiz.completed_at:
            raise HTTPException(status_code=400, detail="Quiz not yet completed")
        
        questions_with_answers = []
        max_score = 0
        
        for question in quiz.questions:
            student_answer = session.query(StudentAnswerModel).filter_by(
                question_id=question.question_id,
                Student_id=student_id
            ).first()
            
            question_data = {
                "question_id": question.question_id,
                "question_text": question.question_text,
                "question_type": question.question_type.value,
                "explanation": question.explanation
            }
            
            if question.question_type == QuestionTypeEnum.mcq:
                options = []
                for opt in question.mcq_options:
                    options.append({
                        "option_text": opt.option_text,
                        "option_order": opt.option_order,
                        "is_correct": opt.is_correct,
                        "was_selected": student_answer and student_answer.selected_option == opt.option_order
                    })
                question_data["options"] = options
                question_data["student_selected"] = student_answer.selected_option if student_answer else None
                question_data["is_correct"] = student_answer.is_correct if student_answer else False
                question_data["score_obtained"] = student_answer.score_obtained if student_answer else 0
                max_score += 1
            
            elif question.question_type == QuestionTypeEnum.short:
                model_answer = session.query(ModelAnswerModel).filter_by(
                    question_id=question.question_id
                ).first()
                
                question_data["model_answer"] = model_answer.answer_text if model_answer else ""
                question_data["student_answer"] = student_answer.written_answer if student_answer else ""
                question_data["score_obtained"] = student_answer.score_obtained if student_answer else 0
                question_data["max_score"] = model_answer.max_score if model_answer else 10
                question_data["feedback"] = student_answer.feedback if student_answer else ""
                max_score += model_answer.max_score if model_answer else 10
            
            questions_with_answers.append(question_data)
        
        return {
            "quiz_id": quiz.quiz_id,
            "title": quiz.title,
            "total_questions": quiz.q_count,
            "score": quiz.score,
            "max_score": max_score,
            "percentage": (quiz.score / max_score * 100) if max_score > 0 else 0,
            "completed_at": quiz.completed_at,
            "questions_with_answers": questions_with_answers
        }
        
    except HTTPException:
        raise
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()

def get_student_quiz_history(student_id: int):
    """Get all quizzes taken by a student"""
    session = SessionLocal()
    try:
        quizzes = session.query(QuizModel).filter_by(Student_id=student_id).order_by(
            QuizModel.created_at.desc()
        ).all()
        
        return quizzes
        
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()

def get_quize_by_student(student_id:int):
    """Get all quizzes taken by a student"""
    session = SessionLocal()
    try:
        quizzes = session.query(QuizModel).filter_by(Student_id=student_id).order_by(
            QuizModel.created_at.desc()
        ).all()
        
        quiz_list=[]
        for quiz in quizzes:
            quiz_list.append({
                "quiz_id":quiz.quiz_id,
                "score":quiz.score,
                "title":quiz.title,
                "created_at":quiz.created_at
            })
        return quiz_list
        
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        session.close()