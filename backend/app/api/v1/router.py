"""
backend/app/api/v1/router.py

Aggregate all v1 API routers into a single router.
"""

from fastapi import APIRouter

from app.api.v1 import health

# Create main v1 router
router = APIRouter(prefix="/api/v1")

# Include sub-routers
router.include_router(health.router)

# Add more routers here as they are created:
# router.include_router(auth.router)
# router.include_router(users.router)
# router.include_router(treebanks.router)

__all__ = ["router"]
