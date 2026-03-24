from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from enum import Enum


class AssetTypeEnum(str, Enum):
    image = "image"
    video = "video"
    overlay = "overlay"
    transition = "transition"


class AssetSourceEnum(str, Enum):
    pexels = "pexels"
    upload = "upload"
    ai_generated = "ai_generated"
    placeholder = "placeholder"


class AssetCreate(BaseModel):
    """Schema para criar asset"""

    asset_type: AssetTypeEnum
    source: AssetSourceEnum
    file_path: Optional[str] = None
    url: Optional[str] = None
    prompt_used: Optional[str] = None
    duration_seconds: Optional[float] = None
    metadata_json: Optional[dict] = None
    chapter_id: Optional[UUID] = None


class AssetUpdate(BaseModel):
    """Schema para atualizar asset"""

    chapter_id: Optional[UUID] = None
    file_path: Optional[str] = None
    url: Optional[str] = None
    prompt_used: Optional[str] = None
    duration_seconds: Optional[float] = None
    metadata_json: Optional[dict] = None


class AssetResponse(BaseModel):
    """Schema para resposta de asset"""

    id: UUID
    project_id: UUID
    chapter_id: Optional[UUID] = None
    asset_type: str
    source: str
    file_path: Optional[str] = None
    url: Optional[str] = None
    prompt_used: Optional[str] = None
    duration_seconds: Optional[float] = None
    metadata_json: Optional[dict] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
