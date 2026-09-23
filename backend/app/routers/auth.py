from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user
from ..security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _ensure_settings(db: Session, user_id) -> models.UserSettings:
    s = db.query(models.UserSettings).filter(models.UserSettings.user_id == user_id).first()
    if not s:
        s = models.UserSettings(user_id=user_id)
        db.add(s)
        db.commit()
        db.refresh(s)
    return s


@router.post("/signup", response_model=schemas.TokenOut, status_code=201)
def signup(payload: schemas.SignupIn, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        full_name=payload.full_name or "",
        role="analyst",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    _ensure_settings(db, user.id)
    return {"access_token": create_access_token(str(user.id)), "token_type": "bearer"}


@router.post("/login", response_model=schemas.TokenOut)
def login(payload: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return {"access_token": create_access_token(str(user.id)), "token_type": "bearer"}


@router.get("/me", response_model=schemas.MeOut)
def me(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _ensure_settings(db, user.id)
    return {"user": user, "profile": user}
