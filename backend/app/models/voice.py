from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.models.base import Base, GUID


class VoiceStatusEnum(str, enum.Enum):
    """Status do segmento de voz"""

    pending = "pending"
    generating = "generating"
    ready = "ready"
    error = "error"


class VoiceSegment(Base):
    """Modelo de segmento de voz/narração"""

    __tablename__ = "voice_segments"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    project_id = Column(GUID(), ForeignKey("projects.id"), nullable=False)
    chapter_id = Column(GUID(), ForeignKey("script_chapters.id"), nullable=False)
    text = Column(Text, nullable=False)
    audio_path = Column(String(500), nullable=True)
    duration_seconds = Column(Float, nullable=True)
    voice_model = Column(String(100), default="mock")  # Nome do modelo TTS
    status = Column(Enum(VoiceStatusEnum), default=VoiceStatusEnum.pending)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    project = relationship("Project", back_populates="voice_segments")
    chapter = relationship("ScriptChapter", back_populates="voice_segments")

    def __repr__(self):
        return f"<VoiceSegment(id={self.id}, status={self.status})>"
