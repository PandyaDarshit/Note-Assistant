# Mukti: AI-Powered Study Notes Assistant 📚

Mukti is an intelligent study assistant that transforms your learning experience by generating personalized study notes using advanced AI technology. Leveraging Ollama's phi4:14b model, it adapts content based on your learning style and proficiency level, making learning more effective and engaging.

![Mukti Demo](demo.gif)

## 🌟 Features

Mukti brings personalized learning to your fingertips with features designed to enhance your study experience:

- **Personalized Note Generation**: Creates study materials tailored to your learning style and level
- **Learning Style Adaptation**: Supports visual, auditory, reading/writing, and kinesthetic learning preferences
- **Interactive Content**: Generates structured notes with real-world examples and practice exercises
- **Easy Navigation**: Browse and organize your study materials effortlessly
- **Smart Content Organization**: Automatically generates table of contents and structured sections

## 🏗️ Architecture

Mukti follows a modern microservices architecture, integrating powerful technologies to deliver a seamless learning experience:

```mermaid
flowchart TB
    subgraph Frontend
        UI[React UI] --> ApiService[API Service]
        ApiService --> Backend
    end

    subgraph Backend
        Backend[FastAPI Backend] --> OllamaService[Ollama Service]
        Backend --> NoteService[Note Service]
        NoteService --> DB[(PostgreSQL)]
        OllamaService --> OllamaServer[Ollama Server]
    end

    OllamaServer -->|phi4:14b model| OllamaService

🚀 Getting Started
Prerequisites
Before running Mukti, ensure you have:

Docker and Docker Compose (version 1.29.2 or higher)
Access to an Ollama server with phi4:14b model

Quick Start

Clone the repository:

bashCopygit clone https://github.com/yourusername/mukti-study-assistant.git
cd mukti-study-assistant

Configure environment variables:

bashCopy# Copy example environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Update with your configurations

Launch the application:

bashCopydocker-compose up --build

Access Mukti:


Frontend: http://localhost:3000
API Documentation: http://localhost:8000/docs

💻 Development Setup
Backend Development
bashCopycd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
Frontend Development
bashCopycd frontend
npm install
npm start
📁 Project Structure
Copymukti-study-assistant/
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   ├── ollama_service.py
│   │   │   └── note_service.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── database.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.js
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
🤝 Contributing
We welcome contributions to make Mukti even better! Here's how you can help:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

Please read CONTRIBUTING.md for detailed guidelines.
🧪 Testing
Run the test suites to ensure everything works correctly:
bashCopy# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
📋 Environment Configuration
Required environment variables:
envCopy# Backend (.env)
OLLAMA_API_URL=your-ollama-server-url
OLLAMA_MODEL=phi4:14b
DATABASE_URL=postgresql://user:password@db:5432/notes

# Frontend (.env)
REACT_APP_API_URL=http://localhost:8000
🗺️ Roadmap
Future enhancements planned:

Enhanced search functionality
User authentication and profiles
Collaborative note sharing
Mobile application
Offline support
Integration with popular learning management systems

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgments

Built with FastAPI and React
Powered by Ollama's phi4:14b model
Styled with Tailwind CSS
Special thanks to all our contributors

💬 Support
Need help? Feel free to:

Open an issue
Join our Discord community
Check out our Documentation


Made with ❤️ by the Mukti team
Copy
This README:
- Uses GitHub-style markdown formatting
- Includes emojis for better visual organization
- Provides clear sections with proper hierarchy
- Includes a mermaid diagram for architecture visualization
- Maintains professional yet friendly tone
- Provides comprehensive information for users and contributors

Would you like me to:
1. Add more technical details to any section?
2. Include additional setup scenarios?
3. Expand the contributing guidelines?
4. Add more visual elements?
