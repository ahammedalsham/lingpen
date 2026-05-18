"""
backend/app/schemas/common.py

Shared response schemas and utilities used across all endpoints.
"""

from typing import Optional, Any, Generic, TypeVar, List
from pydantic import BaseModel

T = TypeVar('T')


class ErrorResponse(BaseModel):
    """Standard error response format."""
    error: str
    message: str
    request_id: Optional[str] = None
    details: Optional[dict] = None


class PaginationParams(BaseModel):
    """Pagination parameters for list endpoints."""
    skip: int = 0
    limit: int = 50

    class Config:
        json_schema_extra = {
            "example": {
                "skip": 0,
                "limit": 50
            }
        }


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response wrapper."""
    total: int
    skip: int
    limit: int
    items: List[T]


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    database: str
    message: Optional[str] = None
