"""
backend/app/schemas/user.py

Request/response schemas for user-related endpoints.
"""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema shared between request and response."""

    username: str = Field(..., min_length=3, max_length=64)
    email: EmailStr
    display_name: str | None = Field(None, max_length=128)
    institution: str | None = Field(None, max_length=256)


class UserCreate(UserBase):
    """Request schema for user registration."""

    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """Request schema for updating user profile."""

    display_name: str | None = None
    institution: str | None = None


class UserResponse(UserBase):
    """Response schema for user endpoints."""

    id: int
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    """Request schema for login endpoint."""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Response schema for authentication endpoints."""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse
