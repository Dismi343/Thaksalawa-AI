# backend/retriever_zilliz.py
from typing import Optional
#from langchain_community.vectorstores import Milvus
from app.database.vector_store_zilliz import get_zilliz_vectorstore
from langchain_milvus import Milvus

def get_zilliz_retriever(source: Optional[str] = None, k: int = 5):
    """
    Return a LangChain retriever backed by Zilliz.

    Theory:
    - Retriever interface: get_relevant_documents(query)
    - Uses vector similarity search + optional metadata filter.
    """
    vector_store: Milvus = get_zilliz_vectorstore()

    search_kwargs = {"k": k}
    if source:
        # metadata filter by source (filename)
        # The exact key for filter can depend on langchain version, but this is the general pattern.
        search_kwargs["filter"] = {"source": source}

    retriever = vector_store.as_retriever(search_kwargs=search_kwargs)
    return retriever
