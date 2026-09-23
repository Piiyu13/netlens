from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/threat-intel", tags=["threat-intel"])


@router.get("", response_model=list[schemas.ThreatIntelOut])
def list_threat_intel(
    intel_type: str | None = None,
    limit: int = Query(200, ge=1, le=500),
    offset: int = Query(0, ge=0),
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(models.ThreatIntel)
    if intel_type:
        q = q.filter(models.ThreatIntel.intel_type == intel_type)
    return q.order_by(models.ThreatIntel.created_at.desc()).offset(offset).limit(limit).all()


@router.post("", response_model=schemas.ThreatIntelOut, status_code=201)
def create_threat_intel(
    payload: schemas.ThreatIntelCreate,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = models.ThreatIntel(**payload.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row
