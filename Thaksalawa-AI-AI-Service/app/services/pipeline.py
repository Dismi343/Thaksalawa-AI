from data.chunk_utils import chunk_text
from data.embedding_langchain import STEmbeddingWrapper
from data.retriever_zilliz import get_zilliz_retriever
from services.flash_card_service import generate_flashcards


import requests

BASE_URL = "http://localhost:8080/user"

embedding_model = STEmbeddingWrapper(model_name="all-MiniLM-L6-v2", device="cpu")

def load_lesson(lesson_id: int):
    url = f"{BASE_URL}/lessons/id/{lesson_id}"
    res = requests.get(url, timeout=10)
    res.raise_for_status()
    return res.json()

def load_key_points(lesson_id: int):
    url = f"{BASE_URL}/lesson-key-points/get-key-points-by-lesson/{lesson_id}"
    res = requests.get(url, timeout=10)
    res.raise_for_status()
    return res.json()

def generate_flashcards_for_lesson(lesson_id: int):
    # 1️⃣ Load lesson & key points from services
    lesson = load_lesson(lesson_id)
    key_points = load_key_points(lesson_id)

    lesson_name = lesson["name"]
    content = lesson["content"]
    brief_summary = lesson["summary"]["brief_summary"]

    # 2️⃣ Chunk lesson content
    chunks = chunk_text(content)

    # 3️⃣ Embed chunks (cache in prod)
    chunk_embeddings = embedding_model.embed_documents(chunks)
    

    all_flashcards = []

    # 4️⃣ Generate per key point
    for kp in key_points:
        relevant_chunks = get_zilliz_retriever(
            kp["key_point"],
            chunks,
            chunk_embeddings
        )

        cards = generate_flashcards(
            lesson_name=lesson_name,
            brief_summary=brief_summary,
            key_point=kp["key_point"],
            chunks=relevant_chunks
        )

        for card in cards:
            all_flashcards.append({
                "lesson_id": lesson_id,
                "point_id": kp["point_id"],
                **card
            })

    return all_flashcards
