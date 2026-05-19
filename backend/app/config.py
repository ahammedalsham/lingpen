"""
backend/app/config.py

Centralized configuration management using Pydantic Settings.
All environment variables are validated on app startup.
"""

import os
from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    database_url: str = os.getenv(
        "DATABASE_URL", "postgresql+asyncpg://lingpen:changeme@localhost:5432/lingpen"
    )

    # Environment
    environment: str = os.getenv("ENVIRONMENT", "development")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"

    # CORS
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ]

    # Security
    jwt_secret: str = os.getenv("JWT_SECRET", "dev-secret-key-change-in-production")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_expiration_hours: int = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))

    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "INFO")

    # Features
    enable_docs: bool = os.getenv("ENABLE_DOCS", "true").lower() == "true"

    class Config:
        env_file = ".env"
        case_sensitive = False

    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.environment.lower() == "production"

    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.environment.lower() == "development"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
