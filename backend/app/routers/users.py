from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user, require_admin

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=list[schemas.UserOut])
def list_users(
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(models.User).order_by(models.User.created_at.desc()).limit(200).all()


@router.patch("/{user_id}", response_model=schemas.UserOut)
def update_user(
    user_id: UUID,
    payload: schemas.AdminUserUpdate,
    admin: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    row = db.query(models.User).filter(models.User.id == user_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(row, k, v)
    db.commit()
    db.refresh(row)
    return row
