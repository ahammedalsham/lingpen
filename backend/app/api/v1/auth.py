"""
backend/app/api/v1/auth.py

Authentication endpoints: register, login, refresh token.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.logging_config import logger
from app.schemas.user import LoginRequest, TokenResponse, UserCreate
from app.security.auth import create_access_token
from app.services import (
    authenticate_user,
    create_user,
)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(user_create: UserCreate, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    """
    Register a new user account.

    **Request:**
    - `username`: Username (3-64 characters)
    - `email`: Email address
    - `password`: Password (minimum 8 characters)
    - `display_name`: Optional display name
    - `institution`: Optional institution name

    **Returns:**
    - `access_token`: JWT token for authentication
    - `token_type`: Token type (bearer)
    - `user`: User object with profile information
    """
    try:
        user = await create_user(db, user_create)
        access_token = create_access_token(data={"sub": str(user.id)})

        logger.info(f"✅ User registered: {user.email}")

        return TokenResponse(access_token=access_token, user=user)
    except Exception as e:
        logger.error(f"❌ Registration error for {user_create.email}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


@router.post("/login", response_model=TokenResponse, summary="Login user")
async def login(credentials: LoginRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    """
    Login with email and password.

    **Request:**
    - `email`: User email
    - `password`: User password

    **Returns:**
    - `access_token`: JWT token for authentication
    - `token_type`: Token type (bearer)
    - `user`: User object with profile information
    """
    user = await authenticate_user(db, email=credentials.email, password=credentials.password)

    if not user:
        logger.warning(f"⚠️  Failed login attempt for {credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    access_token = create_access_token(data={"sub": str(user.id)})

    logger.info(f"✅ User logged in: {user.email}")

    return TokenResponse(access_token=access_token, user=user)
