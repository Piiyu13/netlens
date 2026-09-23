from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("", response_model=list[schemas.ReportOut])
def list_reports(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Report)
        .filter(models.Report.user_id == user.id)
        .order_by(models.Report.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.post("", response_model=schemas.ReportOut, status_code=201)
def create_report(
    payload: schemas.ReportCreate,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = models.Report(user_id=user.id, **payload.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row
