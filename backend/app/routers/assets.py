"""
Rotas de assets: imagens, videos e overlays.
"""

from typing import Any, Dict, List, Optional
from uuid import UUID

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.api_settings import APISettings
from app.models.asset import Asset
from app.models.project import Project
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.asset import AssetCreate, AssetResponse, AssetUpdate

router = APIRouter(prefix="/assets", tags=["assets"])


def _get_project_for_user(project_id: UUID, current_user: User, db: Session) -> Project:
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == current_user.id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projeto nao encontrado",
        )

    return project


def _get_pexels_key(current_user: User, db: Session, settings) -> str:
    user_setting = (
        db.query(APISettings)
        .filter(
            APISettings.user_id == current_user.id,
            APISettings.service == "pexels",
            APISettings.is_active.is_(True),
        )
        .first()
    )

    return (user_setting.api_key if user_setting else "") or settings.pexels_api_key


@router.post("/{project_id}", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
def create_asset(
    project_id: UUID,
    asset_data: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cria novo asset para um projeto."""
    _get_project_for_user(project_id, current_user, db)

    new_asset = Asset(
        project_id=project_id,
        chapter_id=asset_data.chapter_id,
        asset_type=asset_data.asset_type,
        source=asset_data.source,
        file_path=asset_data.file_path,
        url=asset_data.url,
        prompt_used=asset_data.prompt_used,
        duration_seconds=asset_data.duration_seconds,
        metadata_json=asset_data.metadata_json,
    )
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)

    return new_asset


@router.get("/{project_id}", response_model=List[AssetResponse])
def list_project_assets(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista assets de um projeto."""
    _get_project_for_user(project_id, current_user, db)
    return db.query(Asset).filter(Asset.project_id == project_id).all()


@router.get("/{project_id}/search/pexels")
async def search_pexels_assets(
    project_id: UUID,
    query: str = Query(..., min_length=2),
    per_page: int = Query(12, ge=1, le=40),
    orientation: Optional[str] = Query(None),
    media_type: str = Query("image", pattern="^(image|video)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    settings=Depends(get_settings),
) -> Dict[str, Any]:
    """Busca assets no Pexels usando a chave do usuario ou do ambiente."""
    _get_project_for_user(project_id, current_user, db)

    api_key = _get_pexels_key(current_user, db, settings)
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pexels API key nao configurada",
        )

    endpoint = (
        "https://api.pexels.com/videos/search"
        if media_type == "video"
        else "https://api.pexels.com/v1/search"
    )
    params: Dict[str, Any] = {"query": query, "per_page": per_page}
    if orientation:
        params["orientation"] = orientation

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.get(
            endpoint,
            headers={"Authorization": api_key},
            params=params,
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Pexels retornou status {response.status_code}",
        )

    payload = response.json()
    items = payload.get("videos" if media_type == "video" else "photos", [])

    normalized: List[Dict[str, Any]] = []
    for item in items:
        if media_type == "video":
            video_files = item.get("video_files", [])
            best_file = next(
                (entry for entry in video_files if entry.get("quality") == "sd"),
                video_files[0] if video_files else None,
            )
            normalized.append(
                {
                    "id": item.get("id"),
                    "type": "video",
                    "source": "pexels",
                    "url": best_file.get("link") if best_file else None,
                    "preview": item.get("image"),
                    "width": item.get("width"),
                    "height": item.get("height"),
                    "duration": item.get("duration"),
                    "author": item.get("user", {}).get("name"),
                    "pexels_url": item.get("url"),
                }
            )
        else:
            src = item.get("src", {})
            normalized.append(
                {
                    "id": item.get("id"),
                    "type": "image",
                    "source": "pexels",
                    "url": src.get("large2x") or src.get("large") or src.get("original"),
                    "preview": src.get("medium") or src.get("small"),
                    "width": item.get("width"),
                    "height": item.get("height"),
                    "author": item.get("photographer"),
                    "pexels_url": item.get("url"),
                }
            )

    return {
        "query": query,
        "media_type": media_type,
        "total_results": payload.get("total_results", len(normalized)),
        "results": normalized,
    }


@router.get("/asset/{asset_id}", response_model=AssetResponse)
def get_asset(
    asset_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtem detalhes de um asset."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()

    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset nao encontrado",
        )

    _get_project_for_user(asset.project_id, current_user, db)
    return asset


@router.patch("/asset/{asset_id}", response_model=AssetResponse)
def update_asset(
    asset_id: UUID,
    asset_data: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Atualiza um asset."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()

    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset nao encontrado",
        )

    _get_project_for_user(asset.project_id, current_user, db)

    update_data = asset_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(asset, field, value)

    db.commit()
    db.refresh(asset)
    return asset


@router.delete("/asset/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset(
    asset_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Deleta um asset."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()

    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset nao encontrado",
        )

    _get_project_for_user(asset.project_id, current_user, db)
    db.delete(asset)
    db.commit()
