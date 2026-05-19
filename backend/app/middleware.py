"""
backend/app/middleware.py

Global middleware for CORS, error handling, request logging, etc.
"""

import logging
import uuid

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings
from app.exceptions import APIException

logger = logging.getLogger(__name__)


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Add a unique request ID to each request for tracing."""

    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id

        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response


class LoggingMiddleware(BaseHTTPMiddleware):
    """Log all incoming requests and outgoing responses."""

    async def dispatch(self, request: Request, call_next):
        request_id = getattr(request.state, "request_id", "unknown")

        logger.info(
            f"[{request_id}] {request.method} {request.url.path} - "
            f"Client: {request.client.host if request.client else 'unknown'}"
        )

        response = await call_next(request)

        logger.info(
            f"[{request_id}] Response: {response.status_code} - "
            f"{request.method} {request.url.path}"
        )

        return response


def setup_middleware(app: FastAPI):
    """Register all middleware with the FastAPI app."""

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add custom middleware
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(RequestIDMiddleware)


def setup_exception_handlers(app: FastAPI):
    """Register global exception handlers."""

    @app.exception_handler(APIException)
    async def api_exception_handler(request: Request, exc: APIException):
        request_id = getattr(request.state, "request_id", "unknown")

        logger.error(f"[{request_id}] API Exception: {exc.error_code} - {exc.message}")

        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.error_code,
                "message": exc.message,
                "details": exc.details,
                "request_id": request_id,
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        request_id = getattr(request.state, "request_id", "unknown")

        logger.error(f"[{request_id}] Unhandled exception: {str(exc)}", exc_info=True)

        # Don't expose internal errors in production
        if settings.is_production():
            message = "Internal server error"
        else:
            message = str(exc)

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "INTERNAL_ERROR",
                "message": message,
                "request_id": request_id,
            },
        )
