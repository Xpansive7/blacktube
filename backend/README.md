# BlackTube Backend

YouTube Content Production Studio Dashboard focused on retention, narrative, and opportunity mining.

**NOT a video generator** - this is a comprehensive studio dashboard for planning, structuring, and optimizing video content using AI-powered narrative generation.

## Stack

- **FastAPI** - Modern async web framework
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation and serialization
- **PostgreSQL** - Primary database (SQLite fallback)
- **Alembic** - Database migrations
- **JWT** - Authentication with jose
- **Bcrypt** - Password hashing

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run migrations (optional - tables created on startup)
alembic upgrade head

# Seed database with demo data
python -m app.seed

# Run server
python -m app.main
```

## Running the Server

```bash
# Development mode (auto-reload)
python -m app.main

# Or with uvicorn directly
uvicorn app.main:app --reload
```

Server will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app, CORS, routers
│   ├── config.py                # Settings from .env
│   ├── database.py              # SQLAlchemy setup
│   ├── seed.py                  # Demo data seeding
│   ├── models/                  # SQLAlchemy models
│   ├── schemas/                 # Pydantic validation schemas
│   ├── routers/                 # API route handlers
│   └── services/                # Business logic
│       ├── narrative_engine.py  # CORE - narrative generation
│       ├── mining_service.py    # TMDb/YouTube mining
│       ├── voice_service.py     # TTS placeholder
│       └── export_service.py    # JSON/TXT/render export
├── alembic/                     # Database migrations
├── requirements.txt
├── .env.example
└── README.md
```

## Core Services

### 1. Narrative Engine (THE CORE)

Generates complete video scripts using:

- **9 Narrative Modes**: padrao, retencao_maxima, investigativo, psicologico, filosofico, analise_poder, teoria, explicado_simples, autoridade
- **Schwartz Awareness Levels**: unaware → problem_aware → solution_aware → product_aware
- **Emotional Structure**: Based on Kahneman (emotion first, logic after)
- **Universal Retention Pattern**: Problem → Agitation → Real Cause → Solution → Conclusion

**Example:**

```python
from app.services.narrative_engine import NarrativeEngine, NarrativeMode, AwarenessLevel

engine = NarrativeEngine()
narrative = engine.generate_narrative(
    theme="The Psychology of Manipulation",
    narrative_mode=NarrativeMode.PSICOLOGICO,
    awareness_level=AwarenessLevel.PROBLEM_AWARE,
    target_duration_minutes=15
)

# Output includes:
# - hook: Opening hook (10-25 seconds)
# - intro: Problem setup + agitation
# - chapters[]: Structured content with emotional intensity
# - conclusion: Key takeaways
# - cta: Call-to-action
# - metadata: Duration, word count, structure info
```

### 2. Mining Service

Searches for content opportunities in TMDb and YouTube:

```python
from app.services.mining_service import MiningService

service = MiningService()
results = service.search(
    query="psychology",
    genre="documentary",
    year_from=2020
)

# Returns list of opportunities with:
# - title, year, synopsis
# - tmdb_rating
# - yt_video_count, yt_avg_views, yt_avg_comments
# - opportunity_score (0-100)
```

**Opportunity Score Calculation:**
- 40% Quality (TMDb rating)
- 20% Volume (Number of videos)
- 40% Engagement (Views + Comments)

### 3. Voice Service

Text-to-speech with ElevenLabs (mock for MVP):

```python
from app.services.voice_service import VoiceService

service = VoiceService()
result = service.generate_voice(
    text="Your narration here",
    voice_model="lucas_pt",  # Portuguese BR narrator
    language="pt-BR"
)
# Returns: audio_path, duration_seconds, status
```

### 4. Export Service

Exports projects in multiple formats:

```python
from app.services.export_service import ExportService

service = ExportService()

# Export as JSON (for collaboration/import)
json_output = service.export_to_json(project_data)

# Export as TXT (formatted script)
txt_output = service.export_to_txt(title, chapters)

# Export render plan (for DaVinci Resolve, Premiere)
render_plan = service.export_to_render_plan(title, chapters, assets, voices)
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Projects
- `POST /projects` - Create project
- `GET /projects` - List user's projects
- `GET /projects/{id}` - Get project details
- `PATCH /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

