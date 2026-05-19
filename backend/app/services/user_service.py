"""
backend/app/services/user_service.py

Business logic for user management operations.
"""

from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User
from app.schemas.user import UserCreate
from app.security.auth import hash_password, verify_password
from app.exceptions import ValidationException, NotFound


async def create_user(db: AsyncSession, user_create: UserCreate) -> User:
    """
    Create a new user.
    
    Args:
        db: Database session
        user_create: User creation schema
        
    Returns:
        Created user object
        
    Raises:
        ValidationException: If username or email already exists
    """
    # Check if user already exists
    existing = await db.execute(
        select(User).where(
            (User.email == user_create.email) |
            (User.username == user_create.username)
        )
    )
    if existing.scalar_one_or_none():
        raise ValidationException(
            "User with this email or username already exists"
        )
    
    # Create new user
    user = User(
        username=user_create.username,
        email=user_create.email,
        password_hash=hash_password(user_create.password),
        display_name=user_create.display_name,
        institution=user_create.institution,
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return user


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    """Get user by email."""
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_username(db: AsyncSession, username: str) -> Optional[User]:
    """Get user by username."""
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
    """Get user by ID."""
    return await db.get(User, user_id)


async def authenticate_user(
    db: AsyncSession,
    email: str,
    password: str
) -> Optional[User]:
    """
    Authenticate user by email and password.
    
    Returns:
        User object if authentication succeeds, None otherwise
    """
    user = await get_user_by_email(db, email)
    
    if not user or not user.is_active:
        return None
    
    if not verify_password(password, user.password_hash):
        return None
    
    return user


async def update_user(
    db: AsyncSession,
    user_id: int,
    display_name: Optional[str] = None,
    institution: Optional[str] = None
) -> User:
    """Update user profile information."""
    user = await get_user_by_id(db, user_id)
    
    if not user:
        raise NotFound("User", user_id)
    
    if display_name is not None:
        user.display_name = display_name
    if institution is not None:
        user.institution = institution
    
    await db.commit()
    await db.refresh(user)
    
    return user


async def delete_user(db: AsyncSession, user_id: int) -> bool:
    """Soft delete a user by marking as inactive."""
    user = await get_user_by_id(db, user_id)
    
    if not user:
        raise NotFound("User", user_id)
    
    user.is_active = False
    await db.commit()
    
    return True
