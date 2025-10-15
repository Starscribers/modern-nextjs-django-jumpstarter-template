from __future__ import annotations

from pydantic import BaseModel
from pydantic_settings import BaseSettings


class NotificationLevelConfig(BaseModel):
    BACKEND: str
    CHANNEL: str | None = None


class NotificationSettings(BaseSettings):
    MUTE_SYSTEM_NOTIFICATION: bool = False
    INFO_NOTIFICATION_BACKENDS: list[NotificationLevelConfig] = [
        NotificationLevelConfig(BACKEND="console"),
    ]
    WARNING_NOTIFICATION_BACKENDS: list[NotificationLevelConfig] = [
        NotificationLevelConfig(BACKEND="console"),
    ]
    ERROR_NOTIFICATION_BACKENDS: list[NotificationLevelConfig] = [
        NotificationLevelConfig(BACKEND="console"),
    ]

    NOTIFICATION_EMAIL_FROM_EMAIL: str = "notify@starcofeel.com"
    NOTIFICATION_EMAIL_TO_EMAIL: list[str] = ["op@starcofeel.com"]
