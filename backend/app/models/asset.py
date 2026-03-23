from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.models.base import Base, GUID


class AssetTypeEnum(str, enum.Enum):
    """Tipos de asset"""

    image = "image"
    video = "video"
    overlay = "overlay"
    transition = "transition"


class AssetSourceEnum(str, enum.Enum):
    """Fontes de asset"""

    pexels = "pexels"
    upload = "upload"
    ai_generated = "ai_generated"
    placeholder = "placeholder"


class Asset(Base):
    """Modelo de asset (imagem, vídeo, overlay)"""

    __tablename__ = "assets"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    project_id = Column(GUID(), ForeignKey("projects.id"), nullable=False)
    chapter_id = Column(GUID(), ForeignKey("script_chapters.id"), nullable=True)
    asset_type = Column(Enum(AssetTypeEnum), nullable=False)
    source = Column(Enum(AssetSourceEnum), nullable=False)
    file_path = Column(String(500), nullable=True)
    url = Column(String(500), nullable=True)
    prompt_used = Column(Text, nullable=True)  # Prompt se gerado por IA
    duration_seconds = Column(Float, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    project = relationship("Project", back_populates="assets")
    chapter = relationship("ScriptChapter", back_populates="assets")

    def __repr__(self):
        return f"<Asset(id={self.id}, type={self.asset_type})>"
