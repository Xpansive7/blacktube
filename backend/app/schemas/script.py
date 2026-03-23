from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from enum import Enum


class ChapterTypeEnum(str, Enum):
    hook = "hook"
    intro = "intro"
    development = "development"
    climax = "climax"
    resolution = "resolution"
    conclusion = "conclusion"
    cta = "cta"


class ScriptChapterCreate(BaseModel):
    """Schema para criar capítulo de script"""

    chapter_number: int
    title: str
    chapter_type: ChapterTypeEnum
    content: str
    duration_seconds: Optional[int] = None
    emotional_intensity: int = 5
    retention_notes: Optional[str] = None


class ScriptChapterUpdate(BaseModel):
    """Schema para atualizar capítulo de script"""

    title: Optional[str] = None
    content: Optional[str] = None
    duration_seconds: Optional[int] = None
    emotional_intensity: Optional[int] = None
    retention_notes: Optional[str] = None


class ScriptChapterResponse(BaseModel):
    """Schema para resposta de capítulo de script"""

    id: UUID
    project_id: UUID
    chapter_number: int
    title: str
    chapter_type: str
    content: str
    duration_seconds: Optional[int] = None
    emotional_intensity: int
    retention_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
