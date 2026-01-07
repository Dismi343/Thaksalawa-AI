from typing import List, Dict
import os
import re
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not set in .env")

client = OpenAI(api_key=OPENAI_API_KEY)


def clean_key_point(point: str) -> str:
    """
    Remove filler words and make key points more direct and focused.
    Also cleans broken/polluted points.
    """
    # Remove leading dashes and bullets
    point = re.sub(r'^[\s\-•*]+', '', point)
    point = point.strip()
    
    # Remove common filler patterns
    filler_patterns = [
        r'^It\s+(?:covers|provides|explains|introduces|discusses|concludes|highlights)\s+(?:the|that|how|with|by)\s+',
        r'^The\s+section\s+(?:covers|provides|explains|introduces|discusses|concludes|highlights)\s+',
        r'^This\s+(?:section|part|lesson)\s+(?:covers|provides|explains|introduces|discusses|concludes|highlights)\s+',
        r'^It\s+also\s+',
        r'^Additionally,\s+',
        r'^Furthermore,\s+',
        r'^Moreover,\s+',
        r'^\d+\s+',  # Remove leading numbers
    ]
    
    cleaned = point.strip()
    
    for pattern in filler_patterns:
        cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)
    
    # Remove incomplete parts (marked by opening brackets without closing)
    cleaned = re.sub(r'\s*[(\[]\s*[a-z]\s*$', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\s*[,;]\s*$', '', cleaned)  # Remove trailing punctuation
    
    # Ensure ends with period
    cleaned = cleaned.strip()
    if cleaned and not cleaned.endswith(('.', '!', '?')):
        cleaned += '.'
    
    # Capitalize first letter
    if cleaned:
        cleaned = cleaned[0].upper() + cleaned[1:]
    
    return cleaned.strip()


def validate_key_point(point: str) -> bool:
    """
    Validate that a key point is complete and meaningful.
    Returns False for broken, incomplete, or too short points.
    """
    point = point.strip()
    
    # Reject if too short
    if len(point) < 15:
        return False
    
    # Reject if looks like a fragment
    if point.endswith(('(', '[', '-', ',')):
        return False
    
    # Reject if has unclosed brackets
    if point.count('(') > point.count(')'):
        return False
    if point.count('[') > point.count(']'):
        return False
    
    # Reject if mostly uppercase (likely acronym or fragment)
    uppercase_ratio = sum(1 for c in point if c.isupper()) / max(len(point), 1)
    if uppercase_ratio > 0.5:
        return False
    
    # Reject if has incomplete pattern like "Q = A"
    if re.search(r'\s+[A-Z]\s*=\s*[A-Z]\s*$', point):
        return False
    
    return True


def extract_complete_sentences(text: str) -> List[str]:
    """
    Extract complete sentences from text with proper boundary detection.
    Handles multiple punctuation marks and ensures sentence completeness.
    """
    # Split by sentence-ending punctuation
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])|(?<=[.!?])\s*$', text)
    
    clean_sentences = []
    for sent in sentences:
        sent = sent.strip()
        # Remove leading dashes
        sent = re.sub(r'^[\s\-•*]+', '', sent).strip()
        # Only keep sentences with meaningful content
        if sent and len(sent) > 30 and sent[-1] in '.!?':
            clean_sentences.append(sent)
    
    return clean_sentences


