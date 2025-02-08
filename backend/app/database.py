# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment variables
# In Docker, this will use the URL we defined in docker-compose.yml
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the SQLAlchemy engine with some sensible defaults for a web application
engine = create_engine(
    DATABASE_URL,
    # Pool size determines how many connections to keep in memory
    pool_size=5,
    # Max overflow allows temporary additional connections when pool_size is reached
    max_overflow=10,
    # Connection timeout in seconds
    pool_timeout=30,
    # Recycle connections after 30 minutes to prevent stale connections
    pool_recycle=1800,
    # Echo SQL statements for debugging (set to False in production)
    echo=False
)

# SessionLocal will be used to create database sessions
# autocommit=False ensures we have explicit control over transactions
# autoflush=False prevents SQLAlchemy from automatically flushing on every query
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class that our database models will inherit from
Base = declarative_base()