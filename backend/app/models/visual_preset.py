from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.models.base import Base, GUID


class VisualPreset(Base):
    """Modelo de preset visual para produção"""

    __tablename__ = "visual_presets"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=True)
    name = Column(String(255), nullable=False)
    style = Column(String(100), nullable=True)  # cinematic, documentary, minimal, etc
    lighting = Column(String(100), nullable=True)  # dramatic, soft, harsh, etc
    color_palette = Column(String(255), nullable=True)  # comma-separated colors
    contrast = Column(String(50), nullable=True)  # low, medium, high
    texture = Column(String(100), nullable=True)  # smooth, grainy, rough, etc
    composition = Column(String(100), nullable=True)  # rule_of_thirds, centered, etc
    dramatic_intensity = Column(Integer, default=5)  # 1-10
    motion_style = Column(String(100), nullable=True)  # static, slow, dynamic, etc
    prompt_base = Column(Text, nullable=True)  # Base prompt para geração de imagens
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="visual_presets")
    projects = relationship("Project", back_populates="visual_preset")

    def __repr__(self):
        return f"<VisualPreset(id={self.id}, name={self.name})>"
