# Deployment Guide

This guide provides comprehensive instructions for deploying the Modern Django Template to various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Git** for version control
- **Domain name** with DNS control (production)
- **SSL certificate** (production)

### Cloud Requirements (if deploying to cloud)
- AWS/GCP/Azure account with appropriate permissions
- Database service (RDS, Cloud SQL, etc.)
- Redis/ElastiCache instance
- S3/Cloud Storage bucket
- Load balancer and CDN

## Environment Configuration

### Environment Variables

Create environment files for each environment:

#### Backend Environment (`.env`)
```bash
# Django Core
SECRET_KEY=your-secret-key-here-make-it-long-and-random
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
FRONTEND_URL=https://yourdomain.com
HOST_URL=https://api.yourdomain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your-database-host.com
DB_PORT=5432

# Redis/Cache
CACHE_BACKEND=django_redis.cache.RedisCache
CACHE_LOCATION=redis://your-redis-host:6379/1
ENABLE_CACHE=True

# Celery
CELERY_BROKER_URL=redis://your-redis-host:6379/0
CELERY_RESULT_BACKEND=redis://your-redis-host:6379/0

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_ENDPOINT_URL=https://s3.amazonaws.com
FILESTORE_BUCKET_NAME=your-s3-bucket-name

# Security
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Monitoring
SENTRY_DSN=your-sentry-dsn
ENVIRONMENT=production
TRACES_SAMPLE_RATE=0.1
PROFILES_SAMPLE_RATE=0.1

# Email (Optional)
EMAIL_HOST=smtp.amazonaws.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_ses_user
EMAIL_HOST_PASSWORD=your_ses_password
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

# OAuth (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

#### Frontend Environment (`.env.production`)
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_SENTRY_DSN=your_frontend_sentry_dsn
```

## Local Development

### Quick Start
```bash
# Clone repository
git clone <your-repo-url> myproject
cd myproject

# Start development environment
cd deps
docker compose up -d

# Set up backend
cd ../backend/src
cp .env.example .env
# Edit .env with your local settings
uv sync
uv run python manage.py migrate
uv run python manage.py createsuperuser

# Set up frontend
cd ../../frontend
cp .env.example .env.local
npm install

# Start development servers
npm run dev  # Frontend (port 3000)
cd ../backend/src && uv run python manage.py runserver  # Backend (port 8000)
```

### Development Services
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Admin Panel: http://localhost:8000/admin/
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- RabbitMQ Management: http://localhost:15672

## Production Deployment

### 1. Server Setup

#### Ubuntu 20.04/22.04 LTS
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install NGINX
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Application Deployment

#### Create Production Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build: ./backend
    environment:
      - DJANGO_SETTINGS_MODULE=example_project.settings
    volumes:
      - static_volume:/app/static
      - media_volume:/app/media
    depends_on:
      - redis
    networks:
      - app_network

  frontend:
    build: ./frontend
    volumes:
      - ./frontend/.next:/app/.next
    depends_on:
      - backend
    networks:
      - app_network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - static_volume:/var/www/static
      - media_volume:/var/www/media
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - backend
      - frontend
    networks:
      - app_network

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
    networks:
      - app_network

  celery:
    build: ./backend
    command: celery -A example_project worker -l info
    depends_on:
      - redis
    networks:
      - app_network

  celery-beat:
    build: ./backend
    command: celery -A example_project beat -l info
    depends_on:
      - redis
    networks:
      - app_network

volumes:
  static_volume:
  media_volume:
  redis_data:

networks:
  app_network:
    driver: bridge
```

#### NGINX Configuration
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:3000;
    }

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

        # API routes
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Admin routes
        location /admin/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files
        location /static/ {
            alias /var/www/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Media files
        location /media/ {
            alias /var/www/media/;
            expires 1y;
            add_header Cache-Control "public";
        }

        # Frontend routes
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 3. SSL Certificate Setup
```bash
# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run

# Set up auto-renewal cron job
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### 4. Deploy Application
```bash
# Clone repository
git clone <your-repo-url> /opt/myproject
cd /opt/myproject

# Set up environment variables
cp backend/src/.env.example backend/src/.env
cp frontend/.env.example frontend/.env.production
# Edit environment files with production values

# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Create superuser
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

# Collect static files
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput
```

