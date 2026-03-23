"""
Rotas de mineração: busca de conteúdo em TMDb e YouTube
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.mining import MiningResult
from app.models.user import User
from app.schemas.mining import MiningResultCreate, MiningResultResponse, MiningSearchRequest
from app.routers.auth import get_current_user
from app.services.mining_service import MiningService

router = APIRouter(prefix="/mining", tags=["mining"])
mining_service = MiningService()


@router.post("/search")
def search_mining(
    search: MiningSearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Busca conteúdo em TMDb/YouTube e retorna oportunidades"""
    # Chamar mining service
    results = mining_service.search(
        query=search.query,
        genre=search.genre,
        year_from=search.year_from,
        year_to=search.year_to,
        content_type=search.content_type,
    )

    # Salvar resultados no banco
    saved_results = []
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

    # Refazer queries para ter os IDs
    for record in saved_results:
        db.refresh(record)

    return [MiningResultResponse.model_validate(r) for r in saved_results]


@router.get("/results", response_model=List[MiningResultResponse])
def list_mining_results(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista resultados de mineração do usuário"""
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
    """Obtém detalhes de um resultado de mineração"""
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
    """Obtém conteúdo com alta oportunidade (score > 70)"""
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
