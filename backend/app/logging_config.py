"""
backend/app/logging_config.py

Centralized logging configuration for the application.
Sets up structured logging with appropriate handlers and formatters.
"""

import logging
import logging.handlers
import sys
from pathlib import Path

from app.config import settings

LOG_DIR = Path(__file__).parent.parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)


def setup_logging():
    """Configure logging for the application."""

    log_level = getattr(logging, settings.log_level.upper(), logging.INFO)

    # Create formatter
    formatter = logging.Formatter(
        fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)

    # File handler (for production/development)
    if settings.is_production() or settings.debug:
        file_handler = logging.handlers.RotatingFileHandler(
            filename=LOG_DIR / "app.log",
            maxBytes=10_000_000,  # 10MB
            backupCount=5,
        )
        file_handler.setLevel(log_level)
        file_handler.setFormatter(formatter)
        root_logger.addHandler(file_handler)

    # Silence some verbose libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

    return root_logger


logger = setup_logging()
