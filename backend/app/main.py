from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routers import (
    alerts,
    auth,
    chat,
    devices,
    logs,
    packets,
    profiles,
    reports,
    settings as settings_router,
    threat_intel,
    users,
)

# Import models so Base.metadata is populated
from . import models  # noqa: F401

app = FastAPI(title="NetLens API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(settings_router.router)
app.include_router(alerts.router)
app.include_router(devices.router)
app.include_router(packets.router)
app.include_router(logs.router)
app.include_router(reports.router)
app.include_router(chat.router)
app.include_router(threat_intel.router)
app.include_router(users.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.on_event("startup")
def on_startup():
    # Create tables if they do not exist (use schema.sql for production/DDL control)
    Base.metadata.create_all(bind=engine)
