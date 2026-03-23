from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Configurações da aplicação BlackTube"""

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

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Retorna instância única de Settings (singleton)"""
    return Settings()