## Docker Deployment

### Production Dockerfile (Backend)
```dockerfile
# backend/Dockerfile.prod
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY pyproject.toml ./
RUN pip install uv && uv sync --frozen

# Copy application code
COPY src/ ./

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Run application
CMD ["uv", "run", "gunicorn", "--bind", "0.0.0.0:8000", "example_project.wsgi:application"]
```

### Production Dockerfile (Frontend)
```dockerfile
# frontend/Dockerfile.prod
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
```

## Cloud Deployment

### AWS Deployment

#### Using AWS ECS with Fargate
```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Create ECS cluster
aws ecs create-cluster --cluster-name myproject-cluster

# Create task definitions and services
# (Use AWS Console or CloudFormation templates)
```

#### Using AWS App Runner
```yaml
# apprunner.yaml
version: 1.0
runtime: python3
build:
  commands:
    build:
      - pip install uv
      - uv sync
env:
  - name: DATABASE_URL
    value: "postgresql://..."
  - name: REDIS_URL
    value: "redis://..."
```

### Google Cloud Deployment

#### Using Google Cloud Run
```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/myproject-backend

# Deploy to Cloud Run
gcloud run deploy myproject-backend \
  --image gcr.io/PROJECT_ID/myproject-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure Deployment

#### Using Azure Container Instances
```bash
# Create resource group
az group create --name myproject-rg --location eastus

# Deploy container
az container create \
  --resource-group myproject-rg \
  --name myproject-backend \
  --image myregistry.azurecr.io/myproject-backend:latest \
  --dns-name-label myproject-backend \
  --ports 8000
```

## Monitoring and Maintenance

### Health Checks
```python
# backend/src/core/views.py
from django.http import JsonResponse
from django.db import connections

def health_check(request):
    try:
        # Check database connection
        db_conn = connections['default']
        db_conn.cursor()
        
        # Check Redis connection
        from django.core.cache import cache
        cache.set('health_check', 'ok', 10)
        
        return JsonResponse({'status': 'healthy'})
    except Exception as e:
        return JsonResponse({'status': 'unhealthy', 'error': str(e)}, status=503)
```

### Logging Configuration
```python
# backend/src/example_project/settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/django.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
        },
    },
}
```

### Backup Strategy
```bash
#!/bin/bash
# backup.sh

# Database backup
pg_dump $DATABASE_URL > /backups/db_$(date +%Y%m%d_%H%M%S).sql

# File backup
aws s3 sync s3://your-bucket-name /backups/files/$(date +%Y%m%d)

# Cleanup old backups (keep 30 days)
find /backups -name "*.sql" -mtime +30 -delete
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connectivity
docker-compose exec backend python manage.py dbshell

# Check database logs
docker-compose logs postgres
```

#### Redis Connection Issues
```bash
# Test Redis connection
docker-compose exec redis redis-cli ping

# Check Redis logs
docker-compose logs redis
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL configuration
openssl s_client -connect yourdomain.com:443
```

#### Performance Issues
```bash
# Check container resource usage
docker stats

# Check application logs
docker-compose logs backend
docker-compose logs frontend

# Monitor database queries
# Enable Django debug toolbar in development
```

### Debugging Commands
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute commands in containers
docker-compose exec backend python manage.py shell
docker-compose exec backend python manage.py dbshell

# Check container resource usage
docker stats

# Restart services
docker-compose restart backend
docker-compose restart frontend
```

### Rolling Updates
```bash
# Update with zero downtime
docker-compose pull
docker-compose up -d --no-deps backend
docker-compose up -d --no-deps frontend

# Run migrations
docker-compose exec backend python manage.py migrate

# Check service health
curl -f http://yourdomain.com/api/health/
```

## Security Checklist

- [ ] Environment variables are properly secured
- [ ] Database has restricted access
- [ ] SSL certificates are configured
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Security headers are set
- [ ] Backup strategy is implemented
- [ ] Monitoring and alerting is configured
- [ ] Log aggregation is set up
- [ ] Error tracking is enabled