from fastapi import FastAPI, HTTPException
from app.exceptions.exceptions import http_exception_handler
from fastapi.middleware.cors import CORSMiddleware
from app.views.user_role_view import router as user_role_router
from app.views.student_view import router as student_router
from app.views.admin_view import router as admin_router
from app.views.teacher_view import router as teacher_router
from app.views.login_view import router as login_router
from app.views.lesson_view import router as lesson_router
from app.views.pdf_view import router as pdf_router
from app.views.subject_view import router as subject_router
from app.views.login_logs_views import router as login_logs_router
from app.views.quiz_view import router as quiz_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_exception_handler(HTTPException, http_exception_handler)

routers=[
    user_role_router,
    student_router,
    admin_router,
    teacher_router,
    login_router,
    lesson_router,
    pdf_router,
    subject_router,
    login_logs_router,
    quiz_router
]

for r in routers:
    app.include_router(r)

