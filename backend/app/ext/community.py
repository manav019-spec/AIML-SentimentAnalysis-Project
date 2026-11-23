"""Contact-us messages + admin read-API."""
import logging
import re
from typing import Optional

from fastapi import APIRouter, Depends, Query, Request
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.ext.auth import api_error, require_admin
from app.database import get_db
from app.ext.models import ContactMessage, User
from app.ext.security import RateLimiter

log = logging.getLogger(__name__)
router = APIRouter(prefix="", tags=["community"])

_contact_limit = RateLimiter(limit=5, window=60 * 60)
_EMAIL_RE = re.compile(r"^[^@\s]{1,64}@[^@\s]+\.[^@\s]{2,}$")


class ContactBody(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., max_length=255)
    message: str = Field(..., min_length=5, max_length=3000)


@router.post("/contact")
def send_contact(body: ContactBody, request: Request, db: Session = Depends(get_db)):
    ip = request.client.host if request.client else "unknown"
    if not _contact_limit.allow(ip):
        raise api_error(429, "TOO_MANY_REQUESTS", "You've sent several messages recently. Try later.")
    email = body.email.strip().lower()
    if not _EMAIL_RE.match(email):
        raise api_error(400, "INVALID_EMAIL", "Please enter a valid email address.")

    user_id: Optional[int] = None
    auth = request.headers.get("authorization", "")
    if auth.lower().startswith("bearer "):
        try:
            from app.ext.security import decode_token
            user_id = int(decode_token(auth[7:].strip(), "access")["sub"])
            if db.get(User, user_id) is None:
                user_id = None
        except Exception:
            user_id = None

    db.add(ContactMessage(name=body.name.strip(), email=email,
                          message=body.message.strip(), user_id=user_id))
    db.commit()
    log.info("New contact message from %s <%s>", body.name.strip(), email)
    return {"ok": True}


@router.get("/admin/contact")
def admin_contact(limit: int = Query(50, ge=1, le=200),
                  _: User = Depends(require_admin), db: Session = Depends(get_db)):
    rows = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).limit(limit).all()
    return {"items": [{"id": m.id, "name": m.name, "email": m.email, "message": m.message,
                       "userId": m.user_id, "createdAt": m.created_at.isoformat()} for m in rows]}