"""
backend/app/security/permissions.py

Role-based access control (RBAC) and permission checking.
"""

from enum import Enum
from typing import Optional


class Permission(str, Enum):
    """Application permissions."""
    READ = "read"
    WRITE = "write"
    DELETE = "delete"
    ADMIN = "admin"


class RolePermissions:
    """Maps roles to their allowed permissions."""
    
    PERMISSIONS = {
        "superuser": {Permission.READ, Permission.WRITE, Permission.DELETE, Permission.ADMIN},
        "admin": {Permission.READ, Permission.WRITE, Permission.DELETE},
        "reviewer": {Permission.READ, Permission.WRITE},
        "annotator": {Permission.READ, Permission.WRITE},
    }
    
    @classmethod
    def has_permission(cls, role: str, permission: Permission) -> bool:
        """Check if a role has a specific permission."""
        permissions = cls.PERMISSIONS.get(role.lower(), set())
        return permission in permissions
    
    @classmethod
    def can_admin(cls, role: str) -> bool:
        """Check if a role can perform admin operations."""
        return cls.has_permission(role, Permission.ADMIN)
    
    @classmethod
    def can_write(cls, role: str) -> bool:
        """Check if a role can write/edit."""
        return cls.has_permission(role, Permission.WRITE)
    
    @classmethod
    def can_read(cls, role: str) -> bool:
        """Check if a role can read."""
        return cls.has_permission(role, Permission.READ)
