from typing import List, Dict
import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from app.data.chunk_utils import chunk_text
from app.data.embedding_langchain import STEmbeddingWrapper
import requests

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not set in .env")

client = OpenAI(api_key=OPENAI_API_KEY)

embedding_model = STEmbeddingWrapper(model_name="all-MiniLM-L6-v2", device="cpu")
BASE_URL = "http://localhost:8080/user"

def load_lesson(lesson_id: int):
    url = f"{BASE_URL}/lessons/id/{lesson_id}"
    res = requests.get(url, timeout=10)
    res.raise_for_status()
    return res.json()

def load_lessons_by_subject(subject_id: int) -> List[Dict]:
    """Load all lessons for a specific subject"""
    url = f"{BASE_URL}/lessons/subject/{subject_id}"
    res = requests.get(url, timeout=10)
    res.raise_for_status()
    return res.json()

def load_key_points(lesson_id: int):
    url = f"{BASE_URL}/lesson-key-points/get-key-points-by-lesson/{lesson_id}"
    res = requests.get(url, timeout=10)
    res.raise_for_status()
    return res.json()

SYSTEM_PROMPT = """You are an expert computer science educator.

Create 1-2 high-quality study flashcards using ONLY the provided lesson content.

Rules:
- Questions must be specific and exam-oriented
- Answers must be concise (1-3 sentences)
- Do NOT add external knowledge
- Avoid generic definitions

Return ONLY valid JSON:
{
  "flashcards": [
    {"question": "...", "answer": "...", "difficulty": "easy|medium|hard"}
  ]
}
"""

def generate_flashcards(lesson_name: str, brief_summary: str, key_point: str, chunks: List[str]) -> List[Dict]:
    """Generate flashcards from lesson chunks"""
    user_prompt = f"""
Lesson Name:
{lesson_name}

Lesson Summary:
{brief_summary}

Focus Concept:
{key_point}

Relevant Lesson Content:
{chr(10).join(chunks)}
"""

    try:
        print(f"  [Generating flashcards for key point: {key_point[:50]}...]", flush=True)
        print(f"  [Using model: {OPENAI_MODEL}]", flush=True)
        
        res = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            max_completion_tokens=500
        )
        
        # Check if response exists
        if not res or not res.choices:
            print(f"  [✗ API returned empty response object]", flush=True)
            return []
        
        raw_response = res.choices[0].message.content
        
        # Check if content is None or empty
        if raw_response is None:
            print(f"  [✗ API returned None for message content]", flush=True)
            return []
        
        raw_response = raw_response.strip()
        print(f"  [AI Response received, length: {len(raw_response)}]", flush=True)
        
        if len(raw_response) == 0:
            print(f"  [✗ AI returned empty string]", flush=True)
            print(f"  [DEBUG] Full response object: {res}]", flush=True)
            return []
        
        # Debug: Print first 200 chars of response
        print(f"  [Response preview: {raw_response[:200]}...]", flush=True)
        
        raw_response = raw_response.replace("```json", "").replace("```", "").strip()
        
        start_idx = raw_response.find('{')
        end_idx = raw_response.rfind('}') + 1
        
        print(f"  [JSON indices - start: {start_idx}, end: {end_idx}]", flush=True)
        
        if start_idx != -1 and end_idx > start_idx:
            json_str = raw_response[start_idx:end_idx]
            print(f"  [Extracted JSON: {json_str[:200]}...]", flush=True)
            
            data = json.loads(json_str)
            flashcards = data.get("flashcards", [])
            
            print(f"  [✓ Generated {len(flashcards)} flashcards]", flush=True)
            return flashcards
        else:
            print(f"  [✗ No JSON found in response]", flush=True)
            print(f"  [✗ Raw response was: {raw_response[:300]}]", flush=True)
            return []
    
    except json.JSONDecodeError as e:
        print(f"  [✗ JSON decode error: {str(e)}]", flush=True)
        return []
    except Exception as e:
        print(f"  [✗ Error generating flashcards: {str(e)[:200]}]", flush=True)
        import traceback
        print(f"  [Traceback: {traceback.format_exc()[:300]}]", flush=True)
        return []

