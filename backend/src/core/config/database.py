from __future__ import annotations

from pydantic_settings import BaseSettings


class DatabaseSettings(BaseSettings):
    DB_ENGINE: str = "django.db.backends.postgresql"
    DB_USERNAME: str = "postgres"
    DB_PASSWORD: str = ""
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "postgres"
    CELERY_RESULT_BACKEND: str | None = None
