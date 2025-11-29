from dotenv import load_dotenv
import os
# from langchain_community.vectorstores import Milvus
from app.data.embedding_langchain import STEmbeddingWrapper
from langchain_milvus import Milvus
# from langchain_openai import OpenAIEmbeddings

# embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

load_dotenv()

ZILLIZ_URI = os.getenv("ZILLIZ_URI")
ZILLIZ_TOKEN = os.getenv("ZILLIZ_TOKEN")
ZILLIZ_COLLECTION = os.getenv("ZILLIZ_COLLECTION", "pdf_chunks_zilliz")

if not ZILLIZ_URI:
    raise ValueError("ZILLIZ_URI is not set in .env")
if not ZILLIZ_TOKEN:
    raise ValueError("ZILLIZ_TOKEN is not set in .env")

def get_zilliz_vectorstore() -> Milvus:
   
    embeddings = STEmbeddingWrapper("all-MiniLM-L6-v2")
    # embeddings = embeddings
    vector_store = Milvus(
        embedding_function=embeddings,
        connection_args={
            "uri": ZILLIZ_URI,
            "token": ZILLIZ_TOKEN,
        },
        collection_name=ZILLIZ_COLLECTION,
        auto_id=False
    )
    return vector_store