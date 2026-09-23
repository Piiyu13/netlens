from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/profiles", tags=["profiles"])


@router.get("/me", response_model=schemas.UserOut)
def get_my_profile(user: models.User = Depends(get_current_user)):
    return user


@router.put("/me", response_model=schemas.UserOut)
def update_my_profile(
    payload: schemas.ProfileUpdate,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current = db.query(models.User).filter(models.User.id == user.id).first()
    assert current is not None
    for field in ("full_name", "phone", "organization", "avatar_url"):
        value = getattr(payload, field)
        if value is not None:
            setattr(current, field, value)
    current.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current)
    return current
