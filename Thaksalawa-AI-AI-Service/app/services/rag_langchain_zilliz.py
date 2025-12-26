# backend/rag_langchain_zilliz.py
from typing import Optional, List
from langchain_core.documents import Document
from app.data.retriever_zilliz import get_zilliz_retriever
#from backend.llm.local_llm_openrouter import answer_query_with_openrouter
from app.llm.openai_model import answer_query_with_openai


def answer_with_zilliz_rag(query: str, source: Optional[str] = None, k: int = 5) -> str:
   
    retriever = get_zilliz_retriever(source=source, k=k)
    docs: List[Document] = retriever.invoke(query)

    contexts = [
        {
            "text": d.page_content,
            "metadata": d.metadata or {}
        }
        for d in docs
    ]

    #answer = answer_query_with_openrouter(query, contexts)
    answer = answer_query_with_openai(query, contexts)
    return answer