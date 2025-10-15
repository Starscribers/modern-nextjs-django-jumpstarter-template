from pydantic_settings import BaseSettings


class MessagingSettings(BaseSettings):
    ENABLE_SYSTEM_EMAIL: bool = True
    ENABLE_NOTIFICATION_EMAIL: bool = True

    BYPASS_CLEAN_SEGMENT: bool = True
