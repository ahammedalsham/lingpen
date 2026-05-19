"""
backend/init_db.py

Initialize database tables by creating all tables defined in models.
Run this once during development: python init_db.py (from backend directory)
"""

import asyncio
import os
import sys

# Add current directory to path for app imports
sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import engine
from app.logging_config import logger
from app.models import Base


async def init_db():
    """Create all database tables."""
    try:
        logger.info("🔨 Creating database tables...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("✅ Database tables created successfully!")
    except Exception as e:
        logger.error(f"❌ Error creating tables: {str(e)}")
        raise
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(init_db())
