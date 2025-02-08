# backend/app/services/__init__.py
"""
Services package containing business logic implementations.
This includes the Ollama service for AI interaction and any other
service classes needed for the application.
"""

from .ollama_service import OllamaService

# This allows you to import the service directly from the package
__all__ = ['OllamaService']