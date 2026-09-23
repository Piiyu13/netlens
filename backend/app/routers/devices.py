from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/devices", tags=["devices"])


@router.get("", response_model=list[schemas.DeviceOut])
def list_devices(
    limit: int = Query(200, ge=1, le=500),
    offset: int = Query(0, ge=0),
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Device)
        .filter(models.Device.user_id == user.id)
        .order_by(models.Device.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.post("", response_model=list[schemas.DeviceOut], status_code=201)
def create_devices(
    payload: schemas.DeviceCreate | list[schemas.DeviceCreate],
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = payload if isinstance(payload, list) else [payload]
    rows = [models.Device(user_id=user.id, **item.model_dump()) for item in items]
    db.add_all(rows)
    db.commit()
    for r in rows:
        db.refresh(r)
    return rows


@router.patch("/{device_id}", response_model=schemas.DeviceOut)
def update_device(
    device_id: UUID,
    payload: schemas.DeviceUpdate,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = (
        db.query(models.Device)
        .filter(models.Device.id == device_id, models.Device.user_id == user.id)
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="Device not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(row, k, v)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{device_id}", status_code=204)
def delete_device(
    device_id: UUID,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = (
        db.query(models.Device)
        .filter(models.Device.id == device_id, models.Device.user_id == user.id)
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(row)
    db.commit()
    return None
