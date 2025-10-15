from __future__ import annotations

import os
from pathlib import Path
from typing import TYPE_CHECKING, Self

import paramiko

from core.config import settings
from core.utils import logger

if TYPE_CHECKING:
    import types


class SFTP:
    def __init__(
        self: Self,
        username: str = settings.SFTP_USERNAME,
        password: str = settings.SFTP_PASSWORD,
        host: str = settings.SFTP_HOST,
        port: int = settings.SFTP_PORT,
        pk_path: str = settings.SFTP_PRIVATE_KEY_PATH,
    ) -> None:
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.transport: paramiko.Transport = None
        self.sftp_client = None

        self.private_key = None
        if pk_path:
            self.private_key = paramiko.pkey.PKey.from_path(pk_path)

    def __enter__(self: Self) -> Self:
        self.connect()
        return self

    def __exit__(
        self: Self,
        exc_type: type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: types.TracebackType | None,
    ) -> None:
        self.disconnect()

    def connect(self: Self) -> None:
        """
        Establish the connection to the SFTP server.
        """
        self.transport = paramiko.Transport((self.host, self.port))
        if self.private_key:
            self.transport.connect(username=self.username, pkey=self.private_key)
        else:
            self.transport.connect(username=self.username, password=self.password)
        self.sftp_client = paramiko.SFTPClient.from_transport(self.transport)

    def disconnect(self: Self) -> None:
        """
        Close the connection to the SFTP server.
        """
        if self.sftp_client:
            self.sftp_client.close()
        if self.transport:
            self.transport.close()

    def list_files(self: Self, folder_name: str = "") -> list[str]:
        """
        Lists files in the specified folder.
        if folder_name is empty, list all files in the root directory.
        """
        if self.sftp_client is None:
            raise AttributeError

        folder_name = folder_name or "."
        return self.sftp_client.listdir(folder_name)

    def upload(self: Self, local_path: str, remote_path: str) -> None:
        """
        Upload a file or directory to the SFTP server.
        """
        if self.sftp_client is None:
            raise AttributeError

        local_path_transformed = Path(local_path)
        if not local_path_transformed.exists():
            raise FileNotFoundError

        if local_path_transformed.is_file():
            self.sftp_client.put(str(local_path_transformed), remote_path)
        elif local_path_transformed.is_dir():
            for root, _, files in os.walk(local_path_transformed):
                remote_dir = str(
                    Path(remote_path) / Path(root).relative_to(local_path_transformed),
                )
                self.verify_remote_existence(remote_dir, create_dir_if_not_exist=True)
                for file in files:
                    self.sftp_client.put(
                        str(Path(root) / file),
                        str(Path(remote_dir) / file),
                    )

        logger.info(
            f"{local_path_transformed.name} Uploaded to SFTP",
        )

    def download(self: Self, remote_path: str, local_path: str) -> None:
        """
        Download a file or directory from the SFTP server.
        """
        if not self.verify_remote_existence(remote_path):
            raise FileNotFoundError

        if self.sftp_client is None:
            raise AttributeError

        local_path_transformed = Path(local_path)
        if not local_path_transformed.exists():
            if self._certify_remote_is_dir(remote_path):
                local_path_transformed.mkdir(parents=True, exist_ok=True)
            else:
                local_path_transformed.parent.mkdir(parents=True, exist_ok=True)

        if self._certify_remote_is_dir(remote_path):
            for item in self.sftp_client.listdir_attr(remote_path):
                self.download(
                    str(Path(remote_path) / item.filename),
                    str(local_path_transformed / item.filename),
                )
        else:
            self.sftp_client.get(remote_path, str(local_path_transformed))

        logger.info(
            f"{Path(remote_path).name} Downloaded from SFTP",
        )

    def _certify_remote_is_dir(self: Self, remote_path: str) -> bool:
        """
        check if a remote target is a directory
        """
        if self.sftp_client is None:
            raise AttributeError

        attr = self.sftp_client.stat(remote_path)
        return attr.st_mode & 0o40000

    def verify_remote_existence(
        self: Self,
        remote_path: str,
        create_dir_if_not_exist: bool = False,
    ) -> bool:
        """
        Verify if a file or a directory exists in the SFTP server.
        """
        if self.sftp_client is None:
            raise AttributeError

        try:
            self.sftp_client.stat(remote_path)
        except FileNotFoundError:
            if create_dir_if_not_exist:
                self.sftp_client.mkdir(remote_path)
            return False
        return True

    def delete(self: Self, remote_path: str) -> None:
        """
        Delete a file or a directory from the SFTP server.
        """
        if self.sftp_client is None:
            raise AttributeError

        if self.verify_remote_existence(remote_path):
            if self._certify_remote_is_dir(remote_path):
                for item in self.sftp_client.listdir_attr(remote_path):
                    self.delete(
                        str(Path(remote_path) / item.filename),
                    )
                self.sftp_client.rmdir(remote_path)
            else:
                self.sftp_client.remove(remote_path)
            logger.info(f"Deleted {remote_path} from SFTP")

        else:
            raise FileNotFoundError
