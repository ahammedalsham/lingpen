"""
backend/app/security/auth.py

JWT token generation, verification, and password hashing utilities.
"""

from datetime import datetime, timedelta

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a JWT access token.

    Args:
        data: Dictionary to encode in the token
        expires_delta: Optional expiration time (defaults to configured value)

    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=settings.jwt_expiration_hours)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)

    return encoded_jwt


def verify_token(token: str) -> dict | None:
    """
    Verify and decode a JWT token.

    Args:
        token: JWT token string

    Returns:
        Decoded token data or None if verification fails
    """
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        return None
