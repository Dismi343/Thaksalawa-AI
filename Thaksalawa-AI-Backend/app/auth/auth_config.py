from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Depends,status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
import os
from dotenv import load_dotenv
from app.database.mysql_database import get_db
from sqlalchemy.orm import Session
from app.models.student_model import StudentModel
from app.models.teacher_model import TeacherModel
from app.models.admin_model import AdminModel



load_dotenv()

SECRET_KEY = os.getenv("SECRETE_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE = 30

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Hash password
def hash_password(password: str):
    return pwd_context.hash(password)

# Verify password
def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)



# Create JWT token
def create_access_token(data: dict, expires_delta:timedelta | None=None):
    to_encode = data.copy()
    if expires_delta:
         expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt





# Get current user from token
def get_current_user(token: Annotated[str, Depends(oauth2_scheme)],db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise credentials_exception

    user = (
        db.query(StudentModel).filter(StudentModel.email == email).first()
        or db.query(TeacherModel).filter(TeacherModel.email == email).first()
        or db.query(AdminModel).filter(AdminModel.email == email).first()
    )

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {  
        "profile": user.to_dict(),
        "role": role,
    }


async def get_current_active_user(
    current_user: Annotated[dict, Depends(get_current_user)],):
    print("Current Role:", current_user["role"])
    return current_user

