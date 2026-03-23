"""
Seed data for local demo usage.

This script is intentionally idempotent so the startup script can run it
multiple times without breaking on duplicate records.
"""

from app.database import SessionLocal
from app.models.project import (
    AudienceAwarenessLevelEnum,
    NarrativeModeEnum,
    Project,
    ProjectStatusEnum,
    ProjectTypeEnum,
)
from app.models.script import ChapterTypeEnum, ScriptChapter
from app.models.user import User
from app.models.visual_preset import VisualPreset
from app.routers.auth import hash_password


def seed_database():
    """Populate the database with safe demo data."""
    db = SessionLocal()

    try:
        default_user = db.query(User).filter(User.email == "lucas@xpansive.com").first()
        if default_user is None:
            default_user = User(
                email="lucas@xpansive.com",
                username="lucas",
                hashed_password=hash_password("black777"),
            )
            db.add(default_user)
            db.commit()
            db.refresh(default_user)
            print(f"[OK] Usuario criado: {default_user.email}")
        else:
            print(f"[OK] Usuario ja existe: {default_user.email}")

        presets_data = [
            {
                "name": "Cinematic Dark",
                "style": "cinematic",
                "lighting": "dramatic",
                "color_palette": "#1a1a1a, #ff6b6b, #4ecdc4",
                "contrast": "high",
                "texture": "smooth",
                "composition": "rule_of_thirds",
                "dramatic_intensity": 9,
                "motion_style": "dynamic",
                "is_default": True,
            },
            {
                "name": "Neon Noir",
                "style": "modern",
                "lighting": "harsh",
                "color_palette": "#0a0e27, #ff006e, #00f5ff",
                "contrast": "high",
                "texture": "grainy",
                "composition": "centered",
                "dramatic_intensity": 8,
                "motion_style": "fast",
                "is_default": True,
            },
            {
                "name": "Documentary Classic",
                "style": "documentary",
                "lighting": "soft",
                "color_palette": "#ffffff, #333333, #666666",
                "contrast": "medium",
                "texture": "smooth",
                "composition": "balanced",
                "dramatic_intensity": 4,
                "motion_style": "slow",
                "is_default": True,
            },
            {
                "name": "Minimal Clean",
                "style": "minimal",
                "lighting": "neutral",
                "color_palette": "#ffffff, #000000",
                "contrast": "low",
                "texture": "smooth",
                "composition": "centered",
                "dramatic_intensity": 2,
                "motion_style": "static",
                "is_default": True,
            },
            {
                "name": "Horror Tension",
                "style": "horror",
                "lighting": "dramatic",
                "color_palette": "#1a0000, #ff0000, #330000",
                "contrast": "high",
                "texture": "rough",
                "composition": "asymmetric",
                "dramatic_intensity": 10,
                "motion_style": "jittery",
                "is_default": True,
            },
        ]

        created_presets = 0
        for preset_data in presets_data:
            exists = db.query(VisualPreset).filter(VisualPreset.name == preset_data["name"]).first()
            if exists is not None:
                continue
            db.add(VisualPreset(**preset_data))
            created_presets += 1

        db.commit()
        print(f"[OK] Visual presets inseridos nesta execucao: {created_presets}")

        projects_data = [
            {
                "title": "The Psychology of Manipulation",
                "project_type": ProjectTypeEnum.essay,
                "source_title": "Social Engineering & Persuasion",
                "source_year": 2024,
                "synopsis": "Analise profunda de tecnicas psicologicas de manipulacao usadas em midia, publicidade e politica.",
                "narrative_mode": NarrativeModeEnum.psicologico,
                "audience_awareness_level": AudienceAwarenessLevelEnum.problem_aware,
                "target_duration_minutes": 15,
                "status": ProjectStatusEnum.draft,
            },
            {
                "title": "Why We Make Dumb Financial Decisions",
                "project_type": ProjectTypeEnum.theory,
                "source_title": "Behavioral Economics",
                "source_year": 2024,
                "synopsis": "Framework de economia comportamental explicando por que tomamos decisoes financeiras irracionais.",
                "narrative_mode": NarrativeModeEnum.teoria,
                "audience_awareness_level": AudienceAwarenessLevelEnum.unaware,
                "target_duration_minutes": 12,
                "status": ProjectStatusEnum.draft,
            },
            {
                "title": "The Hidden Power Dynamics in Corporate Culture",
                "project_type": ProjectTypeEnum.documentary,
                "source_title": "Organizational Behavior & Power",
                "source_year": 2024,
                "synopsis": "Investigacao das dinamicas de poder ocultas que moldam a cultura corporativa.",
                "narrative_mode": NarrativeModeEnum.analise_poder,
                "audience_awareness_level": AudienceAwarenessLevelEnum.solution_aware,
                "target_duration_minutes": 18,
                "status": ProjectStatusEnum.draft,
            },
        ]

        created_projects = []
        for project_data in projects_data:
            project = (
                db.query(Project)
                .filter(Project.user_id == default_user.id, Project.title == project_data["title"])
                .first()
            )
            if project is None:
                project = Project(user_id=default_user.id, **project_data)
                db.add(project)
                db.flush()
            created_projects.append(project)

        db.commit()
        print(f"[OK] Projetos disponiveis para demo: {len(created_projects)}")

        example_chapters = [
            {
                "chapter_number": 0,
                "title": "O Anzol",
                "chapter_type": ChapterTypeEnum.hook,
                "content": "Voce acha que sabe o que pensa. Mas e se a maioria dos seus pensamentos fosse implantada por alguem?",
                "duration_seconds": 15,
                "emotional_intensity": 8,
                "retention_notes": "Choque inicial para criar curiosidade imediata",
            },
            {
                "chapter_number": 1,
                "title": "O Problema",
                "chapter_type": ChapterTypeEnum.intro,
                "content": "A psicologia moderna revelou que somos mais previsiveis do que pensamos. E esse conhecimento esta sendo usado contra nos todos os dias.",
                "duration_seconds": 30,
                "emotional_intensity": 6,
                "retention_notes": "Estabelecer a relevancia do problema",
            },
            {
                "chapter_number": 2,
                "title": "As Tecnicas",
                "chapter_type": ChapterTypeEnum.development,
                "content": "Existem 7 tecnicas principais de manipulacao psicologica. Vamos analisar cada uma e entender como reconhece-las.",
                "duration_seconds": 120,
                "emotional_intensity": 7,
                "retention_notes": "Aprofundar com exemplos reais",
            },
            {
                "chapter_number": 3,
                "title": "A Defesa",
                "chapter_type": ChapterTypeEnum.resolution,
                "content": "Saber e metade da batalha. Aqui estao as estrategias para proteger sua mente.",
                "duration_seconds": 60,
                "emotional_intensity": 5,
                "retention_notes": "Empoderar o visualizador",
            },
        ]

        target_project = created_projects[0]
        existing_chapters = db.query(ScriptChapter).filter(ScriptChapter.project_id == target_project.id).count()
        created_chapters = 0

        if existing_chapters == 0:
            for chapter_data in example_chapters:
                db.add(ScriptChapter(project_id=target_project.id, **chapter_data))
                created_chapters += 1
            db.commit()

        print(f"[OK] Capitulos inseridos nesta execucao: {created_chapters}")
        print("\n[OK] Seed concluido com sucesso")
        print("   Usuario: lucas@xpansive.com / black777")
        print(f"   Projetos disponiveis: {len(created_projects)}")

    except Exception as exc:
        db.rollback()
        print(f"[ERRO] Erro ao fazer seed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
