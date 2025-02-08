# backend/app/models.py
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from .database import Base

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    topic = Column(String(255), nullable=False, index=True)
    content = Column(Text, nullable=False)
    level = Column(String(50), nullable=False)
    learning_style = Column(String(50), nullable=False)
    # Changed from 'metadata' to 'note_metadata' to avoid SQLAlchemy conflicts
    note_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def to_dict(self):
        """Convert the model instance to a dictionary"""
        return {
            "id": self.id,
            "title": self.title,
            "topic": self.topic,
            "content": self.content,
            "level": self.level,
            "learning_style": self.learning_style,
            "metadata": self.note_metadata if self.note_metadata else {},
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }