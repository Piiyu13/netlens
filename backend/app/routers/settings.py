from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/settings", tags=["settings"])

ALLOWED_THEMES = {"dark", "light"}
ALLOWED_SENSITIVITY = {"low", "medium", "high"}


@router.get("", response_model=schemas.SettingsOut)
def get_settings(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    s = db.query(models.UserSettings).filter(models.UserSettings.user_id == user.id).first()
    if not s:
        s = models.UserSettings(user_id=user.id)
        db.add(s)
        db.commit()
        db.refresh(s)
    return s


@router.put("", response_model=schemas.SettingsOut)
def update_settings(
    payload: schemas.SettingsUpdate,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    s = db.query(models.UserSettings).filter(models.UserSettings.user_id == user.id).first()
    if not s:
        s = models.UserSettings(user_id=user.id)
        db.add(s)
        db.commit()
        db.refresh(s)
    data = payload.model_dump(exclude_unset=True)
    if "theme" in data and data["theme"] not in ALLOWED_THEMES:
        raise HTTPException(status_code=400, detail="Invalid theme")
    if "ai_sensitivity" in data and data["ai_sensitivity"] not in ALLOWED_SENSITIVITY:
        raise HTTPException(status_code=400, detail="Invalid ai_sensitivity")
    for k, v in data.items():
        setattr(s, k, v)
    db.commit()
    db.refresh(s)
    return s
