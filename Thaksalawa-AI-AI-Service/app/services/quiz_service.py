from typing import List, Dict
from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not set in .env")

client = OpenAI(api_key=OPENAI_API_KEY)

def safe_parse_json_response(text: str) -> Dict:
    """Parse JSON response from AI, handling potential formatting issues"""
    text = text.strip()
    
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
    if text.endswith("```"):
        text = text[:-3].strip()
    
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to decode JSON response from AI: {e}")

def generate_mcq_questions(lesson_content: str, num_questions: int) -> List[Dict]:
    """
    Generate multiple choice questions from lesson content
    Returns: List of dicts with structure:
    {
        "question_text": str,
        "options": [str, str, str, str],
        "correct_answer": int (0-3 index),
        "explanation": str
    }
    """
    system_prompt = f"""
You are an expert educational content creator. Generate {num_questions} high-quality multiple choice questions 
based on the provided lesson content.

RULES:
1. Each question must have exactly 4 options
2. Options should be plausible but only one correct
3. Questions should test understanding, not just memorization
4. Include an explanation for the correct answer
5. Questions should be clear and unambiguous
6. OUTPUT: Return a JSON object with key "questions" containing an array of question objects

Each question object must have:
- "question_text": the question
- "options": array of 4 option strings
- "correct_answer": index (0-3) of the correct option
- "explanation": brief explanation of the correct answer
"""

    user_prompt = f"""
Generate {num_questions} multiple choice questions from this lesson content:

CONTENT:
{lesson_content}
"""

    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            max_completion_tokens=8000
        )
        
        raw_response = response.choices[0].message.content.strip()
        data = safe_parse_json_response(raw_response)
        
        if "questions" not in data or not isinstance(data["questions"], list):
            raise ValueError("AI response did not contain expected 'questions' array")
        
        questions = data["questions"]
        
        # Validate structure
        for q in questions:
            required_keys = ["question_text", "options", "correct_answer", "explanation"]
            if not all(k in q for k in required_keys):
                raise ValueError("Invalid question structure")
            if len(q["options"]) != 4:
                raise ValueError("Each question must have exactly 4 options")
            if not 0 <= q["correct_answer"] <= 3:
                raise ValueError("correct_answer must be between 0 and 3")
        
        return questions[:num_questions]  # Ensure we return exact number requested
        
    except Exception as e:
        raise ValueError(f"Error generating questions: {e}")

def generate_short_answer_questions(lesson_content: str, num_questions: int) -> List[Dict]:
    """
    Generate short answer questions from lesson content
    Returns: List of dicts with structure:
    {
        "question_text": str,
        "model_answer": str,
        "keywords": [str, str, ...],
        "max_score": int
    }
    """
    system_prompt = f"""
You are an expert educational content creator. Generate {num_questions} high-quality short answer questions 
based on the provided lesson content.

RULES:
1. Questions should require 2-4 sentence answers
2. Provide a model answer for each question
3. Extract 3-5 key concepts/keywords that must be in a correct answer
4. Assign a max score (typically 5-10 points)
5. OUTPUT: Return a JSON object with key "questions" containing an array of question objects

Each question object must have:
- "question_text": the question
- "model_answer": complete model answer (2-4 sentences)
- "keywords": array of 3-5 essential keywords/concepts
- "max_score": integer score value
"""

    user_prompt = f"""
Generate {num_questions} short answer questions from this lesson content:

CONTENT:
{lesson_content}
"""

    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            max_completion_tokens=8000
        )
        
        raw_response = response.choices[0].message.content.strip()
        data = safe_parse_json_response(raw_response)
        
        if "questions" not in data or not isinstance(data["questions"], list):
            raise ValueError("AI response did not contain expected 'questions' array")
        
        questions = data["questions"]
        
        # Validate structure
        for q in questions:
            required_keys = ["question_text", "model_answer", "keywords", "max_score"]
            if not all(k in q for k in required_keys):
                raise ValueError("Invalid question structure")
            if not isinstance(q["keywords"], list) or len(q["keywords"]) < 3:
                raise ValueError("Must have at least 3 keywords")
        
        return questions[:num_questions]
        
    except Exception as e:
        raise ValueError(f"Error generating questions: {e}")

def evaluate_short_answer(student_answer: str, model_answer: str, keywords: List[str], max_score: int) -> Dict:
    """
    Evaluate a student's short answer against model answer and keywords
    Returns: {
        "score": int,
        "feedback": str,
        "keywords_found": [str],
        "keywords_missing": [str]
    }
    """
    system_prompt = f"""
You are an expert teacher evaluating student answers. Compare the student's answer to the model answer 
and assign a score out of {max_score} points.

EVALUATION CRITERIA:
1. Check if key concepts (keywords) are present
2. Assess accuracy and completeness
3. Consider understanding even if wording differs
4. Be fair but rigorous

Required keywords: {', '.join(keywords)}

OUTPUT: Return a JSON object with:
- "score": integer score (0 to {max_score})
- "feedback": brief constructive feedback (2-3 sentences)
- "keywords_found": array of keywords present in student answer
- "keywords_missing": array of keywords missing from student answer
"""

    user_prompt = f"""
MODEL ANSWER:
{model_answer}

STUDENT ANSWER:
{student_answer}

Evaluate the student answer and provide a score out of {max_score}.
"""

    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            max_completion_tokens=2000
        )
        
        raw_response = response.choices[0].message.content.strip()
        data = safe_parse_json_response(raw_response)
        
        # Validate response
        required_keys = ["score", "feedback", "keywords_found", "keywords_missing"]
        if not all(k in data for k in required_keys):
            raise ValueError("Invalid evaluation response structure")
        
        # Ensure score is within bounds
        data["score"] = max(0, min(max_score, int(data["score"])))
        
        return data
        
    except Exception as e:
        # Fallback: simple keyword matching
        student_lower = student_answer.lower()
        keywords_found = [kw for kw in keywords if kw.lower() in student_lower]
        keywords_missing = [kw for kw in keywords if kw.lower() not in student_lower]
        
        score = int((len(keywords_found) / len(keywords)) * max_score)
        
        return {
            "score": score,
            "feedback": f"Found {len(keywords_found)}/{len(keywords)} key concepts. Review the concepts you missed.",
            "keywords_found": keywords_found,
            "keywords_missing": keywords_missing
        }