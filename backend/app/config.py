from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings for BlackTube."""

    # Database
    database_url: str = "sqlite:///./blacktube.db"

    # JWT
    secret_key: str = "dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # APIs
    tmdb_api_key: str = ""
    youtube_api_key: str = ""
    pexels_api_key: str = ""
    openai_api_key: str = ""
    elevenlabs_api_key: str = ""

    # Application
    debug: bool = True
    app_name: str = "BlackTube"
    app_version: str = "0.1.0"
    cors_allow_origins: str = "*"
    seed_demo_data: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Return a cached settings instance."""
    return Settings()

