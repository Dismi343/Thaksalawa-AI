from typing import List, Dict
from openai import OpenAI
import os
import json
from dotenv import load_dotenv
# Assuming your PDF text extractor is here:
from app.data.pdf_utils import extract_text_from_pdf 

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# Using the model specified in your original code
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini") 

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not set in .env")

# Initialize the OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)


# -----------------------------------------------------
# Helper: Extract clean JSON from model response (NOW DEPRECIATED/CHANGED)
# -----------------------------------------------------
# Note: This function is now changed to handle the *content* of the 
# response when JSON mode is used, which returns a string containing a JSON object.
def safe_parse_json_response(text: str) -> Dict:
    """
    Parses the raw text response from the LLM, expecting a JSON object.
    It attempts to clean the text by removing leading/trailing characters 
    if the model mistakenly added a code fence, even in JSON mode.
    """
    text = text.strip()
    
    # Attempt to strip common LLM wrapper (e.g., if JSON mode fails slightly)
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
    if text.endswith("```"):
        text = text[:-3].strip()

    try:
        # Load the cleaned string as a JSON object
        return json.loads(text)
    except json.JSONDecodeError as e:
        # Re-raise with context for better debugging
        raise ValueError(f"Failed to decode JSON response from AI: {e}")

# -----------------------------------------------------
# Core PDF → Lessons function (Using JSON Mode)
# -----------------------------------------------------
def divide_pdf_into_lessons(pdf_path: str) -> List[Dict]:
    pages = extract_text_from_pdf(pdf_path)

    if not pages:
        raise ValueError(f"No text extracted from PDF: {pdf_path}")

    full_text = "\n\n".join(page["text"] for page in pages)

    # 🌟 Refined System Prompt for JSON Mode
    system_prompt = """
You are an expert education content analyzer. Your goal is to divide the user's 
textbook content into clear, logical lessons.

RULES:
1. Identify natural lesson breaks by headings, topics, or concepts.
2. Number lessons sequentially starting from 1.
3. Each lesson MUST have the following keys: "lesson_number", "name", and "content".
4. Use the exact lesson titles from the text when possible.
5. OUTPUT: Return a single JSON object with a key named "lessons" containing the final array of lesson objects.
"""

    user_prompt = f"""
Divide the following content into logical lessons.

CONTENT:
{full_text}
"""

    raw_response = ""

    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            # 🌟 CRITICAL FIX: Use native JSON mode
            response_format={"type": "json_object"}, 
            max_completion_tokens=12000
        )

        raw_response = response.choices[0].message.content.strip()

        # Parse the JSON object (e.g., {"lessons": [...]})
        data = safe_parse_json_response(raw_response)
        
        # Extract the array from the wrapper object
        if "lessons" not in data or not isinstance(data["lessons"], list):
            raise ValueError("AI response did not contain the expected 'lessons' array key.")
        
        lessons = data["lessons"]

        # Validate structure
        for lesson in lessons:
            if not all(k in lesson for k in ["lesson_number", "name", "content"]):
                raise ValueError("Invalid lesson object structure")

        return lessons

    except Exception as e:
        print("=== RAW MODEL RESPONSE START ===")
        print(raw_response[:5000])
        print("=== RAW MODEL RESPONSE END ===")
        # Re-raise the error with the full context
        raise ValueError(f"Error dividing PDF: {e}")

# -----------------------------------------------------
# Divide PDF into EXACT number of lessons (Using JSON Mode)
# -----------------------------------------------------
def divide_pdf_with_custom_count(pdf_path: str, lesson_count: int) -> List[Dict]:
    pages = extract_text_from_pdf(pdf_path)

    if not pages:
        raise ValueError(f"No text extracted from PDF: {pdf_path}")

    full_text = "\n\n".join(page["text"] for page in pages)

    system_prompt = f"""
You are an expert textbook content analyzer.
Divide the user's textbook content into **EXACTLY {lesson_count} lessons**.

RULES:
1. Produce exactly {lesson_count} lessons.
2. Lessons should be roughly equal length.
3. Each lesson MUST include: "lesson_number", "name", "content".
4. OUTPUT: Return a single JSON object with a key named "lessons" containing the final array of lesson objects.
"""

    user_prompt = f"""
Divide this content into EXACTLY {lesson_count} lessons.

CONTENT:
{full_text}
"""

    raw_response = ""

    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            # 🌟 CRITICAL FIX: Use native JSON mode
            response_format={"type": "json_object"}, 
            max_completion_tokens=12000
        )

        raw_response = response.choices[0].message.content.strip()

        # Parse the JSON object (e.g., {"lessons": [...]})
        data = safe_parse_json_response(raw_response)
        
        # Extract the array from the wrapper object
        if "lessons" not in data or not isinstance(data["lessons"], list):
            raise ValueError("AI response did not contain the expected 'lessons' array key.")
        
        lessons = data["lessons"]

        # Validate structure
        for lesson in lessons:
            if not all(k in lesson for k in ["lesson_number", "name", "content"]):
                raise ValueError("Invalid lesson structure")

        return lessons

    except Exception as e:
        print("=== RAW MODEL RESPONSE START ===")
        print(raw_response[:5000])
        print("=== RAW MODEL RESPONSE END ===")
        raise ValueError(f"Error dividing PDF: {e}")