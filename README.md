# LingPen - Linguistic Annotation Platform

[![Backend Tests](https://github.com/ahammedalsham/LingPen/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/ahammedalsham/LingPen/actions)
[![Frontend Tests](https://github.com/ahammedalsham/LingPen/actions/workflows/frontend-tests.yml/badge.svg)](https://github.com/ahammedalsham/LingPen/actions)

**LingPen** is a modern, collaborative web application for linguistic annotation and treebank management. It enables teams to work together on dependency parsing, morphological annotation, and other linguistic tasks.

## 🎯 Features

- **Collaborative Annotation**: Multiple annotators working on the same treebank simultaneously
- **Version Control**: Complete audit trail of all changes with undo/redo capabilities
- **Rich Linguistic Support**: Built for Indian languages (Malayalam, Hindi, Tamil, etc.)
- **CoNLL-U Compatible**: Import/export standard CoNLL-U formatted treebanks
- **Real-time Validation**: Live validation of CoNLL-U constraints
- **Role-Based Access**: Annotators, reviewers, and admin roles with granular permissions

## 🏗️ Architecture

LingPen uses a modern full-stack architecture:

- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS + Zustand
- **Backend**: FastAPI + async SQLAlchemy 2.0 + PostgreSQL
- **Deployment**: Docker Compose for development, Kubernetes-ready for production

## 🚀 Quick Start

### Prerequisites

- **Docker** & **Docker Compose** (recommended)
- OR **Python 3.10+**, **Node.js 18+**, **PostgreSQL 16**

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/ahammedalsham/LingPen.git
cd lingpen

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start development environment
docker-compose up -d

# Check status
docker-compose ps
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs

### Local Development Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Setup environment variables
cp .env.example .env

# Run server
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## 📖 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and technical decisions
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v --cov=app
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🔒 Security

- **Environment Variables**: All secrets via `.env` files (never commit to git)
- **Password Hashing**: bcrypt for secure storage
- **JWT Tokens**: Stateless authentication
- **CORS**: Restricted to trusted origins
- **Input Validation**: Pydantic schemas
- **SQL Injection Protection**: SQLAlchemy with parameterized queries

## 📋 Environment Configuration

Create a `.env` file:

```bash
# Database
DATABASE_URL=postgresql+asyncpg://lingpen:password@localhost:5432/lingpen

# Environment
ENVIRONMENT=development
DEBUG=true

# Security
JWT_SECRET=your-secret-key-change-in-production

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Code style guidelines
- Git workflow
- Pull request process
- Testing requirements

## 📝 API Documentation

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 🐛 Troubleshooting

### Backend issues

```bash
# Check logs
docker-compose logs backend

# Rebuild container
docker-compose up --build backend
```

### Frontend can't reach API

- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running on port 8000
- Check CORS settings

## 📊 Performance

- Async I/O throughout
- Connection pooling (10 connections)
- Zustand for efficient state management
- Next.js code splitting & optimization

## 🚢 Deployment

Production deployment:
1. Update `.env` with production values
2. Use `docker-compose.prod.yml`
3. Deploy with Kubernetes or Docker Swarm

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed guide.

## 📄 License

MIT License - see LICENSE file for details.

## 👥 Authors

- **Hamad Alsham** - Initial development

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/ahammedalsham/LingPen/issues)
- **Documentation**: See [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Made with ❤️ for linguistic research and annotation**