def generate_summary_with_ai(content: str, lesson_name: str) -> Dict:
    """
    Generate comprehensive summary from lesson content using AI.
    """
    
    # Limit content length for API efficiency
    if len(content) > 4000:
        content = content[:4000]
    
    system_prompt = """You are an expert educator creating comprehensive summaries for student learning.

Generate a structured summary with:
1. Brief Summary (2-3 sentences)
2. Key Points (5-7 main concepts - DIRECT AND FOCUSED)
3. Learning Objectives (3-5 what students should learn)

Return ONLY valid JSON in this format:
{
  "brief_summary": "2-3 sentence overview",
  "key_points": ["Direct concept 1", "Direct concept 2", ...],
  "learning_objectives": ["objective1", "objective2", ...]
}

CRITICAL RULES FOR KEY POINTS:
- Each key point must be ONE COMPLETE SENTENCE (not a list or fragment)
- Do NOT use dashes, bullets, or special formatting
- Do NOT break points across multiple lines
- Each point must start with a capital letter and end with a period
- DO NOT start with "It covers", "It provides", "The section discusses", etc.
- Points should directly state what the content is about
- Examples of GOOD key points:
  * "Binary number system uses base 2."
  * "AND, OR and NOT gates perform basic logical operations."
  * "Integrated circuits package multiple gates into single chips."
- Points must be distinct and non-overlapping concepts
- Use clear, simple language
- MUST be complete, not fragments or abbreviations
- Do NOT include incomplete patterns like "Q = A" or "(e," or similar"""

    user_prompt = f"""Create a comprehensive summary for this lesson:

Lesson Title: {lesson_name}

Content:
{content}

CRITICAL FOR KEY POINTS:
- Each point must be ONE COMPLETE SENTENCE with a period at the end
- No dashes, bullets, or line breaks within points
- No fragments or incomplete sentences
- No mathematical notations at the end (like "Q = A")
- Each point should be a standalone, complete thought"""

    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_completion_tokens=3500,
            temperature=0.7
        )

        raw_response = response.choices[0].message.content.strip()
        
        if not raw_response:
            raise ValueError("Empty response from AI")
        
        # Clean response
        raw_response = raw_response.replace("```json", "").replace("```", "").strip()
        
        # Extract JSON object
        start_idx = raw_response.find('{')
        end_idx = raw_response.rfind('}') + 1
        
        if start_idx != -1 and end_idx > start_idx:
            json_str = raw_response[start_idx:end_idx]
            data = json.loads(json_str)
            
            # Clean and validate key points
            key_points_raw = [str(p).strip() for p in data.get("key_points", []) if str(p).strip()]
            key_points = []
            
            for kp in key_points_raw:
                # Clean the key point
                cleaned = clean_key_point(kp)
                
                # Validate the cleaned point
                if validate_key_point(cleaned) and cleaned not in key_points:
                    key_points.append(cleaned)
            
            # If we lost too many points in cleaning, use fallback
            if len(key_points) < 3:
                raise ValueError("Not enough valid key points after cleaning")
            
            # Validate structure with no truncation
            summary_data = {
                "brief_summary": str(data.get("brief_summary", "")).strip(),
                "key_points": key_points,
                "learning_objectives": [str(o).strip() for o in data.get("learning_objectives", []) if str(o).strip()]
            }
            
            # Validate all fields have content
            if (summary_data["brief_summary"] and 
                len(summary_data["key_points"]) >= 3):
                return summary_data
            else:
                raise ValueError("Incomplete summary data")
        
        raise ValueError("No JSON found in response")
    
    except Exception as e:
        print(f"  [AI summary failed: {str(e)[:30]}, using fallback...]", end="", flush=True)
        return generate_summary_fallback(content, lesson_name)


def generate_summary_fallback(content: str, lesson_name: str) -> Dict:
    """
    Fallback summary generation using intelligent text analysis.
    Used when AI service fails or is unavailable.
    """
    
    # Extract complete sentences
    sentences = extract_complete_sentences(content)
    
    if not sentences:
        # Fallback if extraction fails
        sentences = re.split(r'[.!?]+', content)
        sentences = [s.strip() + '.' for s in sentences if len(s.strip()) > 20]
    
    # Brief summary: first 2 meaningful sentences
    brief_summary = " ".join(sentences[:2]) if sentences else f"Lesson on {lesson_name}"
    
    # Extract key points from sentences (complete, validated sentences)
    key_points = []
    
    for sent in sentences[1:]:  # Skip first sentence (usually intro)
        cleaned = clean_key_point(sent)
        if validate_key_point(cleaned) and cleaned not in key_points:
            key_points.append(cleaned)
        if len(key_points) >= 7:
            break
    
    # If we don't have enough, use sentences as-is
    if len(key_points) < 5:
        for sent in sentences[1:]:
            if len(key_points) >= 7:
                break
            cleaned = clean_key_point(sent)
            if cleaned and len(cleaned) > 15 and cleaned not in key_points:
                key_points.append(cleaned)
    
    
    
    return {
        "brief_summary": brief_summary,
        "key_points": key_points if key_points else sentences[:5] if sentences else ["Main topic of the lesson"],
    }


