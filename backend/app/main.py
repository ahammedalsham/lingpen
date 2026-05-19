"""
backend/app/main.py

FastAPI application entry point with middleware and route setup.
"""

from fastapi import FastAPI

from app.api.v1 import router as api_v1_router
from app.config import settings
from app.logging_config import logger
from app.middleware import setup_exception_handlers, setup_middleware

# Create FastAPI application
app = FastAPI(
    title="LingPen API",
    description="Linguistic annotation and treebank management system",
    version="0.1.0",
    docs_url="/api/docs" if settings.enable_docs else None,
    redoc_url="/api/redoc" if settings.enable_docs else None,
    openapi_url="/api/openapi.json" if settings.enable_docs else None,
)

# Setup middleware
setup_middleware(app)
setup_exception_handlers(app)

# Include API routes
app.include_router(api_v1_router.router)


@app.on_event("startup")
async def startup_event():
    """Initialize app on startup."""
    logger.info(
        f"🚀 LingPen API starting in {settings.environment} mode " f"(debug={settings.debug})"
    )


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info("🛑 LingPen API shutting down")


@app.get("/", tags=["root"])
def read_root():
    """Root endpoint."""
    return {
        "message": "Welcome to the LingPen API",
        "version": "0.1.0",
        "docs": "/api/docs" if settings.enable_docs else None,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )
