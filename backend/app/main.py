"""
BlackTube Backend - FastAPI application entrypoint.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import engine
from app.models.api_settings import Base as APISettingsBase
from app.models.asset import Base as AssetBase
from app.models.export import Base as ExportBase
from app.models.mining import Base as MiningBase
from app.models.project import Base as ProjectBase
from app.models.script import Base as ScriptBase
from app.models.user import Base as UserBase
from app.models.visual_preset import Base as PresetBase
from app.models.voice import Base as VoiceBase
from app.routers import assets, auth, export, mining, presets, projects, scripts, settings as api_settings, timeline, voice

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown logic."""
    print("[INFO] BlackTube Backend iniciando...")

    UserBase.metadata.create_all(bind=engine)
    ProjectBase.metadata.create_all(bind=engine)
    MiningBase.metadata.create_all(bind=engine)
    ScriptBase.metadata.create_all(bind=engine)
    PresetBase.metadata.create_all(bind=engine)
    AssetBase.metadata.create_all(bind=engine)
    VoiceBase.metadata.create_all(bind=engine)
    ExportBase.metadata.create_all(bind=engine)
    APISettingsBase.metadata.create_all(bind=engine)

    print("[OK] Banco de dados inicializado")
    yield
    print("[INFO] BlackTube Backend desligando...")


app = FastAPI(
    title=settings.app_name,
    description="YouTube Content Production Studio Dashboard - Retention, Narrative & Opportunity Mining",
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
    }


@app.get("/")
def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "description": "YouTube Content Production Studio Dashboard",
        "docs": "/docs",
        "openapi": "/openapi.json",
    }


app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(mining.router)
app.include_router(scripts.router)
app.include_router(presets.router)
app.include_router(assets.router)
app.include_router(voice.router)
app.include_router(timeline.router)
app.include_router(export.router)
app.include_router(api_settings.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
    )
