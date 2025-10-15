from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict

from core.config.cache import CacheSettings
from core.config.database import DatabaseSettings
from core.config.filtration import FiltrationSettings
from core.config.frontend import FrontendRedirectSettings
from core.config.messaging import MessagingSettings
from core.config.notification import NotificationSettings
from core.config.sftp import SftpSettings
from core.config.short_url import ShortUrlSettings
from core.config.storage import StorageSettings
from core.config.system import SystemSettings


class DebugSettings(BaseSettings):
    FORCE_SYNC: bool = False
    DEBUG: bool = False
    COLORLOG: bool = False


class BucketSettings(BaseSettings):
    DATAHUB_BUCKET_NAME: str = "datahub"
    FILESTORE_BUCKET_NAME: str = "filestore"
    IMAGE_BUCKET_NAME: str = "image"
    IMAGE_DOMAIN_NAME: str | None = None


class SentrySettings(BaseSettings):
    SENTRY_DSN: str | None = None
    TRACES_SAMPLE_RATE: float = 1.0
    PROFILES_SAMPLE_RATE: float = 1.0


class Settings(
    BucketSettings,
    SystemSettings,
    FrontendRedirectSettings,
    DebugSettings,
    NotificationSettings,
    DatabaseSettings,
    SftpSettings,
    SentrySettings,
    StorageSettings,
    ShortUrlSettings,
    FiltrationSettings,
    CacheSettings,
    MessagingSettings,
):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
