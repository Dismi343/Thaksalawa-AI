from fastapi import Depends, HTTPException
from app.auth.auth_config import get_current_user

def require_admin(current_user=Depends(get_current_user)):
    role_id = None
    if isinstance(current_user, dict):
        role_id = current_user.get("role_id") or (current_user.get("profile") or {}).get("role_id")
    if role_id not in (1, 2, 3):  # 1 = admin
        raise HTTPException(status_code=403, detail="Student access required")
    return current_user
