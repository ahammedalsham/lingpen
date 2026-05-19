"""
backend/api/health.py
Minimal health check endpoint used by CI and the Hetzner deploy script.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db

router = APIRouter()


@router.get("/api/health")
async def health(db: AsyncSession = Depends(get_db)):
    """
    Returns 200 if the API is up and the database is reachable.
    The deploy script polls this after container restart.
    """
    try:
        await db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as e:
        db_status = f"error: {e}"

    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "database": db_status,
    }
