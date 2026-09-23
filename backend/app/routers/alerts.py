from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

VALID_SEVERITIES = {"critical", "high", "medium", "low"}
VALID_STATUSES = {"open", "acknowledged", "resolved", "blocked"}


@router.get("", response_model=list[schemas.AlertOut])
def list_alerts(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    severity: str | None = None,
    status: str | None = None,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(models.Alert).filter(models.Alert.user_id == user.id)
    if severity:
        q = q.filter(models.Alert.severity == severity)
    if status:
        q = q.filter(models.Alert.status == status)
    return q.order_by(models.Alert.created_at.desc()).offset(offset).limit(limit).all()


@router.post("", response_model=list[schemas.AlertOut], status_code=201)
def create_alerts(
    payload: schemas.AlertCreate | list[schemas.AlertCreate],
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = payload if isinstance(payload, list) else [payload]
    rows: list[models.Alert] = []
    for item in items:
        if item.severity not in VALID_SEVERITIES:
            raise HTTPException(status_code=400, detail=f"Invalid severity: {item.severity}")
        if (item.status or "open") not in VALID_STATUSES:
            raise HTTPException(status_code=400, detail=f"Invalid status: {item.status}")
        rows.append(models.Alert(user_id=user.id, **item.model_dump()))
    db.add_all(rows)
    db.commit()
    for r in rows:
        db.refresh(r)
    return rows


@router.patch("/{alert_id}", response_model=schemas.AlertOut)
def update_alert(
    alert_id: UUID,
    payload: schemas.AlertUpdate,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = (
        db.query(models.Alert)
        .filter(models.Alert.id == alert_id, models.Alert.user_id == user.id)
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    data = payload.model_dump(exclude_unset=True)
    if "severity" in data and data["severity"] not in VALID_SEVERITIES:
        raise HTTPException(status_code=400, detail="Invalid severity")
    if "status" in data and data["status"] not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    for k, v in data.items():
        setattr(row, k, v)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{alert_id}", status_code=204)
def delete_alert(
    alert_id: UUID,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = (
        db.query(models.Alert)
        .filter(models.Alert.id == alert_id, models.Alert.user_id == user.id)
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.delete(row)
    db.commit()
    return None
