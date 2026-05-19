"""
backend/app/api/v1/users.py

User management endpoints: get profile, update profile, delete account.
"""

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.security.permissions import get_current_user
from app.schemas.user import UserResponse, UserUpdate
from app.services import get_user_by_id, update_user, delete_user
from app.models import User
from app.logging_config import logger

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get user profile"
)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """
    Get user profile by ID.
    
    **Parameters:**
    - `user_id`: User ID
    
    **Returns:**
    - User object with all public profile information
    """
    user = await get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile"
)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
) -> UserResponse:
    """
    Get the current authenticated user's profile.
    
    **Returns:**
    - Current user object with profile information
    """
    return current_user


@router.put(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update user profile"
)
async def update_user_profile(
    user_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """
    Update user profile (display name, institution).
    
    **Parameters:**
    - `user_id`: User ID to update
    
    **Request:**
    - `display_name`: Optional new display name
    - `institution`: Optional new institution
    
    **Returns:**
    - Updated user object
    
    **Note:** Users can only update their own profile
    """
    # Check authorization
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only update your own profile"
        )
    
    try:
        updated_user = await update_user(
            db,
            user_id,
            display_name=user_update.display_name,
            institution=user_update.institution
        )
        logger.info(f"✅ User profile updated: {updated_user.email}")
        return updated_user
    except Exception as e:
        logger.error(f"❌ Error updating user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user account"
)
async def delete_user_account(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> None:
    """
    Delete (deactivate) user account.
    
    **Parameters:**
    - `user_id`: User ID to delete
    
    **Note:** 
    - Users can only delete their own account
    - This performs a soft delete (marks as inactive)
    """
    # Check authorization
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only delete your own account"
        )
    
    try:
        await delete_user(db, user_id)
        logger.info(f"✅ User account deleted: {current_user.email}")
    except Exception as e:
        logger.error(f"❌ Error deleting user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
