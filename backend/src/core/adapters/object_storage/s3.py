from __future__ import annotations

import os
import uuid
from pathlib import Path
from typing import TYPE_CHECKING, Any, Self

import boto3
from storages.backends.s3boto3 import S3Boto3Storage

from core.adapters.object_storage import StorageAdapter
from core.config import settings

from .async_s3 import AsynchronousS3
from .s3file import S3File

if TYPE_CHECKING:
    from django.core.files.uploadedfile import InMemoryUploadedFile, SimpleUploadedFile

s3 = boto3.client("s3", endpoint_url=settings.S3_ENDPOINT_URL)


class S3DefaultStorage(S3Boto3Storage):
    def _save(
        self: Self,
        name: str,
        content: InMemoryUploadedFile | SimpleUploadedFile,
    ) -> str:
        """
        Add uuid in the file name to avoid overwriting.
        """
        path = Path(name)
        uuid_without_dashes = str(uuid.uuid4()).replace("-", "")
        path_name = path.parent / f"{uuid_without_dashes}{path.suffix}"
        return super()._save(path_name, content)


class S3StorageAdapter(StorageAdapter):
    sync_adaptee_class = S3File
    async_adaptee_class = AsynchronousS3

    def get_django_storage(self: Self) -> object:
        storage_context = {
            "bucket_name": self.options.BUCKET_NAME or self.storage_name,
        }
        if self.options.DOMAIN_NAME:
            storage_context["custom_domain"] = self.options.DOMAIN_NAME
        return S3DefaultStorage(**storage_context)

    def path_exists(self: Self, path: str) -> None:
        return self.sync_adaptee.file_exist(path)

    def list_files(
        self: Self,
        folder_name: str = "",
        filter_csv: bool = True,
        *args: Any,
        **kwargs: Any,
    ) -> list[str]:
        return self.sync_adaptee.list_objects(folder_name, filter_csv)

    def get_object(
        self: Self,
        remote_path: str,
        *args: Any,
        **kwargs: Any,
    ) -> dict[str, Any]:
        return self.sync_adaptee.get_object(key=remote_path)

    def put_object(
        self: Self,
        obj: dict[str, Any],
        remote_path: str,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        return self.sync_adaptee.put_object(obj, key=remote_path)

    def delete_object(
        self: Self,
        remote_path: str,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        """
        Developer using only
        """
        self.sync_adaptee.delete_object(key=remote_path)

    def upload_file(
        self: Self,
        local_path: str,
        remote_path: str,
        prefer_async: bool,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        if prefer_async and self.async_adaptee:
            return self.async_adaptee.upload_file(
                local_path,
                remote_path,
                *args,
                **kwargs,
            )

        return self.sync_adaptee.upload_file(local_path, remote_path)

    def upload_folder(
        self: Self,
        local_path: str,
        remote_path: str,
        prefer_async: bool,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        for root, _, files in os.walk(local_path):
            for file in files:
                local_file_path = Path(root) / file
                s3_key = (
                    Path(remote_path)
                    / Path(os.path.relpath(local_file_path, local_path))
                ).as_posix()
                self.upload_file(
                    local_file_path,  # type:ignore[arg-type]
                    s3_key,
                    prefer_async,
                    *args,
                    **kwargs,
                )

    def download_file(
        self: Self,
        remote_path: str,
        local_path: str,
        prefer_async: bool,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        if prefer_async and self.async_adaptee:
            return self.async_adaptee.download_file(
                remote_path,
                local_path,
                *args,
                **kwargs,
            )

        return self.sync_adaptee.download_file(remote_path, local_path)

    def download_folder(
        self: Self,
        remote_path: str,
        local_path: str,
        prefer_async: bool,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        Path.mkdir(Path(local_path), exist_ok=True)
        paginator = self.sync_adaptee.s3.get_paginator("list_objects_v2")
        operation_parameters = {
            "Bucket": self.sync_adaptee.bucket_name,
            "Prefix": remote_path,
        }
        page_iterator = paginator.paginate(**operation_parameters)

        for page in page_iterator:
            if page.get("Contents") is not None:
                for obj in page["Contents"]:
                    key = obj["Key"]
                    local_file_path = Path(local_path) / Path(key).name
                    self.download_file(
                        key,
                        local_file_path,  # type:ignore[arg-type]
                        prefer_async,
                        *args,
                        **kwargs,
                    )
