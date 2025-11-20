# database.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL =  os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
DB_NAME = os.getenv("DB_NAME")
db = client[DB_NAME]  # Database name
users_collection = db["users"]  # Collection name
