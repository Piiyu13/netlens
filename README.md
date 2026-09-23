# NetLens — AI-Powered Network Intrusion Detection System

Full-stack app: React + Vite frontend, FastAPI + PostgreSQL backend.
This file is the shared entry point for both sides — start here.

## Structure

```
.
├── docker-compose.yml   # one-command full stack (db + api + web)
├── .env.example         # shared env template (copy to .env)
├── frontend/            # React + Vite + Tailwind UI (see frontend/README if present)
│   ├── src/             # pages, components, lib/api.ts (backend client)
│   ├── Dockerfile       # static build served by nginx (proxies /api to backend)
│   └── nginx.conf
└── backend/             # FastAPI + PostgreSQL API (see backend/README.md)
    ├── app/             # routers, models, schemas, JWT auth
    ├── schema.sql       # PostgreSQL DDL source of truth
    └── requirements.txt
```

## Quickstart (one command)

```bash
docker compose up --build
```

- UI: http://localhost:8080 (nginx proxies `/api/*` to the backend)
- API: http://localhost:8000 (health: `/api/health`)
- DB: Postgres 16, internal to the compose network (+ `localhost:5432` not exposed by default)

## Shared configuration (root `.env`)

| Variable       | Used by          | Default / example                                      |
| -------------- | ---------------- | ------------------------------------------------------ |
| `VITE_API_URL` | frontend (build) | empty = same-origin `/api` via nginx proxy            |
| `JWT_SECRET`   | backend          | `change-me-to-a-long-random-string` (must change)      |
| `CORS_ORIGINS` | backend          | `http://localhost:8080,...,http://localhost:5173,...`  |
| `DATABASE_URL` | backend          | `postgresql+psycopg2://netlens:netlens@db:5432/netlens` (compose sets this) |

Copy `.env.example` to `.env` and set a real `JWT_SECRET` before any shared deployment.

## Local dev without Docker

```bash
# terminal 1 — backend
cd backend
python -m venv .venv && source .venv/bin/activate  # windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # edit DATABASE_URL / JWT_SECRET
uvicorn app.main:app --reload --port 8000

# terminal 2 — frontend
cd frontend
npm install
cp ../.env.example .env  # or: VITE_API_URL=http://localhost:8000
npm run dev              # http://localhost:5173
```

## Useful commands

```bash
docker compose up --build      # build + run everything
docker compose down            # stop (keeps DB data in pgdata volume)
docker compose down -v         # stop AND wipe DB data
docker compose logs -f api     # follow backend logs
```

## How the pieces connect

The frontend (`frontend/src/lib/api.ts`) talks to the backend over `VITE_API_URL`
with a JWT stored in `localStorage`. In Docker the variable is empty, so calls go
to same-origin `/api/*` and nginx forwards them to the `api` service — no CORS
involved. Auth (`signup`/`login`/`me`), alerts, devices, packets, logs, reports,
chat, settings, profiles, threat intel, and admin users are all served by the
FastAPI backend, which enforces per-user ownership server-side.
