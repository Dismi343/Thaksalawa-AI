# backend/local_llm_openai.py
import os
from typing import List, Dict
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not set in .env")

# Create OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)


def build_context_prompt_from_docs(query: str, contexts: List[Dict]) -> str:
    """
    Same logic as in local_llm_openrouter.build_context_prompt_from_docs
    contexts: list of {"text": ..., "metadata": {...}}
    """
    parts = []
    for c in contexts:
        meta = c.get("metadata", {})
        source = meta.get("source", "unknown")
        page = meta.get("page_num", "?")
        parts.append(f"[Source: {source} | Page: {page}]\n{c['text']}")

    context_block = "\n\n---\n\n".join(parts) if parts else "No context found."

   

    full_prompt = (
        f"Context:\n{context_block}\n\n"
        f"User question:\n{query}\n\n"
        "Answer based only on the context above."
    )
    return full_prompt


def answer_query_with_openai(query: str, contexts: List[Dict]) -> str:
   
    prompt = build_context_prompt_from_docs(query, contexts)
    
    system_prompt = (
        "You are a helpful assistant that answers questions strictly based on the "
        "provided context from PDF documents. If the answer is not in the context, "
        "say you don't know based on the provided document."
    )

    try:
        completion = client.responses.create(
            model=OPENAI_MODEL,
            instructions=system_prompt,
            input=prompt
        )

        response = completion.output_text
    except Exception as e:
        return f"Error calling OpenAI: {e}"

    try:
        return completion.choices[0].message.content.strip()
    except Exception:
        return str(response)
