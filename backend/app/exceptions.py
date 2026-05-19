"""
backend/app/exceptions.py

Custom exception classes for the application.
These are mapped to HTTP responses by the global exception handler.
"""

from typing import Any

from fastapi import status


class APIException(Exception):
    """Base exception for all API errors."""

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        error_code: str | None = None,
        details: dict[str, Any] | None = None,
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or "INTERNAL_ERROR"
        self.details = details or {}
        super().__init__(self.message)


class ValidationException(APIException):
    """Raised when request validation fails."""

    def __init__(self, message: str, details: dict[str, Any] | None = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="VALIDATION_ERROR",
            details=details,
        )


class AuthenticationException(APIException):
    """Raised when authentication fails."""

    def __init__(self, message: str = "Authentication failed"):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="AUTHENTICATION_ERROR",
        )


class AuthorizationException(APIException):
    """Raised when user lacks permissions."""

    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="AUTHORIZATION_ERROR",
        )


class NotFound(APIException):
    """Raised when resource is not found."""

    def __init__(self, resource: str, resource_id: Any | None = None):
        message = f"{resource} not found"
        if resource_id:
            message = f"{resource} with id {resource_id} not found"
        super().__init__(
            message=message,
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="NOT_FOUND",
        )


class ConflictException(APIException):
    """Raised when resource already exists or conflicts with existing data."""

    def __init__(self, message: str, details: dict[str, Any] | None = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_409_CONFLICT,
            error_code="CONFLICT",
            details=details,
        )


class DatabaseException(APIException):
    """Raised when database operation fails."""

    def __init__(self, message: str = "Database operation failed"):
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="DATABASE_ERROR",
        )
