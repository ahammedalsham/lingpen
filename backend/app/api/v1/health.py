"""
backend/app/api/v1/health.py

Health check endpoint for monitoring and deployment.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.common import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health_check(db: AsyncSession = Depends(get_db)) -> HealthResponse:
    """
    Health check endpoint.

    Returns 200 if the API is up and the database is reachable.
    Used by CI and deployment scripts for monitoring.
    """
    db_status = "ok"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    overall_status = "ok" if db_status == "ok" else "degraded"

    return HealthResponse(
        status=overall_status,
        database=db_status,
        message="API is operational" if overall_status == "ok" else "API is degraded",
    )
