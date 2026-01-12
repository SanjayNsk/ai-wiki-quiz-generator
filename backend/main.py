from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import asyncio
import httpx
from bs4 import BeautifulSoup
import json
from datetime import datetime
import os
from dotenv import load_dotenv
from cache_manager import CacheManager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class QuizRequest(BaseModel):
    wikipedia_url: str
    num_questions: int = 5
    difficulty: str = "medium"

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str
    difficulty: str
    related_topics: List[str]

class Quiz(BaseModel):
    id: Optional[str] = None
    title: str
    url: str
    questions: List[QuizQuestion]
    created_at: Optional[str] = None
    difficulty: str
    score: Optional[int] = None

# Wikipedia Scraper
class WikipediaScraper:
    @staticmethod
    async def scrape_article(url: str) -> dict:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=10.0)
                response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract title
            title_elem = soup.find('h1', {'class': 'firstHeading'})
            title = title_elem.text if title_elem else "Unknown"
            
            # Extract paragraphs
            content_div = soup.find('div', {'id': 'mw-content-text'})
            paragraphs = []
            if content_div:
                for p in content_div.find_all('p')[:10]:
                    text = p.get_text(strip=True)
                    if text and len(text) > 100:
                        paragraphs.append(text)
            
            # Extract related topics
            related_topics = []
            categories = soup.find('div', {'id': 'mw-normal-catlinks'})
            if categories:
                for link in categories.find_all('a'):
                    related_topics.append(link.text)
            
            return {
                "title": title,
                "content": "\n\n".join(paragraphs),
                "related_topics": related_topics[:5]
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to scrape Wikipedia: {str(e)}")

# LLM Quiz Generator
class LLMQuizGenerator:
    @staticmethod
    async def generate_quiz(content: str, num_questions: int, difficulty: str, title: str) -> List[QuizQuestion]:
        # Mock implementation - Replace with actual Gemini/LangChain integration
        # This would call Google Gemini API or similar
        
        sample_questions = [
            QuizQuestion(
                question="What is the main topic of this article?",
                options=["Option A", "Option B", "Option C", "Option D"],
                correct_answer="Option A",
                explanation="This is the correct answer because...",
                difficulty=difficulty,
                related_topics=["Topic 1", "Topic 2"]
            )
        ]
        return sample_questions

@app.get("/")
async def root():
    return {"message": "AI Wiki Quiz Generator API"}

@app.post("/generate-quiz", response_model=Quiz)
async def generate_quiz(request: QuizRequest):
    db_session = SessionLocal()
    cache_manager = CacheManager(db_session)
    
    # Try to get from cache first
    cached_data = cache_manager.get_cached_content(request.wikipedia_url)
    
    if cached_data:
        article_data = cached_data
    else:
        # Scrape Wikipedia
        scraper = WikipediaScraper()
        article_data = await scraper.scrape_article(request.wikipedia_url)
        
        # Cache the result
        cache_manager.set_cached_content(request.wikipedia_url, article_data)
    
    # Generate quiz using LLM
    generator = LLMQuizGenerator()
    questions = await generator.generate_quiz(
        article_data["content"],
        request.num_questions,
        request.difficulty,
        article_data["title"]
    )
    
    quiz = Quiz(
        title=article_data["title"],
        url=request.wikipedia_url,
        questions=questions,
        created_at=datetime.now().isoformat(),
        difficulty=request.difficulty
    )
    
    db_session.close()
    return quiz

@app.get("/quizzes")
async def get_quizzes():
    # Would fetch from database
    return {"quizzes": []}

@app.post("/submit-quiz")
async def submit_quiz(quiz_id: str, answers: dict):
    # Would calculate score and save to database
    return {"score": 0, "total": 0}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
