from pydantic_settings import BaseSettings


class FrontendRedirectSettings(BaseSettings):
    FRONTEND_URL: str = "http://localhost:5173"
