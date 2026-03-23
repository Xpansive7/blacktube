from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.models.base import Base, GUID


class User(Base):
    """Modelo de usuário do BlackTube"""

    __tablename__ = "users"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    mining_results = relationship(
        "MiningResult", back_populates="user", cascade="all, delete-orphan"
    )
    visual_presets = relationship(
        "VisualPreset", back_populates="user", cascade="all, delete-orphan"
    )
    api_settings = relationship(
        "APISettings", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"
