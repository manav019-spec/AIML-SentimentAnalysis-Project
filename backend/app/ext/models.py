"""Additive tables (users, saved_reports, contact_messages).
Does not modify videos / comments / analysis_jobs."""
from sqlalchemy import (
    Column, String, Integer, Text, JSON, DateTime, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


def _now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"
    id            = Column(Integer, primary_key=True, index=True)
    email         = Column(String(255), unique=True, index=True, nullable=False)
    name          = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=True)   # null → google-only
    google_id     = Column(String(64), unique=True, nullable=True)
    avatar_url    = Column(String(500), nullable=True)
    token_version = Column(Integer, nullable=False, default=0)
    created_at    = Column(DateTime(timezone=True), default=_now)


class SavedReport(Base):
    __tablename__ = "saved_reports"
    __table_args__ = (UniqueConstraint("user_id", "video_id", name="uq_saved_user_video"),)

    id             = Column(Integer, primary_key=True, index=True)
    user_id        = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    video_id       = Column(String(50), ForeignKey("videos.video_id", ondelete="CASCADE"), index=True, nullable=False)
    title          = Column(String(255), nullable=True)
    channel        = Column(String(255), nullable=True)
    thumbnail_url  = Column(String(500), nullable=True)
    total_comments = Column(Integer, default=0)
    overall_score  = Column(Integer, default=0)
    report         = Column(JSON, nullable=False)
    created_at     = Column(DateTime(timezone=True), default=_now)
    updated_at     = Column(DateTime(timezone=True), default=_now, index=True)


class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False)
    email      = Column(String(255), nullable=False)
    message    = Column(Text, nullable=False)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=_now, index=True)