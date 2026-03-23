from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.models.base import Base, GUID


class MiningResult(Base):
    """Modelo de resultado de mineração de conteúdo"""

    __tablename__ = "mining_results"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    query = Column(String(255), nullable=False)
    genre = Column(String(100), nullable=True)
    year_from = Column(Integer, nullable=True)
    year_to = Column(Integer, nullable=True)
    content_type = Column(String(50), nullable=True)
    title = Column(String(255), nullable=False)
    year = Column(Integer, nullable=True)
    synopsis = Column(Text, nullable=True)
    tmdb_id = Column(String(50), nullable=True)
    tmdb_rating = Column(Float, nullable=True)
    yt_video_count = Column(Integer, nullable=True)
    yt_avg_views = Column(Float, nullable=True)
    yt_avg_comments = Column(Float, nullable=True)
    opportunity_score = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="mining_results")

    def __repr__(self):
        return f"<MiningResult(id={self.id}, title={self.title}, score={self.opportunity_score})>"
