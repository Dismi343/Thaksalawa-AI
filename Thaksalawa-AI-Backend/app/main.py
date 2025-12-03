from fastapi import FastAPI, HTTPException
from app.exceptions.exceptions import http_exception_handler
from fastapi.middleware.cors import CORSMiddleware
from app.views.user_role_view import router as user_role_router
from app.views.student_view import router as student_router
from app.views.admin_view import router as admin_router
from app.views.teacher_view import router as teacher_router
from app.views.lesson_view import router as lesson_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_exception_handler(HTTPException, http_exception_handler)

app.include_router(user_role_router)
app.include_router(student_router)
app.include_router(admin_router)
app.include_router(teacher_router)
app.include_router(lesson_router)