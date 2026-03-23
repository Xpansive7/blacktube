# BlackTube Backend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd backend/
pip install -r requirements.txt
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your settings if needed
```

### 3. Run Server

```bash
python -m app.main
```

The server will:
- Create database tables automatically
- Seed demo data on first run
- Be available at http://localhost:8000

### 4. Access Documentation

- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Complete File Structure

```
backend/
├── .env.example              # Environment variables template
├── alembic.ini               # Alembic configuration
├── requirements.txt          # Python dependencies
├── README.md                 # Full documentation
├── SETUP.md                  # This file
│
├── alembic/                  # Database migrations
│   ├── env.py               # Migration environment
│   └── versions/
│       └── 001_initial_schema.py  # Initial schema
│
└── app/
    ├── __init__.py
    ├── main.py              # FastAPI app with routers
    ├── config.py            # Settings/configuration
    ├── database.py          # SQLAlchemy setup
    ├── seed.py              # Seed data (demo user, projects)
    │
    ├── models/              # SQLAlchemy ORM models
    │   ├── __init__.py
    │   ├── user.py          # User model
    │   ├── project.py       # Project + ProjectSource
    │   ├── mining.py        # MiningResult
    │   ├── script.py        # ScriptChapter
    │   ├── visual_preset.py # VisualPreset
    │   ├── asset.py         # Asset (images, videos)
    │   ├── voice.py         # VoiceSegment (narration)
    │   ├── export.py        # ExportJob
    │   └── api_settings.py  # APISettings (keys)
    │
    ├── schemas/             # Pydantic request/response schemas
    │   ├── __init__.py
    │   ├── user.py
    │   ├── project.py
    │   ├── mining.py
    │   ├── script.py
    │   ├── visual_preset.py
    │   ├── asset.py
    │   ├── voice.py
    │   └── export.py
    │
    ├── routers/             # API route handlers
    │   ├── __init__.py
    │   ├── auth.py          # Login, register, JWT
    │   ├── projects.py      # Project CRUD
    │   ├── mining.py        # Mining search
    │   ├── scripts.py       # Script generation (uses Narrative Engine)
    │   ├── presets.py       # Visual presets
    │   ├── assets.py        # Asset management
    │   ├── voice.py         # Voice/TTS
    │   ├── timeline.py      # Timeline visualization
    │   └── export.py        # Exports (JSON, TXT, render plans)
    │
    └── services/            # Business logic
        ├── __init__.py
        ├── narrative_engine.py   # THE CORE - narrative generation
        │   - 9 narrative modes
        │   - Schwartz awareness levels
        │   - Emotional structure (Kahneman)
        │   - Universal retention pattern
        │
        ├── mining_service.py     # Content opportunity mining
        │   - TMDb integration (ready for API)
        │   - YouTube integration (ready for API)
        │   - Opportunity scoring algorithm
        │   - Mock data for MVP
        │
        ├── voice_service.py      # Text-to-Speech
        │   - ElevenLabs integration (ready for API)
        │   - Voice model selection
        │   - Duration estimation
        │   - Mock data for MVP
        │
        └── export_service.py     # Export formats
            - JSON export
            - TXT script export
            - DaVinci Resolve/Premiere render plans
            - Project statistics
```

## Total Files: 47

**Breakdown:**
- Models: 10 files (9 models + __init__)
- Schemas: 9 files (8 schemas + __init__)
- Routers: 10 files (9 routers + __init__)
- Services: 5 files (4 services + __init__)
- Core: 6 files (main, config, database, seed, .env.example, README)
- Alembic: 4 files (env, migration, 2x __init__)

## Database

### Automatic Initialization
Tables are created automatically on first startup via SQLAlchemy.

### Manual Migration (Optional)
```bash
alembic upgrade head
```

### Seed Data (Automatic)
Runs on startup. Includes:
- Default user: lucas@xpansive.com / black777
- 5 visual presets
- 3 example projects

## Testing the Backend

### Test with curl:

```bash
# Health check
curl http://localhost:8000/health

# Register new user
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lucas@xpansive.com",
    "password": "black777"
  }'

# Generate narrative script for a project
# (after getting project ID and token from previous steps)
```

### Test with Python:

```python
import requests

BASE_URL = "http://localhost:8000"

# Login
response = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "lucas@xpansive.com",
    "password": "black777"
})
token = response.json()["access_token"]

headers = {"Authorization": f"Bearer {token}"}

# List projects
projects = requests.get(f"{BASE_URL}/projects", headers=headers).json()

# Generate script
if projects:
    project_id = projects[0]["id"]
    result = requests.post(
        f"{BASE_URL}/scripts/generate/{project_id}",
        headers=headers
    ).json()
    print(result)
```

## Troubleshooting

### ModuleNotFoundError
```bash
pip install -r requirements.txt
```

### Database connection error
- Check `.env` DATABASE_URL
- Default uses SQLite: `sqlite:///./blacktube.db`
- For PostgreSQL: `postgresql://user:password@localhost:5432/blacktube`

### Port 8000 already in use
```bash
# Change port in .env or run on different port
python -m app.main --port 8001
```

## Production Notes

1. **Security**:
   - Change SECRET_KEY in .env
   - Use PostgreSQL instead of SQLite
   - Enable HTTPS/SSL
   - Implement rate limiting
   - Add API key authentication

2. **APIs**:
   - Add real TMDb API integration
   - Add real YouTube API integration
   - Add ElevenLabs for voice generation
   - Add image generation (DALL-E, Midjourney)

3. **Deployment**:
   - Use Docker
   - Deploy to Kubernetes/ECS
   - Use managed database
   - Add CDN for assets
   - Monitor with Sentry + Datadog

## Support

For issues or questions, refer to:
- README.md - Full documentation
- app/services/narrative_engine.py - Core narrative logic
- app/routers/*.py - Endpoint documentation

