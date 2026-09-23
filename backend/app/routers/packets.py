from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/packets", tags=["packets"])


@router.get("", response_model=list[schemas.PacketOut])
def list_packets(
    limit: int = Query(200, ge=1, le=500),
    offset: int = Query(0, ge=0),
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Packet)
        .filter(models.Packet.user_id == user.id)
        .order_by(models.Packet.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.post("", response_model=list[schemas.PacketOut], status_code=201)
def create_packets(
    payload: schemas.PacketCreate | list[schemas.PacketCreate],
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = payload if isinstance(payload, list) else [payload]
    rows = [models.Packet(user_id=user.id, **item.model_dump()) for item in items]
    db.add_all(rows)
    db.commit()
    for r in rows:
        db.refresh(r)
    return rows
