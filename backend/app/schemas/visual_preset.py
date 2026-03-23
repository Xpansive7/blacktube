from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class VisualPresetCreate(BaseModel):
    """Schema para criar preset visual"""

    name: str
    style: Optional[str] = None
    lighting: Optional[str] = None
    color_palette: Optional[str] = None
    contrast: Optional[str] = None
    texture: Optional[str] = None
    composition: Optional[str] = None
    dramatic_intensity: int = 5
    motion_style: Optional[str] = None
    prompt_base: Optional[str] = None
    is_default: bool = False


class VisualPresetUpdate(BaseModel):
    """Schema para atualizar preset visual"""

    name: Optional[str] = None
    style: Optional[str] = None
    lighting: Optional[str] = None
    color_palette: Optional[str] = None
    contrast: Optional[str] = None
    texture: Optional[str] = None
    composition: Optional[str] = None
    dramatic_intensity: Optional[int] = None
    motion_style: Optional[str] = None
    prompt_base: Optional[str] = None
    is_default: Optional[bool] = None


class VisualPresetResponse(BaseModel):
    """Schema para resposta de preset visual"""

    id: UUID
    user_id: Optional[UUID] = None
    name: str
    style: Optional[str] = None
    lighting: Optional[str] = None
    color_palette: Optional[str] = None
    contrast: Optional[str] = None
    texture: Optional[str] = None
    composition: Optional[str] = None
    dramatic_intensity: int
    motion_style: Optional[str] = None
    prompt_base: Optional[str] = None
    is_default: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
