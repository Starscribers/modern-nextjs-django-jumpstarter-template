# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project template release
- Django 5.2+ backend with REST API
- Next.js 14+ frontend with TypeScript
- Docker containerization for all services
- PostgreSQL database with initialization scripts
- Redis for caching and session management
- RabbitMQ for message queuing
- LocalStack S3 for file storage (development)
- Celery for background task processing
- JWT authentication with refresh tokens
- OAuth integration (GitHub example)
- Comprehensive test suites for both backend and frontend
- API documentation with Swagger/OpenAPI
- Pre-commit hooks with code quality tools
- Environment-specific configurations
- Rate limiting and security headers
- Internationalization (i18n) support
- Rich text editor with EditorJS
- Drag & drop functionality
- Charts and data visualization
- QR code generation and scanning

### Changed
- N/A (Initial release)

### Deprecated
- N/A (Initial release)

### Removed
- N/A (Initial release)

### Fixed
- N/A (Initial release)

### Security
- CORS and CSP security headers configured
- JWT token security with rotation
- Rate limiting for authentication endpoints
- Input validation and sanitization

## Template Usage Guidelines

When using this template for your project:

1. Update the version number in `pyproject.toml` and `package.json`
2. Replace "example_project" with your actual project name throughout the codebase
3. Update this CHANGELOG.md with your project's actual changes
4. Configure environment variables for your specific use case
5. Update the README.md with project-specific information

## Version Format

- **Major**: Breaking changes that require migration
- **Minor**: New features that are backward compatible
- **Patch**: Bug fixes and small improvements

## Categories

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes