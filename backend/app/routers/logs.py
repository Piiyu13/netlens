from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/logs", tags=["logs"])


@router.get("", response_model=list[schemas.LogOut])
def list_logs(
    limit: int = Query(200, ge=1, le=500),
    offset: int = Query(0, ge=0),
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(models.Log)
        .filter(models.Log.user_id == user.id)
        .order_by(models.Log.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [
        schemas.LogOut(
            id=r.id,
            user_id=r.user_id,
            log_type=r.log_type,
            level=r.level,
            message=r.message,
            source=r.source,
            ip_address=r.ip_address,
            metadata=r.meta,
            created_at=r.created_at,
        )
        for r in rows
    ]


@router.post("", response_model=list[schemas.LogOut], status_code=201)
def create_logs(
    payload: schemas.LogCreate | list[schemas.LogCreate],
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = payload if isinstance(payload, list) else [payload]
    rows = [
        models.Log(user_id=user.id, log_type=i.log_type, level=i.level or "info",
                   message=i.message, source=i.source, ip_address=i.ip_address, meta=i.metadata)
        for i in items
    ]
    db.add_all(rows)
    db.commit()
    for r in rows:
        db.refresh(r)
    return [
        schemas.LogOut(
            id=r.id, user_id=r.user_id, log_type=r.log_type, level=r.level,
            message=r.message, source=r.source, ip_address=r.ip_address,
            metadata=r.meta, created_at=r.created_at,
        )
        for r in rows
    ]
