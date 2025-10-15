from __future__ import annotations

from pydantic_settings import BaseSettings


class StorageSettings(BaseSettings):
    FILESTORE_BACKEND: str = "core.adapters.object_storage.s3.S3StorageAdapter"
    DATAHUB_BACKEND: str = "core.adapters.object_storage.s3.S3StorageAdapter"
    IMAGE_BACKEND: str = "core.adapters.object_storage.s3.S3StorageAdapter"
    UPLOAD_ROOT: str = "uploads"


class StorageOptions(BaseSettings):
    LOCAL_PATH: str = ""
    BASE_PATH: str = "uploads/"
    BUCKET_NAME: str = ""
    DOMAIN_NAME: str = ""
