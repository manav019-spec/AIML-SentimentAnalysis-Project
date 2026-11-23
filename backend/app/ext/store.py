# app/ext/store.py
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from app.database import engine
from app.models import Video


def store_upsert_video(db: Session, meta: dict) -> None:
    values = {
        "video_id":      meta["video_id"],
        "title":         meta.get("title") or meta.get("video_title"),
        "channel_id":    meta.get("channel_id"),
        "channel_title": meta.get("channel_title"),
        "published_at":  _parse_dt(meta.get("published_at")),
        "thumbnail_url": meta.get("thumbnail_url"),
    }
    Insert = pg_insert if engine.dialect.name == "postgresql" else sqlite_insert
    stmt = Insert(Video).values(**values).on_conflict_do_update(
        index_elements=["video_id"],
        set_={k: v for k, v in values.items() if k != "video_id"},
    )
    db.execute(stmt)
    db.commit()


def _parse_dt(s):
    if isinstance(s, datetime):
        return s
    if not s:
        return None
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return None