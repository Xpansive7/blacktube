"""
Alembic environment configuration for database migrations.
"""

import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Import config and models
from app.config import get_settings
from app.models.user import Base as UserBase
from app.models.project import Base as ProjectBase
from app.models.mining import Base as MiningBase
from app.models.script import Base as ScriptBase
from app.models.visual_preset import Base as PresetBase
from app.models.asset import Base as AssetBase
from app.models.voice import Base as VoiceBase
from app.models.export import Base as ExportBase
from app.models.api_settings import Base as APISettingsBase

# Get Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set SQLAlchemy URL from environment
settings = get_settings()
config.set_main_option("sqlalchemy.url", settings.database_url)

# Setup target metadata from all models
target_metadata = UserBase.metadata
target_metadata.merge(ProjectBase.metadata)
target_metadata.merge(MiningBase.metadata)
target_metadata.merge(ScriptBase.metadata)
target_metadata.merge(PresetBase.metadata)
target_metadata.merge(AssetBase.metadata)
target_metadata.merge(VoiceBase.metadata)
target_metadata.merge(ExportBase.metadata)
target_metadata.merge(APISettingsBase.metadata)


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
