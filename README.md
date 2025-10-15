# Modern Django Template

A production-ready full-stack template featuring Django REST Framework backend with Next.js frontend, complete with Docker containerization, comprehensive tooling, and modern development practices.

## 🚀 Features

### Backend (Django)
- **Django 5.2+** with Django REST Framework
- **JWT Authentication** with refresh tokens
- **OAuth integration** ready (GitHub OAuth setup included)
- **Celery** for background tasks with Redis/RabbitMQ support
- **PostgreSQL** database with optimized configuration
- **AWS S3** integration for file storage (LocalStack for development)
- **Comprehensive API documentation** with drf-yasg (Swagger)
- **Rate limiting** with django-axes
- **CORS and CSP** security headers
- **Sentry** integration for error monitoring
- **Pre-commit hooks** with comprehensive linting
- **Full test coverage** with pytest
- **Type hints** with mypy
- **Code quality** with Ruff formatter/linter

### Frontend (Next.js)
- **Next.js 14+** with App Router
- **TypeScript** with strict type checking
- **Tailwind CSS** for styling with custom components
- **Radix UI** components library
- **Framer Motion** for animations
- **EditorJS** rich text editor integration
- **i18n** internationalization support
- **React Beautiful DnD** for drag & drop
- **Charts** with Recharts
- **QR Code** generation and scanning
- **ESLint & Prettier** for code formatting
- **Jest** for testing

### DevOps & Infrastructure
- **Docker** containers for all services
- **Docker Compose** for local development
- **PostgreSQL** with initialization scripts
- **Redis** for caching and sessions
- **RabbitMQ** for message queuing
- **LocalStack S3** for development file storage
- **Hot reloading** for both frontend and backend
- **Environment-specific configurations**

## 📋 Prerequisites

- **Docker** and **Docker Compose**
- **Python 3.12+** (if running without Docker)
- **Node.js 18+** (if running without Docker)
- **Git** for version control

## 🛠 Quick Start

1. **Clone the template:**
   ```bash
   git clone <your-repo-url> my-project
   cd my-project
   ```

2. **Set up environment variables:**
   ```bash
   # Copy example environment files
   cp backend/src/.env.example backend/src/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Start all services:**
   ```bash
   # Using Docker Compose (Recommended)
   cd deps
   docker compose up -d
   
   # The services will be available at:
   # - Backend API: http://localhost:8000
   # - Frontend: http://localhost:3000
   # - PostgreSQL: localhost:5432
   # - Redis: localhost:6379
   # - RabbitMQ Management: http://localhost:15672
   # - LocalStack S3: http://localhost:4566
   ```

4. **Run database migrations:**
   ```bash
   cd backend/src
   uv run python manage.py migrate
   ```

5. **Create a superuser:**
   ```bash
   uv run python manage.py createsuperuser
   ```

6. **Access the applications:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/
   - Admin Panel: http://localhost:8000/admin/
   - API Documentation: http://localhost:8000/swagger/

## 🏗 Project Structure

```
├── backend/                    # Django backend
│   ├── src/
│   │   ├── core/              # Core app with utilities
│   │   ├── users/             # User management
│   │   ├── example_project/   # Django settings
│   │   └── manage.py
│   ├── Dockerfile
│   └── pyproject.toml         # Python dependencies
├── frontend/                  # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js app router pages
│   │   ├── components/       # React components
│   │   ├── lib/             # Utilities and API client
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   └── package.json
├── deps/                    # Docker services
│   ├── docker-compose.yml
│   └── postgresql/init/     # DB initialization scripts
└── docs/                   # Project documentation
```

## 🔧 Development

### Backend Development

```bash
cd backend/src

# Install dependencies with uv (recommended)
uv sync

# Or with pip
pip install -e .

# Run development server
uv run python manage.py runserver

# Run tests
uv run pytest

# Run linting
uv run ruff check .
uv run ruff format .

# Type checking
uv run mypy .
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint
npm run format

# Type checking
npm run type-check
```

### Database Management

```bash
# Create migrations
uv run python manage.py makemigrations

# Apply migrations
uv run python manage.py migrate

# Reset database (development only)
docker compose down -v
docker compose up -d postgres
uv run python manage.py migrate
```

### Background Tasks (Celery)

```bash
# Start Celery worker
cd backend/src
uv run celery -A example_project worker --loglevel=info

# Start Celery beat scheduler
uv run celery -A example_project beat --loglevel=info

# Monitor tasks
uv run celery -A example_project flower
```

## 🌍 Environment Variables

### Backend (.env)
```bash
# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=example_project
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
FRONTEND_URL=http://localhost:3000
HOST_URL=http://localhost:8000

# Redis/Cache
CACHE_BACKEND=django_redis.cache.RedisCache
CACHE_LOCATION=redis://localhost:6379/1
ENABLE_CACHE=True

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# AWS S3 (LocalStack for development)
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
S3_ENDPOINT_URL=http://localhost:4566
FILESTORE_BUCKET_NAME=example-project-files

# Sentry (optional)
SENTRY_DSN=your-sentry-dsn
ENVIRONMENT=development

# OAuth (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_ENVIRONMENT=development
```

## 🚀 Deployment

### Production Setup

1. **Update environment variables** for production
2. **Build Docker images:**
   ```bash
   docker build -t your-app-backend ./backend
   docker build -t your-app-frontend ./frontend
   ```

3. **Use production Docker Compose:**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

### Environment-Specific Configurations

- **Development:** Uses Docker Compose with hot reloading
- **Staging:** Similar to production but with debug logging
- **Production:** Optimized builds with proper security settings

## 🧪 Testing

### Backend Tests
```bash
cd backend/src

# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=. --cov-report=html

# Run specific tests
uv run pytest core/tests.py
```

### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm run test:ci

# Run in watch mode
npm run test:watch
```

## 📚 API Documentation

- **Swagger UI:** http://localhost:8000/swagger/
- **ReDoc:** http://localhost:8000/redoc/
- **OpenAPI Schema:** http://localhost:8000/api/schema/

The API follows RESTful conventions with consistent camelCase JSON responses.

## 🔐 Authentication

The template includes JWT authentication with:
- Access tokens (1 week lifetime)
- Refresh tokens (4 week lifetime)
- Automatic token rotation
- OAuth integration ready (GitHub example included)

### API Authentication
```javascript
// Login
POST /api/auth/login/
{
  "username": "user@example.com",
  "password": "password"
}

// Refresh token
POST /api/auth/token/refresh/
{
  "refresh": "your-refresh-token"
}
```

## 🎨 Customization

### Renaming the Project

1. **Update project names** in configuration files:
   - `backend/pyproject.toml`
   - `frontend/package.json`
   - `deps/docker-compose.yml`

2. **Rename Django project:**
   ```bash
   cd backend/src
   mv example_project your_project_name
   ```

3. **Update imports and references** throughout the codebase

4. **Update environment variables** and database names

### Adding New Features

1. **Backend:** Create new Django apps in `backend/src/`
2. **Frontend:** Add components in `frontend/src/components/`
3. **API:** Update OpenAPI schema with new endpoints
4. **Tests:** Add corresponding test files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation:** Check the `docs/` directory
- **Issues:** Create an issue on GitHub
- **Discussions:** Use GitHub Discussions for questions

## 🙏 Acknowledgments

- Django REST Framework team
- Next.js team
- All the amazing open-source libraries used in this template

---

**Happy coding!** 🎉
Join our discord open source community: https://discord.gg/ngE8JxjDx7