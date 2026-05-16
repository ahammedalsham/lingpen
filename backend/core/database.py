"""
backend/core/database.py

Async SQLAlchemy engine, session factory, and FastAPI dependency.

Usage in a FastAPI route
────────────────────────
    from core.database import get_db
    from sqlalchemy.ext.asyncio import AsyncSession

    @router.get("/sentences/{id}")
    async def get_sentence(id: int, db: AsyncSession = Depends(get_db)):
        result = await db.execute(select(Sentence).where(Sentence.id == id))
        return result.scalar_one_or_none()

Bulk inserts (tokens on CoNLL-U upload)
────────────────────────────────────────
    Use db.execute(insert(Token), rows) for bulk ops — 10-100x faster
    than individual db.add() calls for large files.

    async with db.begin():
        await db.execute(insert(Token), token_dicts)
"""

import os
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

DATABASE_URL = os.environ["DATABASE_URL"]
# Must be postgresql+asyncpg://  (not postgresql://)
# Example: postgresql+asyncpg://lingpen:2430@localhost:5432/lingpen

engine = create_async_engine(
    DATABASE_URL,
    # Pool sizing for a single Hetzner CX21 (Phase 1-2)
    # Postgres default max_connections = 100; leave headroom for migrations/psql
    pool_size=10,
    max_overflow=5,
    pool_timeout=30,
    pool_recycle=1800,   # recycle connections every 30 min (avoid stale conn issues)
    echo=os.environ.get("ENVIRONMENT") == "development",  # SQL logging in dev only
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,  # objects remain usable after commit (important for async)
    autoflush=False,         # flush explicitly; prevents surprise queries mid-request
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields one AsyncSession per request.

    The session is committed on success and rolled back on any exception.
    Always use as a dependency — never instantiate AsyncSessionLocal directly
    in route handlers.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
