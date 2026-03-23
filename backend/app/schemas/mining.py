from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class MiningResultCreate(BaseModel):
    """Schema para criar resultado de mineração"""

    query: str
    genre: Optional[str] = None
    year_from: Optional[int] = None
    year_to: Optional[int] = None
    content_type: Optional[str] = None


class MiningResultResponse(BaseModel):
    """Schema para resposta de resultado de mineração"""

    id: UUID
    user_id: UUID
    query: str
    genre: Optional[str] = None
    year_from: Optional[int] = None
    year_to: Optional[int] = None
    content_type: Optional[str] = None
    title: str
    year: Optional[int] = None
    synopsis: Optional[str] = None
    tmdb_id: Optional[str] = None
    tmdb_rating: Optional[float] = None
    yt_video_count: Optional[int] = None
    yt_avg_views: Optional[float] = None
    yt_avg_comments: Optional[float] = None
    youtube_video_id: Optional[str] = None
    youtube_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    channel_title: Optional[str] = None
    channel_id: Optional[str] = None
    channel_subscribers: Optional[int] = None
    published_at: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    like_count: Optional[int] = None
    comment_count: Optional[int] = None
    views_per_day: Optional[float] = None
    engagement_rate: Optional[float] = None
    opportunity_score: float
    created_at: datetime

    class Config:
        from_attributes = True


class MiningSearchRequest(BaseModel):
    """Schema para requisição de busca"""

    query: str
    genre: Optional[str] = None
    year_from: Optional[int] = None
    year_to: Optional[int] = None
    content_type: Optional[str] = None
