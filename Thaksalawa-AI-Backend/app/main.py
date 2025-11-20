from fastapi import FastAPI, HTTPException
from fastapi.params import Depends
from app.exceptions.exceptions import http_exception_handler
from app.views.user_view import router as user_router
from app.views.auth_view import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.dependencies.dependencies import teacher_only

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_exception_handler(HTTPException, http_exception_handler)

app.include_router(user_router)
app.include_router(auth_router)


@app.get("/teacher/dashboard")
def teacher_dashboard(user=Depends(teacher_only)):
    return {"message": f"Welcome teacher: {user['username']}"}