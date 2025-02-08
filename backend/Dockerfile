# backend/Dockerfile

# Start with Python 3.9 slim image as our base
# We use the slim version to keep the image size small while still having essential packages
FROM python:3.9-slim

# Set working directory in the container
# This is where our application code will live inside the container
WORKDIR /app

# Set environment variables
# PYTHONUNBUFFERED ensures our Python output is sent straight to terminal without buffering
# PYTHONPATH helps Python find our application modules
ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Install system dependencies
# We install these packages that are required for psycopg2 and other Python packages
# Then clean up apt cache to keep the image size small
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        python3-dev \
        libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first
# This is a Docker best practice - it allows us to cache the pip install layer
# if requirements haven't changed
COPY requirements.txt .

# Install Python dependencies
# We use --no-cache-dir to keep the image size small by not caching pip packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
# This includes our app directory with all Python files
COPY . .

# Create a non-root user for security
# Running containers as root is not recommended for security reasons
RUN adduser --disabled-password --gecos '' appuser \
    && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
# We use uvicorn with host 0.0.0.0 to allow external connections
# The --proxy-headers flag is important when running behind a proxy
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]