def get_relevant_chunks_simple(query: str, chunks: List[str], k: int = 3) -> List[str]:
    """
    Simple fallback: retrieve most relevant chunks by embedding similarity.
    Returns top k chunks based on cosine similarity.
    """
    try:
        import numpy as np
        from sklearn.metrics.pairwise import cosine_similarity
        
        if not chunks:
            print(f"  [Warning: No chunks available]", flush=True)
            return []
        
        # Embed the query
        query_embedding = embedding_model.embed_query(query)
        
        # Embed all chunks
        chunk_embeddings = embedding_model.embed_documents(chunks)
        
        # Calculate similarity scores
        similarities = cosine_similarity([query_embedding], chunk_embeddings)[0]
        
        # Get top k indices
        top_indices = np.argsort(similarities)[-k:][::-1]
        
        # Return top k chunks
        relevant = [chunks[i] for i in top_indices if i < len(chunks)]
        print(f"  [Retrieved {len(relevant)} relevant chunks for query]", flush=True)
        return relevant
    
    except Exception as e:
        print(f"  [Warning in get_relevant_chunks_simple: {str(e)[:50]}]", flush=True)
        # Fallback: return first few chunks
        fallback = chunks[:min(k, len(chunks))]
        print(f"  [Returning {len(fallback)} fallback chunks]", flush=True)
        return fallback

def generate_flashcards_for_lesson(lesson_id: int) -> List[Dict]:
    """Generate flashcards for a single lesson with all its key points"""
    try:
        print(f"\n[Lesson {lesson_id}] Starting flashcard generation...", flush=True)
        
        # 1️⃣ Load lesson & key points from services
        print(f"[Lesson {lesson_id}] Loading lesson data...", flush=True)
        lesson = load_lesson(lesson_id)
        print(f"[Lesson {lesson_id}] ✓ Loaded lesson: {lesson.get('name')}", flush=True)
        
        print(f"[Lesson {lesson_id}] Loading key points...", flush=True)
        key_points = load_key_points(lesson_id)
        print(f"[Lesson {lesson_id}] ✓ Loaded {len(key_points)} key points", flush=True)
        
        if not key_points:
            print(f"[Lesson {lesson_id}] ✗ No key points found!", flush=True)
            return []

        lesson_name = lesson["name"]
        content = lesson["content"]
        brief_summary = lesson.get("summary", {}).get("brief_summary") if isinstance(lesson.get("summary"), dict) else lesson.get("brief_summary", "")
        
        print(f"[Lesson {lesson_id}] Brief summary: {brief_summary[:50]}...", flush=True)

        # 2️⃣ Convert content string to proper format for chunk_text()
        pages = [
            {
                "text": content,
                "page_num": 1,
                "source": f"lesson_{lesson_id}"
            }
        ]

        # 3️⃣ Chunk lesson content
        print(f"[Lesson {lesson_id}] Chunking content...", flush=True)
        chunks = chunk_text(pages)
        print(f"[Lesson {lesson_id}] ✓ Created {len(chunks)} chunks", flush=True)
        
        # Extract just the text from chunk objects
        chunk_texts = [chunk["text"] for chunk in chunks]
        print(f"[Lesson {lesson_id}] Chunk texts extracted: {len(chunk_texts)} chunks", flush=True)

        all_flashcards = []

        # 4️⃣ Generate per key point
        for idx, kp in enumerate(key_points, 1):
            print(f"[Lesson {lesson_id}] [{idx}/{len(key_points)}] Processing: {kp['key_point'][:50]}...", flush=True)
            
            # Get relevant chunks using simple similarity-based retrieval
            relevant_chunks = get_relevant_chunks_simple(
                query=kp["key_point"],
                chunks=chunk_texts,
                k=3
            )

            if not relevant_chunks:
                print(f"[Lesson {lesson_id}] ✗ No relevant chunks found, skipping", flush=True)
                continue

            # Generate flashcards for this key point
            cards = generate_flashcards(
                lesson_name=lesson_name,
                brief_summary=brief_summary,
                key_point=kp["key_point"],
                chunks=relevant_chunks
            )

            if cards:
                # Add lesson_id and point_id to each card
                for card in cards:
                    all_flashcards.append({
                        "lesson_id": lesson_id,
                        "point_id": kp.get("point_id"),
                        **card
                    })
                print(f"[Lesson {lesson_id}] ✓ Added {len(cards)} flashcards", flush=True)
            else:
                print(f"[Lesson {lesson_id}] ✗ No flashcards generated for this key point", flush=True)

        print(f"\n[Lesson {lesson_id}] ✓ Generated {len(all_flashcards)} total flashcards\n", flush=True)
        return all_flashcards

    except Exception as e:
        print(f"\n[Lesson {lesson_id}] ✗ Error: {str(e)}\n", flush=True)
        raise


