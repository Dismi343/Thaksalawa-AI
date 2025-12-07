from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database.mysql_database import Base

class BlacklistTokenModel(Base):
    __tablename__ = "blacklisted_tokens"

    id=Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String(255),nullable=False)
    blacklisted_at=Column(DateTime, nullable=False, default=func.now())