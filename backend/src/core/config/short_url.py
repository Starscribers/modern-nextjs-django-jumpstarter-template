from __future__ import annotations

from pydantic_settings import BaseSettings


class ShortUrlSettings(BaseSettings):
    PROXY_SHORT_URL: str = "bsms.tw/XDWhqg"
    ENABLE_PROXY_SHORT_URL: bool = (
        False  # will circumvent short url services if enabled
    )
