"""
Rotas de voz: TTS e segmentos de narração
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.database import get_db
from app.models.voice import VoiceSegment
from app.models.script import ScriptChapter
from app.models.project import Project
from app.models.user import User
from app.schemas.voice import (
    VoiceSegmentCreate,
    VoiceSegmentUpdate,
    VoiceSegmentResponse,
)
from app.routers.auth import get_current_user
from app.services.voice_service import VoiceService

router = APIRouter(prefix="/voice", tags=["voice"])
voice_service = VoiceService()


@router.post("/generate/{chapter_id}", response_model=VoiceSegmentResponse)
def generate_voice_for_chapter(
    chapter_id: UUID,
    voice_model: str = "lucas_pt",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Gera voz para um capítulo"""
    chapter = db.query(ScriptChapter).filter(ScriptChapter.id == chapter_id).first()

    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Capítulo não encontrado",
        )

    # Verificar permissão
    project = (
        db.query(Project)
        .filter(Project.id == chapter.project_id, Project.user_id == current_user.id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sem permissão",
        )

    # Deletar segmento anterior se existir
    db.query(VoiceSegment).filter(VoiceSegment.chapter_id == chapter_id).delete()

    # Gerar voz
    voice_result = voice_service.generate_voice(
        text=chapter.content,
        voice_model=voice_model,
        language=project.output_language,
    )

    # Criar segmento de voz
    voice_segment = VoiceSegment(
        project_id=chapter.project_id,
        chapter_id=chapter_id,
        text=chapter.content,
        audio_path=voice_result.audio_path,
        duration_seconds=voice_result.duration_seconds,
        voice_model=voice_model,
        status="ready",
    )
    db.add(voice_segment)
    db.commit()
    db.refresh(voice_segment)

    return voice_segment


@router.get("/available-models")
def get_available_voice_models(language: str = "pt-BR"):
    """Lista vozes disponíveis"""
    voices = voice_service.get_available_voices(language=language)
    return {
        "language": language,
        "voices": [
            {
                "model_id": k,
                "name": v["name"],
                "gender": v["gender"],
                "accent": v["accent"],
            }
            for k, v in voices.items()
        ],
    }


@router.post("/{project_id}/segments", response_model=VoiceSegmentResponse)
def create_voice_segment(
    project_id: UUID,
    segment_data: VoiceSegmentCreate,
    chapter_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cria segmento de voz manualmente"""
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

    # Estimar duração
    duration = voice_service.estimate_duration(
        segment_data.text, language=project.output_language
    )

    new_segment = VoiceSegment(
        project_id=project_id,
        chapter_id=chapter_id,
        text=segment_data.text,
        voice_model=segment_data.voice_model,
        duration_seconds=duration,
        status="pending",
    )
    db.add(new_segment)
    db.commit()
    db.refresh(new_segment)

    return new_segment


@router.get("/{project_id}/segments", response_model=List[VoiceSegmentResponse])
def list_voice_segments(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista segmentos de voz de um projeto"""
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

    segments = db.query(VoiceSegment).filter(VoiceSegment.project_id == project_id).all()
    return segments


@router.get("/segment/{segment_id}", response_model=VoiceSegmentResponse)
def get_voice_segment(
    segment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtém detalhes de um segmento de voz"""
    segment = db.query(VoiceSegment).filter(VoiceSegment.id == segment_id).first()

    if not segment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Segmento não encontrado",
        )

    # Verificar permissão
    project = (
        db.query(Project)
        .filter(Project.id == segment.project_id, Project.user_id == current_user.id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sem permissão",
        )

    return segment


@router.patch("/segment/{segment_id}", response_model=VoiceSegmentResponse)
def update_voice_segment(
    segment_id: UUID,
    segment_data: VoiceSegmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Atualiza um segmento de voz"""
    segment = db.query(VoiceSegment).filter(VoiceSegment.id == segment_id).first()

    if not segment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Segmento não encontrado",
        )

    # Verificar permissão
    project = (
        db.query(Project)
        .filter(Project.id == segment.project_id, Project.user_id == current_user.id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sem permissão",
        )

    update_data = segment_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(segment, field, value)

    db.commit()
    db.refresh(segment)

    return segment
