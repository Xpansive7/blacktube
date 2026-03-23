from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from enum import Enum


class VoiceStatusEnum(str, Enum):
    pending = "pending"
    generating = "generating"
    ready = "ready"
    error = "error"


class VoiceSegmentCreate(BaseModel):
    """Schema para criar segmento de voz"""

    text: str
    voice_model: str = "mock"
    duration_seconds: Optional[float] = None


class VoiceSegmentUpdate(BaseModel):
    """Schema para atualizar segmento de voz"""

    text: Optional[str] = None
    audio_path: Optional[str] = None
    duration_seconds: Optional[float] = None
    voice_model: Optional[str] = None
    status: Optional[VoiceStatusEnum] = None


class VoiceSegmentResponse(BaseModel):
    """Schema para resposta de segmento de voz"""

    id: UUID
    project_id: UUID
    chapter_id: UUID
    text: str
    audio_path: Optional[str] = None
    duration_seconds: Optional[float] = None
    voice_model: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
