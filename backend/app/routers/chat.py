from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.get("", response_model=list[schemas.ChatOut])
def list_chat(
    limit: int = Query(200, ge=1, le=500),
    offset: int = Query(0, ge=0),
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.ChatMessage)
        .filter(models.ChatMessage.user_id == user.id)
        .order_by(models.ChatMessage.created_at.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.post("", response_model=schemas.ChatOut, status_code=201)
def create_chat(
    payload: schemas.ChatCreate,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = models.ChatMessage(user_id=user.id, **payload.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row