def generate_summaries_for_lessons(lessons: List[Dict]) -> List[Dict]:
    """
    Generate summaries for all lessons.
    
    Input: List of lesson dicts with 'lesson_number', 'name', 'content'
    Output: List of lesson dicts with added 'summary' field
    """
    
    lessons_with_summaries = []
    total_lessons = len(lessons)
    
    print(f"\nGenerating summaries for {total_lessons} lessons...\n")
    
    for idx, lesson in enumerate(lessons, 1):
        lesson_copy = lesson.copy()
        lesson_name = lesson.get("name", f"Lesson {idx}")
        lesson_content = lesson.get("content", "")
        
        try:
            print(f"[{idx}/{total_lessons}] {lesson_name}...", end=" ", flush=True)
            
            summary = generate_summary_with_ai(lesson_content, lesson_name)
            
            lesson_copy["summary"] = summary
            print(f"✓")
        
        except Exception as e:
            print(f"✗ {str(e)[:30]}")
            lesson_copy["summary"] = generate_summary_fallback(lesson_content, lesson_name)
        
        lessons_with_summaries.append(lesson_copy)
    
    print(f"\n✓ All {total_lessons} lessons summarized")
    return lessons_with_summaries


def generate_brief_summary(lesson_content: str, lesson_name: str) -> str:
    """Generate only a brief 2-3 sentence summary"""
    
    if len(lesson_content) > 2000:
        lesson_content = lesson_content[:2000]
    
    system_prompt = """You are an expert educator. Create a brief, clear summary in 2-3 COMPLETE sentences.
Return ONLY the summary text, nothing else. Do not truncate or cut off sentences."""

    user_prompt = f"""Create a 2-3 sentence summary of this lesson:

Title: {lesson_name}

Content:
{lesson_content}

CRITICAL: Provide COMPLETE sentences. Do not truncate."""

    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_completion_tokens=400,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"Error generating brief summary: {str(e)}")
        sentences = extract_complete_sentences(lesson_content)
        return " ".join(sentences[:2]) if sentences else f"This lesson covers {lesson_name}"


def generate_key_points(lesson_content: str, lesson_name: str, count: int = 7) -> List[str]:
    """
    Generate key points with improved accuracy, completeness, and directness.
    Focuses on extracting accurate, complete, and direct concepts.
    """
    
    if len(lesson_content) > 3000:
        lesson_content = lesson_content[:3000]
    
    system_prompt = f"""You are an expert educator. Extract {count} ACCURATE, DIRECT key learning points from the content.

CRITICAL REQUIREMENTS:
- Each point must be ONE COMPLETE SENTENCE (not a fragment or list item)
- Do NOT use dashes, bullets, or line breaks in points
- Each point must start with a capital letter and end with a period
- Points must be DIRECT and FOCUSED on the concept itself
- DO NOT start with filler words
- Do NOT include mathematical notations at the end (like "Q = A")
- Do NOT truncate or break sentences across multiple lines
- Points must reflect actual content (not fabricated)
- Points should be distinct concepts
- Use clear, simple language

Return ONLY valid JSON with each point as a complete sentence:
{{"points": ["Binary number system uses base 2.", "Octal number system uses base 8.", ...]}}"""

    user_prompt = f"""Extract {count} key points from:

Title: {lesson_name}

Content:
{lesson_content}

Each point must be ONE COMPLETE SENTENCE that stands alone.
Do NOT break points into multiple lines with dashes or bullets."""

    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_completion_tokens=2000,
            temperature=0.7
        )
        
        raw_response = response.choices[0].message.content.strip()
        raw_response = raw_response.replace("```json", "").replace("```", "").strip()
        
        start_idx = raw_response.find('{')
        end_idx = raw_response.rfind('}') + 1
        
        if start_idx != -1 and end_idx > start_idx:
            json_str = raw_response[start_idx:end_idx]
            data = json.loads(json_str)
            
            # Clean and validate points
            points_raw = [str(p).strip() for p in data.get("points", []) if str(p).strip()]
            points = []
            
            for p in points_raw:
                cleaned = clean_key_point(p)
                if validate_key_point(cleaned) and cleaned not in points:
                    points.append(cleaned)
            
            return points[:count] if points else []
        
        raise ValueError("No JSON found")
    
    except Exception as e:
        print(f"Error generating key points: {str(e)}")
        # Fallback to intelligent extraction
        sentences = extract_complete_sentences(lesson_content)
        points = []
        for s in sentences:
            cleaned = clean_key_point(s)
            if validate_key_point(cleaned) and cleaned not in points:
                points.append(cleaned)
        return points[:count]