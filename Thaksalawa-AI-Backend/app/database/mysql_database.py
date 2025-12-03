from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_PASSWORD = os.getenv("DB_PASSWORD")
DATABASE_NAME = os.getenv("DATABASE_NAME")

URL_DATABASE = f"mysql+mysqlconnector://root:{DATABASE_PASSWORD}@localhost:3306/{DATABASE_NAME}"

engine = create_engine(URL_DATABASE)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


import app.models.pdf_model
import app.models.subject_model
import app.models.lesson_model

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()