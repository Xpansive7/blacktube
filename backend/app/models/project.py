from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.models.base import Base, GUID


class ProjectTypeEnum(str, enum.Enum):
    """Tipos de projeto"""

    movie_analysis = "movie_analysis"
    series_analysis = "series_analysis"
    documentary = "documentary"
    essay = "essay"
    theory = "theory"
    reaction = "reaction"


class NarrativeModeEnum(str, enum.Enum):
    """Modos de narrativa do BlackTube"""

    padrao = "padrao"
    retencao_maxima = "retencao_maxima"
    investigativo = "investigativo"
    psicologico = "psicologico"
    filosofico = "filosofico"
    analise_poder = "analise_poder"
    teoria = "teoria"
    explicado_simples = "explicado_simples"
    autoridade = "autoridade"


class AudienceAwarenessLevelEnum(str, enum.Enum):
    """Níveis de consciência do público (Schwartz)"""

    unaware = "unaware"
    problem_aware = "problem_aware"
    solution_aware = "solution_aware"
    product_aware = "product_aware"


class ProjectStatusEnum(str, enum.Enum):
    """Status do projeto"""

    draft = "draft"
    writing = "writing"
    editing = "editing"
    producing = "producing"
    exported = "exported"


class Project(Base):
    """Modelo de projeto do BlackTube"""

    __tablename__ = "projects"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    project_type = Column(Enum(ProjectTypeEnum), nullable=False)
    source_title = Column(String(255), nullable=True)
    source_year = Column(Integer, nullable=True)
    synopsis = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    output_language = Column(String(10), default="pt-BR")
    target_duration_minutes = Column(Integer, default=15)
    narrative_mode = Column(Enum(NarrativeModeEnum), default=NarrativeModeEnum.padrao)
    audience_awareness_level = Column(
        Enum(AudienceAwarenessLevelEnum), default=AudienceAwarenessLevelEnum.unaware
    )
    visual_preset_id = Column(GUID(), ForeignKey("visual_presets.id"), nullable=True)
    status = Column(Enum(ProjectStatusEnum), default=ProjectStatusEnum.draft)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="projects")
    visual_preset = relationship("VisualPreset", back_populates="projects")
    sources = relationship(
        "ProjectSource", back_populates="project", cascade="all, delete-orphan"
    )
    chapters = relationship(
        "ScriptChapter", back_populates="project", cascade="all, delete-orphan"
    )
    assets = relationship("Asset", back_populates="project", cascade="all, delete-orphan")
    voice_segments = relationship(
        "VoiceSegment", back_populates="project", cascade="all, delete-orphan"
    )
    export_jobs = relationship(
        "ExportJob", back_populates="project", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Project(id={self.id}, title={self.title}, type={self.project_type})>"


class SourceTypeEnum(str, enum.Enum):
    """Tipos de fonte"""

    tmdb = "tmdb"
    youtube = "youtube"
    manual = "manual"


class ProjectSource(Base):
    """Modelo de fonte de projeto"""

    __tablename__ = "project_sources"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    project_id = Column(GUID(), ForeignKey("projects.id"), nullable=False)
    source_type = Column(Enum(SourceTypeEnum), nullable=False)
    external_id = Column(String(255), nullable=True)
    title = Column(String(255), nullable=True)
    url = Column(String(500), nullable=True)
    metadata_json = Column(JSON, nullable=True)

    # Relationships
    project = relationship("Project", back_populates="sources")

    def __repr__(self):
        return f"<ProjectSource(id={self.id}, type={self.source_type})>"
