from __future__ import annotations

from pydantic_settings import BaseSettings


class FiltrationSettings(BaseSettings):
    MAXIMUM_STRING_CHOICES_COUNT: int = 50