### Scripts (Core narrative generation)
- `POST /scripts/generate/{project_id}` - Generate full script
- `GET /scripts/{project_id}/chapters` - List chapters
- `POST /scripts/{project_id}/chapters` - Create chapter
- `PATCH /scripts/chapters/{id}` - Update chapter

### Mining
- `POST /mining/search` - Search for content opportunities
- `GET /mining/results` - List mining results
- `GET /mining/opportunity/high` - Get high-opportunity content

### Voice
- `POST /voice/generate/{chapter_id}` - Generate narration
- `GET /voice/available-models` - List available voices
- `GET /voice/{project_id}/segments` - List voice segments

### Assets
- `POST /assets/{project_id}` - Create asset
- `GET /assets/{project_id}` - List project assets
- `PATCH /assets/asset/{id}` - Update asset

### Visual Presets
- `POST /presets` - Create visual preset
- `GET /presets` - List presets
- `PATCH /presets/{id}` - Update preset

### Timeline
- `GET /timeline/{project_id}` - Get complete timeline
- `GET /timeline/{project_id}/summary` - Timeline summary
- `POST /timeline/{project_id}/validate` - Validate readiness

### Export
- `POST /export/{project_id}/json` - Export as JSON
- `POST /export/{project_id}/txt` - Export as TXT
- `POST /export/{project_id}/render-plan` - Export render plan
- `GET /export/{project_id}/stats` - Get project statistics

## Database Models

### Core Models
- **User** - Authentication and ownership
- **Project** - Main project container
- **ProjectSource** - Links to TMDb/YouTube sources
- **ScriptChapter** - Individual chapters with narrative structure
- **VisualPreset** - Reusable visual styling templates

### Content Models
- **Asset** - Images, videos, overlays, transitions
- **VoiceSegment** - Narration with TTS status
- **MiningResult** - Opportunity research data

### Infrastructure Models
- **APISettings** - User API keys for external services
- **ExportJob** - Export history and status tracking

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/blacktube
# DATABASE_URL=sqlite:///./blacktube.db  # Fallback

# JWT
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# External APIs (optional - mock mode works without)
TMDB_API_KEY=your_key
YOUTUBE_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
```

## Default Seed Data

Runs automatically on startup. Includes:

**User:**
- Email: `lucas@xpansive.com`
- Password: `black777`

**Visual Presets (5):**
- Cinematic Dark
- Neon Noir
- Documentary Classic
- Minimal Clean
- Horror Tension

**Sample Projects (3):**
- The Psychology of Manipulation
- Why We Make Dumb Financial Decisions
- The Hidden Power Dynamics in Corporate Culture

## Features

✅ Complete JWT authentication
✅ Full CRUD for projects and content
✅ 9-mode narrative generation engine
✅ Opportunity scoring algorithm
✅ Timeline visualization
✅ Multiple export formats
✅ Voice generation placeholder
✅ Asset management
✅ Mock data for MVP (no external APIs required)
✅ SQLite fallback (no PostgreSQL needed for testing)

## Development Notes

- All routes work with mock data even without external APIs
- JWT tokens expire after 30 minutes (configurable)
- Database auto-creates tables on startup
- Seed data includes demo user and 3 example projects
- Services designed for easy integration with real APIs

## Next Steps for Production

1. **Database**: Use PostgreSQL instead of SQLite
2. **Authentication**: Implement OAuth2 with proper scopes
3. **APIs**: Integrate real TMDb, YouTube, ElevenLabs APIs
4. **Image Generation**: Add AI image generation (DALL-E, Midjourney)
5. **Video Rendering**: Integrate with FFmpeg or render farms
6. **Deployment**: Docker, Kubernetes, CDN for assets
7. **Monitoring**: Sentry for errors, Datadog for metrics
8. **Rate Limiting**: Implement per-user API quotas

## License

Proprietary - XPansive 777
