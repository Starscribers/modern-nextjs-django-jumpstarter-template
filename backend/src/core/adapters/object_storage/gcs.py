from __future__ import annotations

import os
import uuid
from pathlib import Path
from typing import TYPE_CHECKING, Any, Self

from storages.backends.gcloud import GoogleCloudStorage

from core.adapters.object_storage import StorageAdapter

from .async_gcs import AsynchronousGCS
from .gcs_file import GCSFile

if TYPE_CHECKING:
    from django.core.files.uploadedfile import InMemoryUploadedFile, SimpleUploadedFile


class GCSDefaultStorage(GoogleCloudStorage):
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
        return super()._save(str(path_name), content)


class GCSStorageAdapter(StorageAdapter):
    sync_adaptee_class = GCSFile
    async_adaptee_class = AsynchronousGCS

    def get_django_storage(self: Self) -> object:
        storage_context = {
            "bucket_name": self.options.BUCKET_NAME or self.storage_name,
        }
        if self.options.DOMAIN_NAME:
            storage_context["custom_domain"] = self.options.DOMAIN_NAME
        return GCSDefaultStorage(**storage_context)

    def path_exists(self: Self, path: str) -> bool:
        return self.sync_adaptee.file_exist(path)

    def list_files(
        self: Self,
        folder_name: str = "",
        filter_csv: bool = False,
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
        content = self.sync_adaptee.get_object(key=remote_path)
        return {"Body": content}

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
                gcs_key = (
                    Path(remote_path)
                    / Path(os.path.relpath(local_file_path, local_path))
                ).as_posix()
                self.upload_file(
                    str(local_file_path),
                    gcs_key,
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

        # List all objects with the prefix
        objects = self.sync_adaptee.list_objects_recursive(remote_path)

        for obj_key in objects:
            # Skip directories (objects ending with '/')
            if obj_key.endswith("/"):
                continue

            local_file_path = Path(local_path) / Path(obj_key).name
            # Create directory if it doesn't exist
            local_file_path.parent.mkdir(parents=True, exist_ok=True)

            self.download_file(
                obj_key,
                str(local_file_path),
                prefer_async,
                *args,
                **kwargs,
            )
