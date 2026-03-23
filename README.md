---
title: BlackTube Backend
emoji: 🎬
colorFrom: gray
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# BlackTube Backend

FastAPI backend for the BlackTube dashboard.

## Required secrets

- `SECRET_KEY`
- `PEXELS_API_KEY`

## Optional secrets

- `DATABASE_URL`
- `TMDB_API_KEY`
- `YOUTUBE_API_KEY`
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `CORS_ALLOW_ORIGINS`
- `SEED_DEMO_DATA`

## Suggested quick-start values

- `CORS_ALLOW_ORIGINS=https://black7tube.netlify.app`
- `SEED_DEMO_DATA=true`

If `DATABASE_URL` is not set, the app falls back to local SQLite inside the Space.

