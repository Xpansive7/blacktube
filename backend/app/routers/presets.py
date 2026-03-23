"""
Rotas de presets visuais
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.database import get_db
from app.models.visual_preset import VisualPreset
from app.models.user import User
from app.schemas.visual_preset import (
    VisualPresetCreate,
    VisualPresetUpdate,
    VisualPresetResponse,
)
from app.routers.auth import get_current_user

router = APIRouter(prefix="/presets", tags=["visual presets"])


@router.post("", response_model=VisualPresetResponse, status_code=status.HTTP_201_CREATED)
def create_preset(
    preset_data: VisualPresetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cria novo preset visual"""
    new_preset = VisualPreset(
        user_id=current_user.id,
        name=preset_data.name,
        style=preset_data.style,
        lighting=preset_data.lighting,
        color_palette=preset_data.color_palette,
        contrast=preset_data.contrast,
        texture=preset_data.texture,
        composition=preset_data.composition,
        dramatic_intensity=preset_data.dramatic_intensity,
        motion_style=preset_data.motion_style,
        prompt_base=preset_data.prompt_base,
        is_default=preset_data.is_default,
    )
    db.add(new_preset)
    db.commit()
    db.refresh(new_preset)

    return new_preset


@router.get("", response_model=List[VisualPresetResponse])
def list_presets(
    include_defaults: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista presets visuais (do usuário + defaults)"""
    query = db.query(VisualPreset).filter(
        (VisualPreset.user_id == current_user.id)
        | (VisualPreset.user_id.is_(None))  # Defaults
    )

    if not include_defaults:
        query = query.filter(VisualPreset.user_id == current_user.id)

    presets = query.all()
    return presets


@router.get("/{preset_id}", response_model=VisualPresetResponse)
def get_preset(
    preset_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtém detalhes de um preset"""
    preset = db.query(VisualPreset).filter(VisualPreset.id == preset_id).first()

    if not preset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preset não encontrado",
        )

    # Verificar permissão (seu ou default)
    if preset.user_id is not None and preset.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sem permissão",
        )

    return preset


@router.patch("/{preset_id}", response_model=VisualPresetResponse)
def update_preset(
    preset_id: UUID,
    preset_data: VisualPresetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Atualiza um preset"""
    preset = db.query(VisualPreset).filter(VisualPreset.id == preset_id).first()

    if not preset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preset não encontrado",
        )

    # Verificar permissão
    if preset.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sem permissão",
        )

    update_data = preset_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(preset, field, value)

    db.commit()
    db.refresh(preset)

    return preset


@router.delete("/{preset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_preset(
    preset_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Deleta um preset"""
    preset = db.query(VisualPreset).filter(VisualPreset.id == preset_id).first()

    if not preset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preset não encontrado",
        )

    # Verificar permissão
    if preset.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sem permissão",
        )

    db.delete(preset)
    db.commit()
