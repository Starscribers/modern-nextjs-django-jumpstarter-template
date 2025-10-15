from typing import Any, Self

from core.config import settings


class FileStorage:
    """
    connect to the file storage backend at instantiation
    respective adpaters should handle that logic
    """

    def __init__(
        self: Self,
        adapter_name: str,
        storage_name: str = "",
    ) -> None:
        modeule_name, class_name = adapter_name.rsplit(".", 1)
        adapter = getattr(__import__(modeule_name, fromlist=[class_name]), class_name)
        self.adapter = adapter(storage_name)

    def path_exists(self: Self, path: str) -> bool:
        return self.adapter.path_exists(path)

    def list_files(
        self: Self,
        folder_name: str = "",
        *args: Any,
        **kwargs: Any,
    ) -> list[str]:
        """
        list all files within the folder
        if folder_name is empty, list all files in the root directory
        """
        return self.adapter.list_files(folder_name, *args, **kwargs)

    def get_object(
        self: Self,
        remote_path: str,
        *async_args: Any,
        **async_kwargs: Any,
    ) -> dict[str, Any]:
        """
        get the object from the storage and store them at memory level
        served for in-memory processing
        """
        return self.adapter.get_object(
            remote_path,
            *async_args,
            **async_kwargs,
        )

    def put_object(
        self: Self,
        obj: dict[str, Any],
        remote_path: str,
        *async_args: Any,
        **async_kwargs: Any,
    ) -> None:
        self.adapter.put_object(
            obj,
            remote_path,
            *async_args,
            **async_kwargs,
        )

    def delete_object(
        self: Self,
        remote_path: str,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        """
        Developer using only
        """
        self.adapter.delete_object(
            remote_path,
            *args,
            **kwargs,
        )

    def upload_file(
        self: Self,
        local_path: str,
        remote_path: str,
        prefer_async: bool = False,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        return self.adapter.upload_file(
            local_path,
            remote_path,
            prefer_async,
            *args,
            **kwargs,
        )

    def upload_folder(
        self: Self,
        local_path: str,
        remote_path: str,
        prefer_async: bool = False,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        return self.adapter.upload_folder(
            local_path,
            remote_path,
            prefer_async,
            *args,
            **kwargs,
        )

    def download_file(
        self: Self,
        remote_path: str,
        local_path: str,
        prefer_async: bool = False,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        return self.adapter.download_file(
            remote_path,
            local_path,
            prefer_async,
            *args,
            **kwargs,
        )

    def download_folder(
        self: Self,
        remote_path: str,
        local_path: str,
        prefer_async: bool = False,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        return self.adapter.download_folder(
            remote_path,
            local_path,
            prefer_async,
            *args,
            **kwargs,
        )

    def get_django_storage(self: Self) -> object:
        return self.adapter.get_django_storage()


bucket_datahub = FileStorage(
    settings.DATAHUB_BACKEND,
    "datahub",
)
bucket_filestore = FileStorage(
    settings.FILESTORE_BACKEND,
    "filestore",
)
bucket_image = FileStorage(
    settings.IMAGE_BACKEND,
    "image",
)
