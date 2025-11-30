# embedding_langchain_wrapper.py
from typing import List
from sentence_transformers import SentenceTransformer

class STEmbeddingWrapper:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2", device: str = "cpu"):   #paraphrase-multilingual-MiniLM-L12-v2 for
        self.model = SentenceTransformer(model_name, device=device)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        # LangChain expects a list of vectors for docs
        embs = self.model.encode(texts, convert_to_numpy=False)
        return [e.tolist() for e in embs]

    def embed_query(self, text: str) -> List[float]:
        # For a single query
        emb = self.model.encode([text], convert_to_numpy=False)[0]
        return emb.tolist()
