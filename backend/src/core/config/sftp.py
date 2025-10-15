from __future__ import annotations

from pydantic_settings import BaseSettings


class SftpSettings(BaseSettings):
    SFTP_USERNAME: str = "foo"
    SFTP_PASSWORD: str = "pass"  # noqa: S105
    SFTP_HOST: str = "localhost"
    SFTP_EDM_PATH: str = "/edm"
    SFTP_PORT: int = 2222
