# Contributing to Modern Django Template

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Setting Up Development Environment

1. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/modern-django-template.git
   cd modern-django-template
   ```

2. **Set up the development environment:**
   ```bash
   # Start Docker services
   cd deps
   docker compose up -d
   
   # Set up backend
   cd ../backend/src
   uv sync
   cp .env.example .env
   uv run python manage.py migrate
   uv run python manage.py createsuperuser
   
   # Set up frontend
   cd ../../frontend
   npm install
   cp .env.example .env.local
   ```

3. **Install pre-commit hooks:**
   ```bash
   cd backend/src
   uv run pre-commit install
   ```

## Code Style

### Backend (Python/Django)

We use several tools to maintain code quality:

- **Ruff** for linting and formatting
- **MyPy** for type checking
- **Pre-commit** hooks for automated checks

```bash
cd backend/src

# Format code
uv run ruff format .

# Lint code
uv run ruff check .

# Type checking
uv run mypy .

# Run all pre-commit checks
uv run pre-commit run --all-files
```

**Code Style Guidelines:**

- Follow PEP 8 and Django coding standards
- Use type hints for all function parameters and return values
- Write docstrings for classes and functions
- Keep functions focused and small
- Use meaningful variable and function names
- Add comments for complex business logic

**Django-specific guidelines:**

- Use Django's built-in features rather than reinventing them
- Follow Django REST Framework patterns for API endpoints
- Use Django's permission system for authorization
- Write model methods for business logic
- Use Django's form validation where appropriate

### Frontend (TypeScript/Next.js)

- **ESLint** and **Prettier** for code formatting
- **TypeScript** for type safety

```bash
cd frontend

# Format code
npm run format

# Lint code
npm run lint

# Type checking
npm run type-check
```

**Code Style Guidelines:**

- Use TypeScript for all new files
- Follow React best practices and hooks patterns
- Use functional components over class components
- Implement proper error boundaries
- Use Tailwind CSS classes instead of custom CSS when possible
- Keep components small and focused
- Use proper TypeScript interfaces for props

## Testing

### Backend Tests

```bash
cd backend/src

# Run all tests
uv run pytest

# Run tests with coverage
uv run pytest --cov=. --cov-report=html

# Run specific test file
uv run pytest core/tests.py

# Run tests matching a pattern
uv run pytest -k "test_user"
```

**Testing Guidelines:**

- Write tests for all new features
- Maintain at least 80% test coverage
- Use Django's TestCase for database-related tests
- Use pytest fixtures for test setup
- Mock external API calls
- Test both success and error cases

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:ci
```

**Testing Guidelines:**

- Write unit tests for utility functions
- Write integration tests for components
- Test user interactions and edge cases
- Mock API calls in tests
- Use React Testing Library best practices

## Submitting Changes

### Bug Reports

Use GitHub issues to track bugs. Write detailed bug reports with:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Feature Requests

Use GitHub issues for feature requests. Include:

- Clear description of the feature
- Use cases and motivation
- Possible implementation approach
- Any breaking changes

### Pull Request Process

1. **Create a descriptive branch name:**
   ```bash
   git checkout -b feature/add-user-profiles
   git checkout -b fix/authentication-bug
   git checkout -b docs/update-readme
   ```

2. **Make your changes following the code style guidelines**

3. **Add tests for your changes**

4. **Update documentation if needed**

5. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add user profile functionality
   
   - Added user profile model and serializer
   - Created profile management endpoints
   - Added profile tests and documentation
   - Updated API schema"
   ```

6. **Push to your fork and create a pull request**

### Commit Message Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an emoji:
  - 🎉 `:tada:` for initial commits
  - ✨ `:sparkles:` for new features
  - 🐛 `:bug:` for bug fixes
  - 📚 `:books:` for documentation
  - 🎨 `:art:` for improving code structure
  - ⚡ `:zap:` for performance improvements
  - ✅ `:white_check_mark:` for tests
  - 🔧 `:wrench:` for configuration changes

## Code Review Process

The core team looks at Pull Requests on a regular basis. After feedback has been given we expect responses within two weeks. After two weeks we may close the pull request if it isn't showing any activity.

### Review Checklist

- [ ] Code follows the style guidelines
- [ ] Self-review of the code has been performed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Corresponding changes to documentation have been made
- [ ] Changes generate no new warnings
- [ ] Tests have been added that prove the fix is effective or that the feature works
- [ ] New and existing unit tests pass locally with the changes
- [ ] Any dependent changes have been merged and published

## Project Structure Guidelines

### Adding New Backend Apps

1. Create the app in `backend/src/`
2. Add it to `CUSTOM_APPS` in `settings.py`
3. Create necessary models, views, serializers, and tests
4. Add URL patterns to the main `urls.py`
5. Update API documentation

### Adding New Frontend Components

1. Place components in appropriate directories under `src/components/`
2. Create corresponding TypeScript interfaces in `src/types/`
3. Add to the component exports if it's reusable
4. Write tests for the component
5. Update Storybook stories if applicable

### Database Changes

1. Create migrations after model changes:
   ```bash
   uv run python manage.py makemigrations
   ```
2. Review the migration file before committing
3. Test migrations on a copy of production data
4. Document any breaking changes

## Getting Help

- Check existing issues before creating new ones
- Use GitHub Discussions for questions
- Tag maintainers if you need urgent attention
- Be respectful and patient

## Recognition

Contributors will be recognized in:
- The project README
- Release notes for significant contributions
- GitHub contributor statistics

Thank you for contributing to Modern Django Template! 🎉