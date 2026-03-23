"""Initial database schema for BlackTube

Revision ID: 001
Revises:
Create Date: 2024-03-20 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create initial database schema"""
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('username', sa.String(100), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)

    # Create visual_presets table
    op.create_table(
        'visual_presets',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('style', sa.String(100)),
        sa.Column('lighting', sa.String(100)),
        sa.Column('color_palette', sa.String(255)),
        sa.Column('contrast', sa.String(50)),
        sa.Column('texture', sa.String(100)),
        sa.Column('composition', sa.String(100)),
        sa.Column('dramatic_intensity', sa.Integer(), default=5),
        sa.Column('motion_style', sa.String(100)),
        sa.Column('prompt_base', sa.Text()),
        sa.Column('is_default', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create projects table
    op.create_table(
        'projects',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('project_type', sa.String(50), nullable=False),
        sa.Column('source_title', sa.String(255)),
        sa.Column('source_year', sa.Integer()),
        sa.Column('synopsis', sa.Text()),
        sa.Column('notes', sa.Text()),
        sa.Column('output_language', sa.String(10), default='pt-BR'),
        sa.Column('target_duration_minutes', sa.Integer(), default=15),
        sa.Column('narrative_mode', sa.String(50), default='padrao'),
        sa.Column('audience_awareness_level', sa.String(50), default='unaware'),
        sa.Column('visual_preset_id', postgresql.UUID(as_uuid=True)),
        sa.Column('status', sa.String(50), default='draft'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['visual_preset_id'], ['visual_presets.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create project_sources table
    op.create_table(
        'project_sources',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('source_type', sa.String(50), nullable=False),
        sa.Column('external_id', sa.String(255)),
        sa.Column('title', sa.String(255)),
        sa.Column('url', sa.String(500)),
        sa.Column('metadata_json', sa.JSON()),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create mining_results table
    op.create_table(
        'mining_results',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('query', sa.String(255), nullable=False),
        sa.Column('genre', sa.String(100)),
        sa.Column('year_from', sa.Integer()),
        sa.Column('year_to', sa.Integer()),
        sa.Column('content_type', sa.String(50)),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('year', sa.Integer()),
        sa.Column('synopsis', sa.Text()),
        sa.Column('tmdb_id', sa.String(50)),
        sa.Column('tmdb_rating', sa.Float()),
        sa.Column('yt_video_count', sa.Integer()),
        sa.Column('yt_avg_views', sa.Float()),
        sa.Column('yt_avg_comments', sa.Float()),
        sa.Column('opportunity_score', sa.Float(), default=0.0),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create script_chapters table
    op.create_table(
        'script_chapters',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('chapter_number', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('chapter_type', sa.String(50), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('duration_seconds', sa.Integer()),
        sa.Column('emotional_intensity', sa.Integer(), default=5),
        sa.Column('retention_notes', sa.Text()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create assets table
    op.create_table(
        'assets',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('chapter_id', postgresql.UUID(as_uuid=True)),
        sa.Column('asset_type', sa.String(50), nullable=False),
        sa.Column('source', sa.String(50), nullable=False),
        sa.Column('file_path', sa.String(500)),
        sa.Column('url', sa.String(500)),
        sa.Column('prompt_used', sa.Text()),
        sa.Column('duration_seconds', sa.Float()),
        sa.Column('metadata_json', sa.JSON()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.ForeignKeyConstraint(['chapter_id'], ['script_chapters.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create voice_segments table
    op.create_table(
        'voice_segments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('chapter_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('audio_path', sa.String(500)),
        sa.Column('duration_seconds', sa.Float()),
        sa.Column('voice_model', sa.String(100), default='mock'),
        sa.Column('status', sa.String(50), default='pending'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.ForeignKeyConstraint(['chapter_id'], ['script_chapters.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create export_jobs table
    op.create_table(
        'export_jobs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('export_type', sa.String(50), nullable=False),
        sa.Column('status', sa.String(50), default='pending'),
        sa.Column('output_path', sa.String(500)),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime()),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create api_settings table
    op.create_table(
        'api_settings',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('service', sa.String(50), nullable=False),
        sa.Column('api_key', sa.String(500), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Drop all tables"""
    op.drop_table('api_settings')
    op.drop_table('export_jobs')
    op.drop_table('voice_segments')
    op.drop_table('assets')
    op.drop_table('script_chapters')
    op.drop_table('mining_results')
    op.drop_table('project_sources')
    op.drop_table('projects')
    op.drop_table('visual_presets')
    op.drop_table('users')
