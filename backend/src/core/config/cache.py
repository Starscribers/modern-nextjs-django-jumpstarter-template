from pydantic_settings import BaseSettings


class CacheSettings(BaseSettings):
    ENABLE_CACHE: bool = False
    CACHE_BACKEND: str = "django.core.cache.backends.redis.RedisCache"
    CACHE_LOCATION: str = "redis://127.0.0.1:6379"

    # chart cache (seconds)
    CHART_CACHE_TIMEOUT: int = 288000