def generate_flashcards_for_subject(subject_id: int) -> Dict:
    """
    Generate flashcards for all lessons in a subject.
    
    Args:
        subject_id: The ID of the subject
    
    Returns:
        Dictionary containing subject_id, total_lessons, total_flashcards, and flashcards by lesson
    """
    try:
        print(f"\n{'='*60}")
        print(f"[Subject {subject_id}] Starting flashcard generation for all lessons...")
        print(f"{'='*60}\n", flush=True)
        
        # 1️⃣ Load all lessons for the subject
        print(f"[Subject {subject_id}] Loading all lessons for subject...", flush=True)
        lessons = load_lessons_by_subject(subject_id)
        print(f"[Subject {subject_id}] ✓ Loaded {len(lessons)} lessons", flush=True)
        
        if not lessons:
            print(f"[Subject {subject_id}] ✗ No lessons found for this subject!", flush=True)
            return {
                "subject_id": subject_id,
                "total_lessons": 0,
                "total_flashcards": 0,
                "lessons": []
            }

        all_lesson_flashcards = []
        total_flashcards = 0

        # 2️⃣ Generate flashcards for each lesson
        for idx, lesson in enumerate(lessons, 1):
            lesson_id = lesson.get("lesson_id")
            lesson_name = lesson.get("name", f"Lesson {idx}")
            
            print(f"\n[Subject {subject_id}] [{idx}/{len(lessons)}] Processing lesson: {lesson_name}", flush=True)
            
            try:
                flashcards = generate_flashcards_for_lesson(lesson_id)
                total_flashcards += len(flashcards)
                
                all_lesson_flashcards.append({
                    "lesson_id": lesson_id,
                    "lesson_name": lesson_name,
                    "flashcards": flashcards,
                    "count": len(flashcards)
                })
                
                print(f"[Subject {subject_id}] ✓ Lesson {lesson_name}: {len(flashcards)} flashcards\n", flush=True)
            
            except Exception as e:
                print(f"[Subject {subject_id}] ✗ Error processing lesson {lesson_name}: {str(e)}\n", flush=True)
                all_lesson_flashcards.append({
                    "lesson_id": lesson_id,
                    "lesson_name": lesson_name,
                    "flashcards": [],
                    "count": 0,
                    "error": str(e)
                })

        # 3️⃣ Return aggregated results
        result = {
            "subject_id": subject_id,
            "total_lessons": len(lessons),
            "total_flashcards": total_flashcards,
            "lessons": all_lesson_flashcards
        }
        
        print(f"\n{'='*60}")
        print(f"[Subject {subject_id}] ✓ COMPLETE")
        print(f"[Subject {subject_id}] Total Lessons: {len(lessons)}")
        print(f"[Subject {subject_id}] Total Flashcards: {total_flashcards}")
        print(f"{'='*60}\n", flush=True)
        
        return result

    except Exception as e:
        print(f"\n[Subject {subject_id}] ✗ Critical Error: {str(e)}\n", flush=True)
        raise