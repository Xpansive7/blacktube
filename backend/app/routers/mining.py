"""
Rotas de mineração: busca real de conteúdo no YouTube.
"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mining import MiningResult
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.mining import MiningResultResponse, MiningSearchRequest
from app.services.mining_service import MiningService

router = APIRouter(prefix="/mining", tags=["mining"])
mining_service = MiningService()


@router.post("/search", response_model=List[MiningResultResponse])
def search_mining(
    search: MiningSearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Busca conteúdo real no YouTube e retorna oportunidades enriquecidas."""
    results = mining_service.search(
        query=search.query,
        genre=search.genre,
        year_from=search.year_from,
        year_to=search.year_to,
        content_type=search.content_type,
    )

    saved_results: list[MiningResult] = []
    payload: list[MiningResultResponse] = []

    for result in results:
        mining_record = MiningResult(
            user_id=current_user.id,
            query=search.query,
            genre=search.genre,
            year_from=search.year_from,
            year_to=search.year_to,
            content_type=search.content_type,
            title=result.title,
            year=result.year,
            synopsis=result.synopsis,
            tmdb_id=result.tmdb_id,
            tmdb_rating=result.tmdb_rating,
            yt_video_count=result.yt_video_count,
            yt_avg_views=result.yt_avg_views,
            yt_avg_comments=result.yt_avg_comments,
            opportunity_score=result.opportunity_score,
        )
        db.add(mining_record)
        saved_results.append(mining_record)

    db.commit()

    for record, result in zip(saved_results, results):
        db.refresh(record)
        payload.append(
            MiningResultResponse(
                id=record.id,
                user_id=record.user_id,
                query=record.query,
                genre=record.genre,
                year_from=record.year_from,
                year_to=record.year_to,
                content_type=record.content_type,
                title=record.title,
                year=record.year,
                synopsis=record.synopsis,
                tmdb_id=record.tmdb_id,
                tmdb_rating=record.tmdb_rating,
                yt_video_count=record.yt_video_count,
                yt_avg_views=record.yt_avg_views,
                yt_avg_comments=record.yt_avg_comments,
                youtube_video_id=result.youtube_video_id,
                youtube_url=result.youtube_url,
                thumbnail_url=result.thumbnail_url,
                channel_title=result.channel_title,
                channel_id=result.channel_id,
                channel_subscribers=result.channel_subscribers,
                published_at=result.published_at,
                duration_seconds=result.duration_seconds,
                like_count=result.like_count,
                comment_count=result.comment_count,
                views_per_day=result.views_per_day,
                engagement_rate=result.engagement_rate,
                opportunity_score=record.opportunity_score,
                created_at=record.created_at,
            )
        )

    return payload


@router.get("/results", response_model=List[MiningResultResponse])
def list_mining_results(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista resultados anteriores do usuário."""
    results = (
        db.query(MiningResult)
        .filter(MiningResult.user_id == current_user.id)
        .order_by(MiningResult.opportunity_score.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return results


@router.get("/results/{result_id}", response_model=MiningResultResponse)
def get_mining_result(
    result_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtém detalhes de um resultado de mineração."""
    result = (
        db.query(MiningResult)
        .filter(MiningResult.id == result_id, MiningResult.user_id == current_user.id)
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resultado não encontrado",
        )

    return result


@router.get("/opportunity/high", response_model=List[MiningResultResponse])
def get_high_opportunity_content(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtém conteúdo com alta oportunidade (score >= 70)."""
    results = (
        db.query(MiningResult)
        .filter(
            MiningResult.user_id == current_user.id,
            MiningResult.opportunity_score >= 70,
        )
        .order_by(MiningResult.opportunity_score.desc())
        .limit(limit)
        .all()
    )
    return results
