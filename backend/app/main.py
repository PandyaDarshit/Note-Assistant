# backend/app/main.py

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import Dict, Any
import logging
from datetime import datetime

from . import models
from .database import SessionLocal, engine
from .services.ollama_service import OllamaService
from pydantic import BaseModel, Field

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="AI Study Notes Assistant",
    description="An intelligent study assistant powered by Ollama's phi4:14b model",
    version="1.0.0"
)

# Configure CORS middleware to allow our frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Ollama service
ollama_service = OllamaService()

# Pydantic models for request validation
class NoteRequest(BaseModel):
    """Schema for creating a new note"""
    topic: str = Field(..., description="The main subject of the study notes")
    title: str = Field(..., description="Title of the study notes")
    level: str = Field(..., description="Student's proficiency level", 
                      pattern="^(beginner|intermediate|expert)$")
    learning_style: str = Field(..., description="Preferred learning style",
                              pattern="^(visual|auditory|reading|kinesthetic)$")

class NoteResponse(BaseModel):
    """Schema for note responses"""
    id: int
    title: str
    topic: str
    content: str
    level: str
    learning_style: str
    created_at: datetime
    metadata: Dict[str, Any] = Field(default_factory=dict)  # Added default factory

    class Config:
        from_attributes = True  # Enables ORM model conversion

# Database dependency
def get_db():
    """Database session dependency for routes"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
async def health_check():
    """Health check endpoint to verify API and Ollama server status"""
    ollama_health = await ollama_service.check_server_health()
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "ollama_server": "healthy" if ollama_health else "unhealthy"
    }

@app.post("/notes", response_model=NoteResponse)
async def create_note(
    request: NoteRequest,
    db: Session = Depends(get_db)
):
    """
    Create a new study note using the Ollama model.
    
    This endpoint:
    1. Validates the request data
    2. Generates study notes using Ollama
    3. Saves the notes to the database
    4. Returns the created note with its content
    """
    try:
        # Generate study notes using Ollama
        generation_result = await ollama_service.generate_study_notes(
            topic=request.topic,
            level=request.level,
            learning_style=request.learning_style
        )
        
        # Create new note in database
        new_note = models.Note(
            title=request.title,
            topic=request.topic,
            content=generation_result["content"],
            level=request.level,
            learning_style=request.learning_style,
            metadata=generation_result["metadata"]
        )
        
        # Save to database
        db.add(new_note)
        db.commit()
        db.refresh(new_note)
        
        return new_note
        
    except Exception as e:
        logger.error(f"Error creating note: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create note: {str(e)}"
        )

@app.get("/notes/{note_id}", response_model=NoteResponse)
async def get_note(note_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific note by its ID.
    """
    try:
        note = db.query(models.Note).filter(models.Note.id == note_id).first()
        if note is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Note with id {note_id} not found"
            )
        
        # Convert the SQLAlchemy model to a dictionary with proper metadata handling
        note_dict = note.to_dict()
        return NoteResponse(**note_dict)
        
    except SQLAlchemyError as e:
        logger.error(f"Database error retrieving note: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@app.get("/notes")
async def list_notes(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    List all notes with pagination support.
    """
    try:
        notes = db.query(models.Note)\
                  .order_by(models.Note.created_at.desc())\
                  .offset(skip)\
                  .limit(limit)\
                  .all()
        
        # Ensure metadata is a dictionary for each note
        for note in notes:
            if note.metadata is None:
                note.metadata = {}
        
        total = db.query(models.Note).count()
        
        return {
            "total": total,
            "notes": notes,
            "skip": skip,
            "limit": limit
        }
        
    except SQLAlchemyError as e:
        logger.error(f"Database error listing notes: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

# Add startup event while keeping all existing routes and configuration
@app.on_event("startup")
async def startup_event():
    """Verify configuration on startup."""
    try:
        # Check Ollama connection and model availability
        model_available = await ollama_service.check_model_availability()
        if not model_available:
            logging.warning(
                f"Model {ollama_service.model} not available on server {ollama_service.base_url}"
            )
            logging.warning("Application will continue, but note generation may fail")
    except Exception as e:
        logging.error(f"Startup check failed: {str(e)}")
        logging.warning("Application will start, but Ollama service may be unavailable")