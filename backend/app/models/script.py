from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.models.base import Base, GUID


class ChapterTypeEnum(str, enum.Enum):
    """Tipos de capítulo de script"""

    hook = "hook"
    intro = "intro"
    development = "development"
    climax = "climax"
    resolution = "resolution"
    conclusion = "conclusion"
    cta = "cta"


class ScriptChapter(Base):
    """Modelo de capítulo do script"""

    __tablename__ = "script_chapters"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    project_id = Column(GUID(), ForeignKey("projects.id"), nullable=False)
    chapter_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    chapter_type = Column(Enum(ChapterTypeEnum), nullable=False)
    content = Column(Text, nullable=False)
    duration_seconds = Column(Integer, nullable=True)
    emotional_intensity = Column(Integer, default=5)  # 1-10
    retention_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    project = relationship("Project", back_populates="chapters")
    voice_segments = relationship(
        "VoiceSegment", back_populates="chapter", cascade="all, delete-orphan"
    )
    assets = relationship("Asset", back_populates="chapter", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<ScriptChapter(id={self.id}, number={self.chapter_number}, title={self.title})>"
