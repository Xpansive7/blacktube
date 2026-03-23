"""
Rotas de exportação: JSON, TXT, render plans
"""

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Dict, Any

from app.database import get_db
from app.models.project import Project
from app.models.script import ScriptChapter
from app.models.asset import Asset
from app.models.voice import VoiceSegment
from app.models.export import ExportJob, ExportStatusEnum, ExportTypeEnum
from app.models.user import User
from app.schemas.export import ExportJobCreate, ExportJobResponse
from app.routers.auth import get_current_user
from app.services.export_service import ExportService

router = APIRouter(prefix="/export", tags=["export"])
export_service = ExportService()


@router.post("/{project_id}/json", response_model=ExportJobResponse)
def export_to_json(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Exporta projeto como JSON"""
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

    # Coletar dados do projeto
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

    # Estruturar dados
    project_data = {
        "id": str(project.id),
        "title": project.title,
        "type": project.project_type.value,
        "narrative_mode": project.narrative_mode.value,
        "awareness_level": project.audience_awareness_level.value,
        "status": project.status.value,
        "chapters": [
            {
                "id": str(c.id),
                "number": c.chapter_number,
                "title": c.title,
                "type": c.chapter_type.value,
                "content": c.content,
                "duration_seconds": c.duration_seconds,
                "emotional_intensity": c.emotional_intensity,
                "retention_notes": c.retention_notes,
            }
            for c in chapters
        ],
        "assets": [
            {
                "id": str(a.id),
                "type": a.asset_type.value,
                "source": a.source.value,
                "url": a.url,
                "chapter_id": str(a.chapter_id) if a.chapter_id else None,
            }
            for a in assets
        ],
        "voice_segments": [
            {
                "id": str(v.id),
                "chapter_id": str(v.chapter_id),
                "duration": v.duration_seconds,
                "model": v.voice_model,
                "status": v.status.value,
            }
            for v in voice_segments
        ],
    }

    # Exportar para JSON
    json_output = export_service.export_to_json(project_data)

    # Criar job de exportação
    export_job = ExportJob(
        project_id=project_id,
        export_type=ExportTypeEnum.json,
        status=ExportStatusEnum.completed,
        output_path=f"/exports/{project_id}.json",
    )
    db.add(export_job)
    db.commit()
    db.refresh(export_job)

    return export_job


@router.post("/{project_id}/txt", response_model=ExportJobResponse)
def export_to_txt(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Exporta projeto como TXT formatado"""
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

    # Coletar capítulos
    chapters = (
        db.query(ScriptChapter)
        .filter(ScriptChapter.project_id == project_id)
        .order_by(ScriptChapter.chapter_number)
        .all()
    )

    chapter_data = [
        {
            "title": c.title,
            "chapter_type": c.chapter_type.value,
            "content": c.content,
            "duration_seconds": c.duration_seconds,
            "emotional_intensity": c.emotional_intensity,
            "retention_notes": c.retention_notes,
        }
        for c in chapters
    ]

    # Exportar para TXT
    txt_output = export_service.export_to_txt(project.title, chapter_data)

    # Criar job
    export_job = ExportJob(
        project_id=project_id,
        export_type=ExportTypeEnum.txt,
        status=ExportStatusEnum.completed,
        output_path=f"/exports/{project_id}.txt",
    )
    db.add(export_job)
    db.commit()
    db.refresh(export_job)

    return export_job


@router.post("/{project_id}/render-plan", response_model=ExportJobResponse)
def export_render_plan(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Exporta plano de renderização (DaVinci Resolve, Premiere, etc)"""
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

    # Coletar dados
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

    chapter_data = [
        {
            "id": str(c.id),
            "title": c.title,
            "chapter_type": c.chapter_type.value,
            "duration_seconds": c.duration_seconds,
        }
        for c in chapters
    ]

    asset_data = [
        {
            "id": str(a.id),
            "chapter_id": str(a.chapter_id) if a.chapter_id else None,
            "asset_type": a.asset_type.value,
            "duration_seconds": a.duration_seconds,
            "url": a.url,
        }
        for a in assets
    ]

    voice_data = [
        {
            "id": str(v.id),
            "chapter_id": str(v.chapter_id),
            "duration_seconds": v.duration_seconds,
            "voice_model": v.voice_model,
        }
        for v in voice_segments
    ]

    # Exportar render plan
    render_plan = export_service.export_to_render_plan(
        project.title, chapter_data, asset_data, voice_data
    )

    # Criar job
    export_job = ExportJob(
        project_id=project_id,
        export_type=ExportTypeEnum.render_plan,
        status=ExportStatusEnum.completed,
        output_path=f"/exports/{project_id}_render_plan.txt",
    )
    db.add(export_job)
    db.commit()
    db.refresh(export_job)

    return export_job


@router.get("/{project_id}/jobs", response_model=list)
def list_export_jobs(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista jobs de exportação de um projeto"""
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

    jobs = (
        db.query(ExportJob)
        .filter(ExportJob.project_id == project_id)
        .order_by(ExportJob.created_at.desc())
        .all()
    )

    return [
        {
            "id": str(j.id),
            "export_type": j.export_type.value,
            "status": j.status.value,
            "output_path": j.output_path,
            "created_at": j.created_at,
            "completed_at": j.completed_at,
        }
        for j in jobs
    ]


@router.get("/{project_id}/stats")
def get_export_stats(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Retorna estatísticas do projeto para exibição na UI"""
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

    project_data = {
        "chapters": [{"id": str(c.id), "content": c.content} for c in chapters],
        "assets": [{"id": str(a.id)} for a in assets],
        "voice_segments": [{"id": str(v.id)} for v in voice_segments],
    }

    stats = export_service.get_export_stats(project_data)

    return {
        **stats,
        "project_title": project.title,
        "project_type": project.project_type.value,
        "narrative_mode": project.narrative_mode.value,
        "status": project.status.value,
    }
