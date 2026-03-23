from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from enum import Enum


class ProjectTypeEnum(str, Enum):
    movie_analysis = "movie_analysis"
    series_analysis = "series_analysis"
    documentary = "documentary"
    essay = "essay"
    theory = "theory"
    reaction = "reaction"


class NarrativeModeEnum(str, Enum):
    padrao = "padrao"
    retencao_maxima = "retencao_maxima"
    investigativo = "investigativo"
    psicologico = "psicologico"
    filosofico = "filosofico"
    analise_poder = "analise_poder"
    teoria = "teoria"
    explicado_simples = "explicado_simples"
    autoridade = "autoridade"


class AudienceAwarenessLevelEnum(str, Enum):
    unaware = "unaware"
    problem_aware = "problem_aware"
    solution_aware = "solution_aware"
    product_aware = "product_aware"


class ProjectStatusEnum(str, Enum):
    draft = "draft"
    writing = "writing"
    editing = "editing"
    producing = "producing"
    exported = "exported"


class ProjectSourceCreate(BaseModel):
    """Schema para criar fonte de projeto"""

    source_type: str
    external_id: Optional[str] = None
    title: Optional[str] = None
    url: Optional[str] = None
    metadata_json: Optional[dict] = None


class ProjectSourceResponse(BaseModel):
    """Schema para resposta de fonte de projeto"""

    id: UUID
    project_id: UUID
    source_type: str
    external_id: Optional[str] = None
    title: Optional[str] = None
    url: Optional[str] = None
    metadata_json: Optional[dict] = None

    class Config:
        from_attributes = True


class ProjectCreate(BaseModel):
    """Schema para criar novo projeto"""

    title: str
    project_type: ProjectTypeEnum
    source_title: Optional[str] = None
    source_year: Optional[int] = None
    synopsis: Optional[str] = None
    notes: Optional[str] = None
    output_language: str = "pt-BR"
    target_duration_minutes: int = 15
    narrative_mode: NarrativeModeEnum = NarrativeModeEnum.padrao
    audience_awareness_level: AudienceAwarenessLevelEnum = (
        AudienceAwarenessLevelEnum.unaware
    )
    visual_preset_id: Optional[UUID] = None


class ProjectUpdate(BaseModel):
    """Schema para atualizar projeto"""

    title: Optional[str] = None
    synopsis: Optional[str] = None
    notes: Optional[str] = None
    narrative_mode: Optional[NarrativeModeEnum] = None
    audience_awareness_level: Optional[AudienceAwarenessLevelEnum] = None
    status: Optional[ProjectStatusEnum] = None
    visual_preset_id: Optional[UUID] = None


class ProjectResponse(BaseModel):
    """Schema para resposta de projeto"""

    id: UUID
    user_id: UUID
    title: str
    project_type: str
    source_title: Optional[str] = None
    source_year: Optional[int] = None
    synopsis: Optional[str] = None
    notes: Optional[str] = None
    output_language: str
    target_duration_minutes: int
    narrative_mode: str
    audience_awareness_level: str
    visual_preset_id: Optional[UUID] = None
    status: str
    created_at: datetime
    updated_at: datetime
    sources: List[ProjectSourceResponse] = []

    class Config:
        from_attributes = True
