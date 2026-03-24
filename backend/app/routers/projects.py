"""
Rotas de projetos: CRUD completo
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.database import get_db
from app.models.project import Project, ProjectSource
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectSourceCreate,
    ProjectSourceResponse,
)
from app.routers.auth import get_current_user

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cria novo projeto"""
    new_project = Project(
        user_id=current_user.id,
        title=project_data.title,
        project_type=project_data.project_type,
        source_title=project_data.source_title,
        source_year=project_data.source_year,
        synopsis=project_data.synopsis,
        notes=project_data.notes,
        output_language=project_data.output_language,
        target_duration_minutes=project_data.target_duration_minutes,
        narrative_mode=project_data.narrative_mode,
        audience_awareness_level=project_data.audience_awareness_level,
        visual_preset_id=project_data.visual_preset_id,
    )
    db.add(new_project)

    db.flush()

    for source_data in project_data.sources:
        db.add(
            ProjectSource(
                project_id=new_project.id,
                source_type=source_data.source_type,
                external_id=source_data.external_id,
                title=source_data.title,
                url=source_data.url,
                metadata_json=source_data.metadata_json,
            )
        )

    db.commit()
    db.refresh(new_project)

    return new_project


@router.get("", response_model=List[ProjectResponse])
def list_projects(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista projetos do usuário"""
    projects = (
        db.query(Project)
        .filter(Project.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return projects


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Obtém detalhes de um projeto"""
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

    return project


@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: UUID,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Atualiza um projeto"""
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

    # Atualizar apenas campos fornecidos
    update_data = project_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Deleta um projeto"""
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

    db.delete(project)
    db.commit()


# Rotas para fontes de projeto
@router.post("/{project_id}/sources", response_model=ProjectSourceResponse)
def add_project_source(
    project_id: UUID,
    source_data: ProjectSourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Adiciona uma fonte a um projeto"""
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

    new_source = ProjectSource(
        project_id=project_id,
        source_type=source_data.source_type,
        external_id=source_data.external_id,
        title=source_data.title,
        url=source_data.url,
        metadata_json=source_data.metadata_json,
    )
    db.add(new_source)
    db.commit()
    db.refresh(new_source)

    return new_source


@router.get("/{project_id}/sources", response_model=List[ProjectSourceResponse])
def list_project_sources(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lista fontes de um projeto"""
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

    sources = db.query(ProjectSource).filter(ProjectSource.project_id == project_id).all()
    return sources
