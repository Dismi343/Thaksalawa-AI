from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import pdf_routes
from app.routers import chat_bot_routes

from app.routers import lesson_routes
from app.routers import quiz_routes

app = FastAPI()

app.include_router(pdf_routes.router, prefix="/pdf", tags=["PDF"])
app.include_router(chat_bot_routes.router, prefix="/chat-bot", tags=["Chat"])
app.include_router(lesson_routes.router, prefix="/lessons", tags=["Lessons"])
app.include_router(quiz_routes.router, prefix="/quiz", tags=["Quiz"])  # NEW


# Adjust origins as needed for your React/Next frontend
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

