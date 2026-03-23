"""
Rotas de assets: imagens, vídeos, overlays
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.database import get_db
from app.models.asset import Asset
from app.models.project import Project
from app.models.user import User
from app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/assets", tags=["assets"])


@router.post("/{project_id}", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
def create_asset(
    project_id: UUID,
    asset_data: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cria novo asset para um projeto"""
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == current_user.id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projeto não encontrado",
        )

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
    """Lista assets de um projeto"""
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == current_user.id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projeto não encontrado",
        )

    assets = db.query(Asset).filter(Asset.project_id == project_id).all()
    return assets


@router.get("/asset/{asset_id}", response_model=AssetResponse)
def get_asset(
    asset_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtém detalhes de um asset"""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()

    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset não encontrado",
        )

    # Verificar permissão
    project = (
        db.query(Project)
        .filter(Project.id == asset.project_id, Project.user_id == current_user.id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sem permissão",
        )

    return asset


@router.patch("/asset/{asset_id}", response_model=AssetResponse)
def update_asset(
    asset_id: UUID,
    asset_data: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Atualiza um asset"""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()

    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset não encontrado",
        )

    # Verificar permissão
    project = (
        db.query(Project)
        .filter(Project.id == asset.project_id, Project.user_id == current_user.id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sem permissão",
        )

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
    """Deleta um asset"""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()

    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset não encontrado",
        )

    # Verificar permissão
    project = (
        db.query(Project)
        .filter(Project.id == asset.project_id, Project.user_id == current_user.id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sem permissão",
        )

    db.delete(asset)
    db.commit()
