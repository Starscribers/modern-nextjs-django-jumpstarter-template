from __future__ import annotations

import json
import shutil
from pathlib import Path
from typing import TYPE_CHECKING, Any, Self

from django.core.files.storage import FileSystemStorage

from core.adapters.object_storage import StorageAdapter
from core.config import settings

if TYPE_CHECKING:
    from core.config.storage import StorageOptions


class LocalFile:
    def __init__(self: Self, storage_options: StorageOptions) -> None:
        self.base_path = Path(storage_options.LOCAL_PATH)
        self.base_path.mkdir(parents=True, exist_ok=True)

    def get_full_path(self: Self, path: str) -> Path:
        return (self.base_path / path).resolve()

    def path_exists(self: Self, path: str) -> bool:
        return self.get_full_path(path).exists()

    def list_files(self: Self, folder_path: str) -> list[str]:
        if not Path(folder_path).exists():
            raise FileNotFoundError
        return Path(folder_path).iterdir()

    def get_object(
        self: Self,
        remote_path: str,
        *args: Any,
        **kwargs: Any,
    ) -> bytes:
        full_path = self.get_full_path(remote_path)
        if not full_path.exists():
            raise FileNotFoundError
        return Path.open(full_path, "rb").read()

    def put_object(
        self: Self,
        obj: list[dict[Any, Any]],
        remote_path: str,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        full_path = self.get_full_path(remote_path)
        full_path.parent.mkdir(parents=True, exist_ok=True)
        with Path.open(full_path, "w") as f:
            json.dump(obj, f)

    def delete_object(
        self: Self,
        remote_path: str,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        """
        Developer using only
        """
        full_path = self.get_full_path(remote_path)
        full_path.unlink(missing_ok=True)

    def upload_file(self: Self, file_path: str, destination_path: str) -> None:
        if not Path(file_path).exists():
            raise FileNotFoundError
        full_destination_path = self.get_full_path(destination_path)
        full_destination_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(file_path, full_destination_path)

    def upload_folder(self: Self, folder_path: str, destination_path: str) -> None:
        if not Path(folder_path).exists():
            raise FileNotFoundError
        full_path = self.get_full_path(destination_path)
        full_path.mkdir(parents=True, exist_ok=True)
        shutil.copytree(folder_path, full_path)

    def download_file(self: Self, source_path: str, destination_path: str) -> None:
        full_path = self.get_full_path(source_path)
        if not full_path.exists():
            raise FileNotFoundError
        Path.mkdir(
            Path(destination_path),
            parents=True,
            exist_ok=True,
        )
        shutil.copy(full_path, destination_path)

    def download_folder(self: Self, source_path: str, destination_path: str) -> None:
        full_path = self.get_full_path(source_path)
        if not full_path.exists():
            raise FileNotFoundError
        Path.mkdir(
            Path(destination_path),
            parents=True,
            exist_ok=True,
        )
        shutil.copytree(full_path, destination_path)


class LocalStorageAdapter(StorageAdapter):
    sync_adaptee_class = LocalFile
    async_adaptee_class = None

    def get_django_storage(self: Self) -> object:
        storage_context = {
            "location": self.options.BASE_PATH,
            "base_url": f"{settings.HOST_URL}/api/upload/",
        }
        return FileSystemStorage(**storage_context)

    def path_exists(self: Self, path: str) -> None:
        return self.sync_adaptee.path_exists(path)

    def list_files(
        self: Self,
        folder_name: str = "",
        *args: Any,
        **kwargs: Any,
    ) -> list[str]:
        folder_name = self.sync_adaptee.get_full_path(folder_name)
        return self.sync_adaptee.list_files(folder_name)

    def get_object(
        self: Self,
        remote_path: str,
        *args: Any,
        **kwargs: Any,
    ) -> dict[str, Any]:
        return self.sync_adaptee.get_object(remote_path)

    def put_object(
        self: Self,
        obj: dict[str, Any],
        remote_path: str,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        return self.sync_adaptee.put_object(obj, remote_path)

    def delete_object(
        self: Self,
        remote_path: str,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        """
        Developer using only
        """
        return self.sync_adaptee.delete_object(remote_path)

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
        if prefer_async and self.async_adaptee:
            return self.async_adaptee.upload_folder(
                local_path,
                remote_path,
                *args,
                **kwargs,
            )

        return self.sync_adaptee.upload_folder(local_path, remote_path)

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
        if prefer_async and self.async_adaptee:
            return self.async_adaptee.download_folder(
                remote_path,
                local_path,
                *args,
                **kwargs,
            )

        return self.sync_adaptee.download_folder(remote_path, local_path)
