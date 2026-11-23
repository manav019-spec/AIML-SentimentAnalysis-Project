"""Auth endpoints — scrypt + HS256 JWT, following the online project's design."""
import logging
import re
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.ext.models import SavedReport, User
from app.ext.security import (
    RateLimiter, TokenError, burn_password_check, decode_token, hash_password,
    issue_token_pair, verify_password,
)

log = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])
_bearer = HTTPBearer(auto_error=False)

_EMAIL_RE = re.compile(r"^[^@\s]{1,64}@[^@\s]+\.[^@\s]{2,}$")
_login_failures = RateLimiter(limit=8, window=15 * 60)
_register_limit = RateLimiter(limit=10, window=60 * 60)


def api_error(status: int, error_type: str, message: str) -> HTTPException:
    return HTTPException(status_code=status, detail={"type": error_type, "message": message})


def _ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


def _clean_email(email: str) -> str:
    email = (email or "").strip().lower()
    if not _EMAIL_RE.match(email) or len(email) > 255:
        raise api_error(400, "INVALID_EMAIL", "Please enter a valid email address.")
    return email


def _check_password_strength(password: str) -> None:
    if len(password) < settings.MIN_PASSWORD_LENGTH:
        raise api_error(400, "WEAK_PASSWORD",
                        f"Password must be at least {settings.MIN_PASSWORD_LENGTH} characters.")
    if len(password) > 200:
        raise api_error(400, "WEAK_PASSWORD", "Password is too long.")


def user_public(db: Session, user: User) -> dict:
    count = db.query(func.count(SavedReport.id)).filter(SavedReport.user_id == user.id).scalar() or 0
    return {
        "id": user.id, "name": user.name, "email": user.email, "avatar": user.avatar_url,
        "provider": "google" if user.google_id and not user.password_hash else "email",
        "analysesCount": count,
        "isAdmin": user.email in settings.ADMIN_EMAILS,
        "createdAt": user.created_at.isoformat() if user.created_at else None,
    }


def _session(db: Session, user: User) -> dict:
    return {**issue_token_pair(user), "user": user_public(db, user)}


def get_current_user(creds: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
                     db: Session = Depends(get_db)) -> User:
    if creds is None:
        raise api_error(401, "UNAUTHORIZED", "Please sign in to continue.")
    try:
        payload = decode_token(creds.credentials, "access")
    except TokenError as exc:
        raise api_error(401, "TOKEN_EXPIRED" if exc.expired else "UNAUTHORIZED",
                        "Your session has expired." if exc.expired else "Invalid session.")
    user = db.get(User, int(payload["sub"]))
    if user is None or user.token_version != payload.get("tv"):
        raise api_error(401, "UNAUTHORIZED", "Invalid session.")
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.email not in settings.ADMIN_EMAILS:
        raise api_error(403, "FORBIDDEN", "Admins only.")
    return user


class RegisterBody(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., max_length=255)
    password: str = Field(..., max_length=200)


class LoginBody(BaseModel):
    email: str = Field(..., max_length=255)
    password: str = Field(..., max_length=200)


class RefreshBody(BaseModel):
    refresh_token: str


class UpdateProfileBody(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class ChangePasswordBody(BaseModel):
    current_password: Optional[str] = Field(None, max_length=200)
    new_password: str = Field(..., max_length=200)


@router.post("/register")
def register(body: RegisterBody, request: Request, db: Session = Depends(get_db)):
    if not _register_limit.allow(_ip(request)):
        raise api_error(429, "TOO_MANY_REQUESTS", "Too many sign-ups from this network. Try later.")
    email = _clean_email(body.email)
    name = body.name.strip()
    if not name:
        raise api_error(400, "INVALID_NAME", "Please enter your name.")
    _check_password_strength(body.password)

    if db.query(User).filter(User.email == email).first():
        raise api_error(409, "EMAIL_TAKEN", "An account with this email already exists. Try signing in.")
    user = User(email=email, name=name, password_hash=hash_password(body.password))
    db.add(user); db.commit(); db.refresh(user)
    return _session(db, user)


@router.post("/login")
def login(body: LoginBody, request: Request, db: Session = Depends(get_db)):
    email = (body.email or "").strip().lower()
    key = f"{email}|{_ip(request)}"
    if _login_failures.blocked(key):
        raise api_error(429, "TOO_MANY_REQUESTS", "Too many failed attempts. Try again in 15 minutes.")

    user = db.query(User).filter(User.email == email).first()
    if user is None or not user.password_hash:
        burn_password_check(body.password); ok = False
    else:
        ok = verify_password(body.password, user.password_hash)

    if not ok:
        _login_failures.hit(key)
        hint = (" This account uses Google sign-in." if user and not user.password_hash else "")
        raise api_error(401, "INVALID_CREDENTIALS", "Incorrect email or password." + hint)

    _login_failures.reset(key)
    return _session(db, user)


@router.post("/refresh")
def refresh(body: RefreshBody, db: Session = Depends(get_db)):
    try:
        payload = decode_token(body.refresh_token, "refresh")
    except TokenError as exc:
        raise api_error(401, "REFRESH_EXPIRED" if exc.expired else "UNAUTHORIZED", "Please sign in again.")
    user = db.get(User, int(payload["sub"]))
    if user is None or user.token_version != payload.get("tv"):
        raise api_error(401, "UNAUTHORIZED", "Please sign in again.")
    return _session(db, user)


@router.get("/me")
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return user_public(db, user)


@router.patch("/me")
def update_me(body: UpdateProfileBody, user: User = Depends(get_current_user),
              db: Session = Depends(get_db)):
    name = body.name.strip()
    if not name:
        raise api_error(400, "INVALID_NAME", "Please enter your name.")
    user.name = name; db.commit()
    return user_public(db, user)


@router.post("/change-password")
def change_password(body: ChangePasswordBody, user: User = Depends(get_current_user),
                    db: Session = Depends(get_db)):
    if user.password_hash and not verify_password(body.current_password or "", user.password_hash):
        raise api_error(400, "INVALID_CREDENTIALS", "Your current password is incorrect.")
    _check_password_strength(body.new_password)
    user.password_hash = hash_password(body.new_password)
    user.token_version += 1
    db.commit()
    return _session(db, user)


@router.post("/logout-all")
def logout_all(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user.token_version += 1; db.commit()
    return {"ok": True}