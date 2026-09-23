# NetLens Backend — FastAPI + PostgreSQL

Replaces Supabase (auth + Postgres + RLS) with a self-hosted FastAPI service.

## 1. Start Postgres

```bash
# option A: docker
docker compose up -d db
# option B: local postgres, then:
createdb netlens
psql postgresql://netlens:netlens@localhost:5432/netlens -f schema.sql
```

## 2. Run the API

```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # edit DATABASE_URL / JWT_SECRET
uvicorn app.main:app --reload --port 8000
```

Tables are also auto-created on startup via `Base.metadata.create_all`
(use `schema.sql` as the source of truth for production DDL).

Health check: `GET http://localhost:8000/api/health`

## 3. Point the frontend at it

```bash
# project root .env
VITE_API_URL=http://localhost:8000
```

## Auth

JWT bearer tokens (`Authorization: Bearer <token>`):

- `POST /api/auth/signup` `{email, password, full_name}` → `{access_token}`
- `POST /api/auth/login` `{email, password}` → `{access_token}`
- `GET /api/auth/me` → `{user, profile}`

Passwords are bcrypt-hashed. All `/api/*` routes except signup/login/health
require the token; rows are owner-scoped by `user_id` server-side
(replaces Supabase RLS policies).

## Endpoints

- Profiles: `GET/PUT /api/profiles/me`
- Settings: `GET/PUT /api/settings`
- Alerts: `GET/POST /api/alerts`, `PATCH/DELETE /api/alerts/{id}`
- Devices: `GET/POST /api/devices`, `PATCH/DELETE /api/devices/{id}`
- Packets: `GET/POST /api/packets`
- Logs: `GET/POST /api/logs`
- Reports: `GET/POST /api/reports`
- Chat: `GET/POST /api/chat`
- Threat intel (global): `GET/POST /api/threat-intel`
- Users (admin): `GET /api/users`, `PATCH /api/users/{id}`
