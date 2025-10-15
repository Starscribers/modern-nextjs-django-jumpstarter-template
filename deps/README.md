# CDP-v3 Dependencies Setup

This folder contains all the necessary dependencies and services required to run the CDP-v3 project locally. The `docker-compose.yml` file consolidates all backend services needed for development.

## Overview

CDP-v3 is a Customer Data Platform with both frontend (Vue.js) and backend (Django) components. This setup provides all the infrastructure services required for local development.

## Services Included

The following services are configured and ready to run:

### 🐰 RabbitMQ
- **Purpose**: Message queue for background tasks and async processing
- **Ports**:
  - `5672`: AMQP protocol
  - `15672`: Management UI
- **Credentials**:
  - Username: `deku-mq`
  - Password: `deku-mq`
- **Management UI**: http://localhost:15672

### 🐘 PostgreSQL
- **Purpose**: Primary database for the application
- **Port**: `5432`
- **Credentials**:
  - Username: `cdpuser`
  - Password: `cdpuser`
  - Database: `cdpuser`
- **Configuration**:
  - Max connections: 1000
  - Max WAL size: 3GB
  - Shared memory: 2GB
- **Initialization**: Automatically creates user and database on first run

### 📦 Redis
- **Purpose**: Caching and session storage
- **Port**: `6379`
- **Data persistence**: Enabled with volume mapping

### ☁️ LocalStack S3
- **Purpose**: Local AWS S3 simulation for file storage
- **Ports**:
  - `4566`: Main endpoint
  - `4579`: Additional services
- **Buckets**: Automatically creates:
  - `filestore` - General file storage
  - `datahub` - Data processing files
  - `image` - Image storage

## Prerequisites

Before starting, ensure you have:

1. **Docker & Docker Compose** installed
   ```bash
   # Check if Docker is installed
   docker --version
   docker-compose --version
   ```

2. **Git** for cloning the repository
   ```bash
   git --version
   ```

3. **Node.js 20.x.x** for frontend development
   ```bash
   # Use nvm to install Node.js 20
   nvm install 20
   nvm use 20
   node --version
   ```

4. **Python 3.12** for backend development
   ```bash
   python --version
   ```

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/StarcoFeel/cdp-v3.git
cd cdp-v3
```

### 2. Start Dependencies
```bash
# Navigate to deps folder
cd deps

# Start all services
docker-compose up -d

# Check if all services are running
docker-compose ps
```

### 3. Verify Services

**PostgreSQL**:
```bash
# Connect to verify database
docker-compose exec postgresql psql -U cdpuser -d cdpuser -c "\dt"
```

**RabbitMQ**:
- Visit http://localhost:15672
- Login with `deku-mq` / `deku-mq`

**Redis**:
```bash
# Test Redis connection
docker-compose exec redis redis-cli ping
```

**LocalStack S3**:
```bash
# List created buckets
docker-compose exec s3-local awslocal s3 ls
```

### 4. Backend Setup

Navigate to the backend folder and set up the Django application:

```bash
cd ../backend

# Copy environment file
cp .env.example .env

# Install dependencies with uv
uv sync

# Run database migrations
uv run python manage.py migrate

# Create superuser (optional)
uv run python manage.py createsuperuser

# Start development server
uv run python manage.py runserver
```

**Backend will be available at**: http://localhost:8000

### 5. Frontend Setup

Navigate to the frontend folder and set up the Vue.js application:

```bash
cd ../frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be available at**: http://localhost:5173

## Environment Configuration

### Backend (.env)
Key environment variables for backend:
```env
DEBUG=True
DATABASE_URL=postgresql://cdpuser:cdpuser@localhost:5432/cdpuser
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=amqp://deku-mq:deku-mq@localhost:5672//

# AWS S3 (LocalStack)
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_S3_ENDPOINT_URL=http://localhost:4566
AWS_S3_BUCKET_FILESTORE=filestore
AWS_S3_BUCKET_DATAHUB=datahub
AWS_S3_BUCKET_IMAGE=image
```

### Frontend (.env)
Key environment variables for frontend:
```env
VITE_BASE_URL=http://localhost:8000
VITE_ENVIRONMENT=development
```

## Service Management

### Starting Services
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d postgresql
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This will delete all data)
docker-compose down -v
```

### Viewing Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs postgresql
docker-compose logs -f rabbitmq  # Follow logs
```

### Service Status
```bash
# Check running services
docker-compose ps

# Restart specific service
docker-compose restart redis
```

## Data Persistence

The project uses named Docker volumes with the `cdp-v3-` prefix for better organization:

- **PostgreSQL**: Data stored in `cdp-v3-postgresql-data` volume
- **Redis**: Data stored in `cdp-v3-redis-data` volume
- **RabbitMQ**: Data stored in `cdp-v3-rabbitmq-data` volume
- **LocalStack**: Data stored in `cdp-v3-localstack-data` volume
- **S3 Initialization**: Buckets initialized via `./aws/s3/init.sh`

### Volume Management

```bash
# List all CDP-v3 volumes
docker volume ls | grep cdp-v3

# Remove all CDP-v3 volumes (⚠️ This will delete all data)
docker volume rm cdp-v3-postgresql-data cdp-v3-redis-data cdp-v3-rabbitmq-data cdp-v3-localstack-data

# Backup a volume (example for PostgreSQL)
docker run --rm -v cdp-v3-postgresql-data:/data -v $(pwd):/backup ubuntu tar czf /backup/postgresql-backup.tar.gz -C /data .

# Restore a volume (example for PostgreSQL)
docker run --rm -v cdp-v3-postgresql-data:/data -v $(pwd):/backup ubuntu tar xzf /backup/postgresql-backup.tar.gz -C /data
```

## Troubleshooting

### Port Conflicts
If you encounter port conflicts, you can modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "15433:5432"  # Change PostgreSQL port
```

### Database Connection Issues
```bash
# Reset PostgreSQL
docker-compose down
docker volume rm cdp-v3-postgresql-data  # Remove PostgreSQL volume
docker-compose up -d postgresql
```

### Memory Issues
If you encounter memory issues:
```bash
# Increase Docker memory allocation in Docker Desktop
# Or reduce PostgreSQL shared memory in docker-compose.yml
```

### Service Health Check
```bash
# Check if services are healthy
docker-compose exec postgresql pg_isready -U cdpuser
docker-compose exec redis redis-cli ping
docker-compose exec rabbitmq rabbitmqctl status
```

## Development Workflow

1. **Start dependencies**: `docker-compose up -d`
2. **Backend development**: Run Django server with `uv run python manage.py runserver`
3. **Frontend development**: Run Vue.js dev server with `npm run dev`
4. **Background tasks**: Start Celery worker if needed
5. **Stop when done**: `docker-compose down`

## Additional Resources

- **Backend Documentation**: See `../backend/README.md`
- **Frontend Documentation**: See `../frontend/README.md` or run `npm run docs:dev`
- **API Documentation**: Available at http://localhost:8000/swagger/ when backend is running

## Contributing

1. Ensure all services are running properly
2. Run tests for both frontend and backend
3. Follow the coding standards defined in respective documentation
4. Submit pull requests with proper documentation

---

For more detailed information about the project architecture and development guidelines, refer to the documentation in the respective `frontend/` and `backend/` folders.
