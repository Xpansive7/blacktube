from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    """Schema para criar novo usuário"""

    email: EmailStr
    username: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "lucas@xpansive.com",
                "username": "lucas",
                "password": "password123",
            }
        }


class UserLogin(BaseModel):
    """Schema para login"""

    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "lucas@xpansive.com",
                "password": "password123",
            }
        }


class UserResponse(BaseModel):
    """Schema para resposta de usuário"""

    id: UUID
    email: str
    username: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "lucas@xpansive.com",
                "username": "lucas",
                "created_at": "2024-03-20T10:00:00",
                "updated_at": "2024-03-20T10:00:00",
            }
        }


class TokenResponse(BaseModel):
    """Schema para resposta de token"""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "id": "550e8400-e29b-41d4-a716-446655440000",
                    "email": "lucas@xpansive.com",
                    "username": "lucas",
                    "created_at": "2024-03-20T10:00:00",
                    "updated_at": "2024-03-20T10:00:00",
                },
            }
        }
