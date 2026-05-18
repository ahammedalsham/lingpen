"""
backend/tests/unit/test_auth.py

Unit tests for authentication and security functions.
"""

import pytest
from app.security.auth import hash_password, verify_password, create_access_token, verify_token


def test_hash_password():
    """Test password hashing."""
    password = "test_password_123"
    hashed = hash_password(password)
    
    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("wrong_password", hashed)


def test_create_and_verify_token():
    """Test JWT token creation and verification."""
    data = {"user_id": 1, "email": "test@example.com"}
    token = create_access_token(data)
    
    assert token
    assert isinstance(token, str)
    
    decoded = verify_token(token)
    assert decoded
    assert decoded.get("user_id") == 1
    assert decoded.get("email") == "test@example.com"


def test_verify_invalid_token():
    """Test that invalid tokens return None."""
    decoded = verify_token("invalid.token.here")
    assert decoded is None
