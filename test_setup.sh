# test_setup.sh

#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🔍 Starting AI Study Assistant Application Test"
echo "============================================"

# Check if Docker is running
echo -n "Checking Docker status... "
if docker info >/dev/null 2>&1; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}Docker is not running${NC}"
    exit 1
fi

# Check if required ports are available
echo -n "Checking port 3000 availability... "
if ! lsof -i:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}Port 3000 is in use${NC}"
    exit 1
fi

echo -n "Checking port 8000 availability... "
if ! lsof -i:8000 >/dev/null 2>&1; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}Port 8000 is in use${NC}"
    exit 1
fi

# Verify environment files
echo -n "Checking backend environment file... "
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}Missing backend/.env${NC}"
    exit 1
fi

echo -n "Checking frontend environment file... "
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}Missing frontend/.env${NC}"
    exit 1
fi

# Test database connection
echo "Testing database connection..."
docker-compose up -d db
sleep 5  # Wait for database to start

if docker-compose exec db pg_isready -U studyapp >/dev/null 2>&1; then
    echo -e "${GREEN}Database connection successful${NC}"
else
    echo -e "${RED}Database connection failed${NC}"
    exit 1
fi

# Test Ollama server connection
echo -n "Testing Ollama server connection... "
if curl -s http://abts55669.de.bosch.com:11434/api/tags >/dev/null 2>&1; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}Cannot connect to Ollama server${NC}"
    exit 1
fi

echo "✅ Pre-flight checks completed successfully"
echo "==========================================="