# backend/app/__init__.py
"""
Main application package for the AI Study Notes Assistant.
This package contains all the core functionality including API routes,
database models, and services.
"""

from .database import Base, engine, SessionLocal
from . import models