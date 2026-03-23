from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from app.config import get_settings
from app.models.base import Base

settings = get_settings()

# Detecta se está usando SQLite ou PostgreSQL
db_url = settings.database_url

if "postgresql" in db_url:
    # PostgreSQL
    engine = create_engine(
        db_url,
        echo=settings.debug,
        pool_size=10,
        max_overflow=20,
    )
else:
    # SQLite (fallback)
    engine = create_engine(
        db_url,
        echo=settings.debug,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Session:
    """Dependency para obter sessão do banco de dados"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
