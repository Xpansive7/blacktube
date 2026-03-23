# BlackTube

Estudio editorial inteligente para producao de conteudo long-form no YouTube.
Dashboard de producao assistida com foco em retencao, narrativa e mineracao de oportunidades.

## Stack

| Layer    | Tech                                         |
|----------|----------------------------------------------|
| Frontend | Next.js 14, TypeScript, Tailwind, shadcn-style |
| Backend  | FastAPI, SQLAlchemy, Pydantic, Alembic       |
| Database | PostgreSQL (SQLite fallback)                 |
| Auth     | JWT + bcrypt                                 |

## Estrutura

```
blacktube/
├── backend/          # FastAPI API
│   ├── app/
│   │   ├── models/       # 10 modelos SQLAlchemy
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── routers/      # 10 routers, 40+ endpoints
│   │   ├── services/     # Narrative Engine, Mining, Voice, Export
│   │   └── seed.py       # Dados iniciais
│   ├── alembic/          # Migrations
│   └── requirements.txt
├── frontend/         # Next.js App
│   └── src/
│       ├── app/          # 15 paginas
│       ├── components/   # 15 componentes (UI + Layout)
│       └── lib/          # API client, Store, Utils
└── README.md
```

## Modulos

1. **Dashboard** - visao geral, stats, projetos recentes
2. **Projetos** - CRUD completo com tipo, modo narrativo, preset visual
3. **Mineracao** - busca de oportunidades via TMDb + YouTube (mock pronto)
4. **Narrative Engine** - geracao de roteiro com 9 modos narrativos
5. **Editor de Roteiro** - edicao por capitulos com acoes (reescrever, intensificar, etc)
6. **Presets Visuais** - templates de estilo visual por projeto
7. **Assets** - biblioteca de midia vinculada a capitulos
8. **Voice Studio** - geracao de locucao por capitulo (TTS placeholder)
9. **Timeline** - composicao visual de capitulos + audio + assets
10. **Export** - JSON, TXT, render plan (FFmpeg)

## Narrative Engine

O nucleo do sistema. Nao gera texto generico - aplica:

- **Schwartz** - niveis de consciencia do publico
- **Kahneman** - emocao primeiro, logica depois
- **Retencao universal** - problema > agitacao > causa real > solucao > conclusao
- **Linguagem** - frases curtas, contraste, tensao
- **Frame control** - o conteudo revela, nao explica

9 modos: padrao, retencao maxima, investigativo, psicologico, filosofico, analise de poder, teoria, explicado simples, autoridade.

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python -m app.seed          # popula dados iniciais
python -m app.main          # http://localhost:8000
```

Docs da API: http://localhost:8000/docs

Login padrao: `lucas@xpansive.com` / `black777`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev -- --port 3010  # http://localhost:3010
```

## Credenciais Padrao

| Campo | Valor |
|-------|-------|
| Email | lucas@xpansive.com |
| Senha | black777 |

## API Keys (opcionais)

O sistema funciona com mock data sem API keys. Para integrar:

- **TMDb**: https://www.themoviedb.org/settings/api
- **YouTube Data API**: https://console.cloud.google.com
- **Pexels**: https://www.pexels.com/api
- **OpenAI**: https://platform.openai.com/api-keys
- **ElevenLabs**: https://elevenlabs.io

Configure na pagina Settings da dashboard ou via `.env`.
