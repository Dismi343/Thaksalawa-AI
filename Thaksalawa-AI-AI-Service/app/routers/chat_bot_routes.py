
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.rag_langchain_zilliz import answer_with_zilliz_rag

router= APIRouter()

class AskRequest(BaseModel):
    query: str
    source: Optional[str] = None

@router.post("/ask")
async def ask(req: AskRequest):
    """
    Ask a question. Optionally filter by source (PDF filename).
    """
    answer = answer_with_zilliz_rag(req.query, source=req.source)
    return {"answer": answer}