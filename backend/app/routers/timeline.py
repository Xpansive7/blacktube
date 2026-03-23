"""
Rotas de timeline: visualização e composição de assets + voz
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Dict, Any

from app.database import get_db
from app.models.project import Project
from app.models.script import ScriptChapter
from app.models.asset import Asset
from app.models.voice import VoiceSegment
from app.models.user import User
from app.routers.auth import get_current_user

router = APIRouter(prefix="/timeline", tags=["timeline"])


@router.get("/{project_id}")
def get_project_timeline(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Retorna timeline completa do projeto:
    - Capítulos com duração
    - Assets mapeados por capítulo
    - Segmentos de voz sincronizados
    """
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

    # Buscar todos os capítulos
    chapters = (
        db.query(ScriptChapter)
        .filter(ScriptChapter.project_id == project_id)
        .order_by(ScriptChapter.chapter_number)
        .all()
    )

    # Buscar assets
    assets = db.query(Asset).filter(Asset.project_id == project_id).all()

    # Buscar segmentos de voz
    voice_segments = (
        db.query(VoiceSegment).filter(VoiceSegment.project_id == project_id).all()
    )

    # Construir timeline estruturada
    timeline_data = {
        "project_id": str(project_id),
        "title": project.title,
        "total_duration_seconds": sum(
            c.duration_seconds or 0 for c in chapters
        ),
        "chapters": [],
    }

    current_time = 0.0

    for chapter in chapters:
        duration = chapter.duration_seconds or 30
        tc_in = current_time
        tc_out = current_time + duration

        # Assets neste capítulo
        chapter_assets = [a for a in assets if a.chapter_id == chapter.id]

        # Voz neste capítulo
        chapter_voice = next(
            (v for v in voice_segments if v.chapter_id == chapter.id), None
        )

        chapter_data = {
            "id": str(chapter.id),
            "number": chapter.chapter_number,
            "title": chapter.title,
            "type": chapter.chapter_type,
            "content_preview": chapter.content[:100] + "..."
            if len(chapter.content) > 100
            else chapter.content,
            "duration_seconds": duration,
            "timecode_in": f"{int(tc_in // 60):02d}:{int(tc_in % 60):02d}",
            "timecode_out": f"{int(tc_out // 60):02d}:{int(tc_out % 60):02d}",
            "emotional_intensity": chapter.emotional_intensity,
            "retention_notes": chapter.retention_notes,
            "assets": [
                {
                    "id": str(a.id),
                    "type": a.asset_type,
                    "source": a.source,
                    "duration": a.duration_seconds,
                    "url": a.url,
                }
                for a in chapter_assets
            ],
            "voice": (
                {
                    "id": str(chapter_voice.id),
                    "model": chapter_voice.voice_model,
                    "duration": chapter_voice.duration_seconds,
                    "status": chapter_voice.status,
                    "audio_path": chapter_voice.audio_path,
                }
                if chapter_voice
                else None
            ),
        }

        timeline_data["chapters"].append(chapter_data)
        current_time += duration

    return timeline_data


@router.get("/{project_id}/summary")
def get_timeline_summary(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Retorna resumo de timeline (sem detalhes de assets)"""
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

    chapters = (
        db.query(ScriptChapter)
        .filter(ScriptChapter.project_id == project_id)
        .order_by(ScriptChapter.chapter_number)
        .all()
    )

    assets = db.query(Asset).filter(Asset.project_id == project_id).all()
    voice_segments = (
        db.query(VoiceSegment).filter(VoiceSegment.project_id == project_id).all()
    )

    total_duration = sum(c.duration_seconds or 0 for c in chapters)
    total_words = sum(len(c.content.split()) for c in chapters)

    return {
        "project_id": str(project_id),
        "title": project.title,
        "chapter_count": len(chapters),
        "asset_count": len(assets),
        "voice_segment_count": len(voice_segments),
        "total_duration_seconds": total_duration,
        "total_duration_minutes": round(total_duration / 60, 2),
        "total_words": total_words,
        "avg_words_per_chapter": int(
            total_words / len(chapters) if chapters else 0
        ),
        "narrative_mode": project.narrative_mode,
        "status": project.status,
    }


@router.post("/{project_id}/validate")
def validate_timeline(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Valida se a timeline está pronta para render:
    - Todos os capítulos têm conteúdo
    - Todos têm duração
    - Há assets mapeados
    - Há voz gerada
    """
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

    chapters = (
        db.query(ScriptChapter)
        .filter(ScriptChapter.project_id == project_id)
        .all()
    )

    assets = db.query(Asset).filter(Asset.project_id == project_id).all()
    voice_segments = (
        db.query(VoiceSegment).filter(VoiceSegment.project_id == project_id).all()
    )

    issues = []
    warnings = []

    # Validações
    if not chapters:
        issues.append("Nenhum capítulo definido")

    for chapter in chapters:
        if not chapter.content:
            issues.append(f"Capítulo '{chapter.title}' sem conteúdo")
        if not chapter.duration_seconds:
            issues.append(f"Capítulo '{chapter.title}' sem duração definida")

    if not assets:
        warnings.append("Nenhum asset visual mapeado")

    if not voice_segments:
        warnings.append("Nenhuma voz gerada")

    # Verificar cobertura de voz
    chapters_with_voice = {v.chapter_id for v in voice_segments}
    for chapter in chapters:
        if chapter.id not in chapters_with_voice:
            warnings.append(f"Capítulo '{chapter.title}' sem voz gerada")

    ready_to_render = len(issues) == 0 and len(chapters) > 0

    return {
        "valid": ready_to_render,
        "issues": issues,
        "warnings": warnings,
        "chapter_count": len(chapters),
        "asset_count": len(assets),
        "voice_count": len(voice_segments),
        "ready_to_render": ready_to_render,
    }
