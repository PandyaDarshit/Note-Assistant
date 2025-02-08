# backend/tests/test_api.py

import pytest
import httpx
import asyncio
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_note_creation():
    """Test creating a new note"""
    test_note = {
        "topic": "Python Programming",
        "title": "Introduction to Python Variables",
        "level": "beginner",
        "learning_style": "visual"
    }
    
    response = client.post("/notes", json=test_note)
    assert response.status_code == 200
    data = response.json()
    assert data["topic"] == test_note["topic"]
    assert data["title"] == test_note["title"]
    assert "content" in data
    assert "id" in data
    
    # Store the note ID for later tests
    return data["id"]

@pytest.mark.asyncio
async def test_note_retrieval(note_id):
    """Test retrieving a specific note"""
    response = client.get(f"/notes/{note_id}")
    assert response.status_code == 200
    data = response.json()
    assert "content" in data
    assert "topic" in data
    assert "level" in data

@pytest.mark.asyncio
async def test_notes_list():
    """Test retrieving list of notes"""
    response = client.get("/notes")
    assert response.status_code == 200
    data = response.json()
    assert "notes" in data
    assert "total" in data
    assert isinstance(data["notes"], list)

@pytest.mark.asyncio
async def test_ollama_connection():
    """Test connection to Ollama server"""
    async with httpx.AsyncClient() as client:
        response = await client.get("http://abts55669.de.bosch.com:11434/api/tags")
        assert response.status_code == 200

def run_tests():
    """Run all tests in sequence"""
    # Run health check
    print("Testing health check endpoint...")
    test_health_check()
    print("✅ Health check passed")
    
    # Run note creation and retrieval tests
    print("\nTesting note creation and retrieval...")
    note_id = asyncio.run(test_note_creation())
    asyncio.run(test_note_retrieval(note_id))
    print("✅ Note creation and retrieval passed")
    
    # Run notes list test
    print("\nTesting notes list...")
    asyncio.run(test_notes_list())
    print("✅ Notes list test passed")
    
    # Test Ollama connection
    print("\nTesting Ollama connection...")
    asyncio.run(test_ollama_connection())
    print("✅ Ollama connection test passed")

if __name__ == "__main__":
    run_tests()