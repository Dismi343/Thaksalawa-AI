from fastapi import FastAPI, Depends
from users import router as users_router
from dependencies import teacher_only

app = FastAPI()

app.include_router(users_router)

@app.get("/")
def home():
    return {"message": "API is running"}

@app.get("/teacher/dashboard")
def teacher_dashboard(user=Depends(teacher_only)):
    return {"message": f"Welcome teacher: {user['username']}"}
