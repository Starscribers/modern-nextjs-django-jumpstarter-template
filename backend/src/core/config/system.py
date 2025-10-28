from __future__ import annotations

from typing import Self
from zoneinfo import ZoneInfo

from pydantic_settings import BaseSettings


class SystemSettings(BaseSettings):
    S3_ENDPOINT_URL: str | None = None
    SEGMENTATION_BACKEND: str = "segmentation.backends.pg.PGSegmentationBackend"
    BATCH_SIZE: int = 1000

    DOWNLOAD_FILE_EXPIRE_SECONDS: int = 60

    # Maximum upload file size (byte)
    MAX_FILE_SIZE_BYTES: int = 1_000_000_000

    @property
    def MAX_FILE_SIZE_MB(self: Self) -> int:
        return self.MAX_FILE_SIZE_BYTES // 1000000

    TIMEZONE_NAME: str = "Asia/Taipei"

    @property
    def TIMEZONE(self: Self) -> ZoneInfo:
        return ZoneInfo(self.TIMEZONE_NAME)

    PROJECT_NAME: str = "example_project"

    SECRET_KEY: str | None = None
    ENVIRONMENT: str = "local"
    HOST_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:3000"

    # CELERY
    CELERY_BROKER_URL: str = ""

    # Google Cloud Pub/Sub
    GOOGLE_CLOUD_PROJECT: str | None = None
    PUBSUB_TOPIC_PREFIX: str = "celery"

    # AWS
    AWS_ACCESS_KEY_ID: str | None = None
    AWS_SECRET_ACCESS_KEY: str | None = None

    # CELERY_SQS
    SQS_ENDPOINT_URL: str | None = None

    SNS_TOPIC_ARN: str | None = None
