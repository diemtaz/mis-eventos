from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:4200",
        "http://127.0.0.1:4200"
    ]
    database_url: str
    test_database_url: str
    environment: str = "development"
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )


settings = Settings()
