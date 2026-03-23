from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.models.base import Base, GUID


class APISettings(Base):
    """Modelo de configurações de API por usuário"""

    __tablename__ = "api_settings"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    service = Column(String(50), nullable=False)  # tmdb, youtube, pexels, openai, elevenlabs
    api_key = Column(String(500), nullable=False)  # Deve ser encriptado em produção
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="api_settings")

    def __repr__(self):
        return f"<APISettings(id={self.id}, service={self.service})>"
