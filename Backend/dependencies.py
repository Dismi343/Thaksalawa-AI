from fastapi import HTTPException, Depends
from auth import get_current_user

def teacher_only(current_user = Depends(get_current_user)):
    if current_user["role"] != "teacher":
        raise HTTPException(403, "Teacher access only")
    return current_user
