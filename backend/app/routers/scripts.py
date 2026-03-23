"""
Rotas de scripts: CRUD de capítulos e geração narrativa
"""

from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.database import get_db
from app.models.project import Project
from app.models.script import ScriptChapter
from app.models.user import User
from app.schemas.script import (
    ScriptChapterCreate,
    ScriptChapterUpdate,
    ScriptChapterResponse,
)
from app.routers.auth import get_current_user
from app.services.narrative_engine import NarrativeEngine, NarrativeMode, AwarenessLevel

router = APIRouter(prefix="/scripts", tags=["scripts"])
narrative_engine = NarrativeEngine()


@router.post("/generate/{project_id}")
def generate_narrative_script(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Gera script completo usando Narrative Engine"""
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

    # Gerar narrativa
    narrative = narrative_engine.generate_narrative(
        theme=project.title,
        narrative_mode=NarrativeMode(project.narrative_mode.value),
        awareness_level=AwarenessLevel(project.audience_awareness_level.value),
        target_duration_minutes=project.target_duration_minutes,
    )

    # Limpar capítulos anteriores
    db.query(ScriptChapter).filter(ScriptChapter.project_id == project_id).delete()

    # Criar capítulo de hook
    hook_chapter = ScriptChapter(
        project_id=project_id,
        chapter_number=0,
        title="Hook",
        chapter_type="hook",
        content=narrative.hook,
        duration_seconds=15,
        emotional_intensity=8,
        retention_notes="Primeiro impacto - capture atenção imediata",
    )
    db.add(hook_chapter)

    # Criar capítulo de intro
    intro_chapter = ScriptChapter(
        project_id=project_id,
        chapter_number=1,
        title="Introdução",
        chapter_type="intro",
        content=narrative.intro,
        duration_seconds=30,
        emotional_intensity=6,
        retention_notes="Contextualize o problema",
    )
    db.add(intro_chapter)

    # Criar capítulos da narrativa
    for i, chapter in enumerate(narrative.chapters, start=2):
        script_chapter = ScriptChapter(
            project_id=project_id,
            chapter_number=i,
            title=chapter.title,
            chapter_type=chapter.chapter_type,
            content=chapter.content,
            duration_seconds=chapter.duration_seconds,
            emotional_intensity=chapter.emotional_intensity,
            retention_notes=chapter.retention_notes,
        )
        db.add(script_chapter)

    # Criar capítulo de conclusão
    conclusion_number = len(narrative.chapters) + 2
    conclusion_chapter = ScriptChapter(
        project_id=project_id,
        chapter_number=conclusion_number,
        title="Conclusão",
        chapter_type="conclusion",
        content=narrative.conclusion,
        duration_seconds=30,
        emotional_intensity=7,
        retention_notes="Amarre as ideias principais",
    )
    db.add(conclusion_chapter)

    # Criar capítulo de CTA
    cta_chapter = ScriptChapter(
        project_id=project_id,
        chapter_number=conclusion_number + 1,
        title="Call to Action",
        chapter_type="cta",
        content=narrative.cta,
        duration_seconds=10,
        emotional_intensity=8,
        retention_notes="Deixe com impulso para agir",
    )
    db.add(cta_chapter)

    # Atualizar status do projeto
    project.status = "writing"

    db.commit()

    return {
        "message": "Script gerado com sucesso",
        "metadata": narrative.metadata,
        "chapters_created": len(narrative.chapters) + 4,  # hook + intro + chapters + conclusion + cta
    }


@router.post("/{project_id}/chapters", response_model=ScriptChapterResponse)
def create_chapter(
    project_id: UUID,
    chapter_data: ScriptChapterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cria capítulo manualmente"""
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

    new_chapter = ScriptChapter(
        project_id=project_id,
        chapter_number=chapter_data.chapter_number,
        title=chapter_data.title,
        chapter_type=chapter_data.chapter_type,
        content=chapter_data.content,
        duration_seconds=chapter_data.duration_seconds,
        emotional_intensity=chapter_data.emotional_intensity,
        retention_notes=chapter_data.retention_notes,
    )
    db.add(new_chapter)
    db.commit()
    db.refresh(new_chapter)

    return new_chapter


@router.get("/{project_id}/chapters", response_model=List[ScriptChapterResponse])
def list_chapters(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista capítulos de um projeto"""
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
    return chapters


@router.get("/chapters/{chapter_id}", response_model=ScriptChapterResponse)
def get_chapter(
    chapter_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtém detalhes de um capítulo"""
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

    return chapter


@router.patch("/chapters/{chapter_id}", response_model=ScriptChapterResponse)
def update_chapter(
    chapter_id: UUID,
    chapter_data: ScriptChapterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Atualiza um capítulo"""
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

    update_data = chapter_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(chapter, field, value)

    db.commit()
    db.refresh(chapter)

    return chapter


@router.delete("/chapters/{chapter_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chapter(
    chapter_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Deleta um capítulo"""
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

    db.delete(chapter)
    db.commit()
