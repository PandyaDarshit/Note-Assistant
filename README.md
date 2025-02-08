# AI Study Notes Assistant

An intelligent study assistant that generates personalized study notes using the Ollama phi4:14b model. This application helps create structured, comprehensive study materials tailored to individual learning styles and proficiency levels.

## Features

- Personalized study note generation based on learning style and level
- Structured content organization with main concepts, examples, and practice exercises
- Real-world applications and connections to enhance understanding
- Interactive learning elements and memory aids
- Progress tracking and note management

## Prerequisites

Before you begin, ensure you have the following installed:
- Docker and Docker Compose
- Git

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-study-assistant
```

2. Set up environment variables:
```bash
# Copy example environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit the .env files with your configuration
```

3. Start the application:
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Project Structure

```
ai-study-assistant/
├── backend/              # FastAPI backend application
│   ├── app/             # Application code
│   │   ├── services/    # Business logic
│   │   ├── models.py    # Database models
│   │   └── main.py      # FastAPI application
│   └── Dockerfile       # Backend container configuration
├── frontend/            # React frontend application
│   ├── src/            # Source code
│   └── Dockerfile      # Frontend container configuration
└── docker-compose.yml   # Container orchestration
```

## Development

### Running in Development Mode

For development with hot-reload:

```bash
# Backend
cd backend
python -m uvicorn app.main:app --reload

# Frontend
cd frontend
npm start
```

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Production Deployment

For production deployment:

1. Update environment variables with production values
2. Build and start containers:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## API Documentation

The API documentation is available at `/docs` when the backend is running. It provides detailed information about available endpoints and their usage.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.