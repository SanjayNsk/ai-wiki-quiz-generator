from sqlalchemy import create_engine, Column, String, Integer, JSON, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/quiz_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class QuizDB(Base):
    __tablename__ = "quizzes"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    url = Column(String)
    questions = Column(JSON)
    difficulty = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class QuizSubmissionDB(Base):
    __tablename__ = "quiz_submissions"
    
    id = Column(String, primary_key=True, index=True)
    quiz_id = Column(String, index=True)
    user_id = Column(String)
    answers = Column(JSON)
    score = Column(Float)
    submitted_at = Column(DateTime, default=datetime.utcnow)

class CacheDB(Base):
    __tablename__ = "cache"
    
    id = Column(String, primary_key=True, index=True)
    url = Column(String, unique=True)
    content = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)
