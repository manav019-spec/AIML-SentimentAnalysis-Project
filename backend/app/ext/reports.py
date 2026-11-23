"""DB-facing report builders. Reads YOUR Comment / Video tables (sentiment, label_toxicity,
toxicity_score, is_spam) and calls the pure compute_* functions in _adapters.reports."""
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import Comment, Video
from app.ext.models import SavedReport
from app.ext._adapters.reports import Row, compute_report, _comment_item
from app.ext._adapters.formatting import medium_date

def _to_row(c: Comment) -> Row:
    """Map YOUR Comment row into the adapter's Row dataclass.

    Your model stores:
        sentiment        = "POSITIVE" | "NEUTRAL" | "NEGATIVE"
        label_toxicity   = "toxic" | "non-toxic"   (or None for spam)
        toxicity_score   = 0.0 .. 1.0  (None for spam)
        is_spam          = bool
    """
    published = c.published_at or datetime.now(timezone.utc)
    if published.tzinfo is None:
        published = published.replace(tzinfo=timezone.utc)

    # Map the toxicity label from your vocabulary into the adapter's vocabulary.
    adapter_label: Optional[str] = None
    if c.toxicity_score is not None:
        if c.label_toxicity == "toxic":
            adapter_label = "TOXIC"
        elif (c.toxicity_score or 0.0) >= 0.4:
            adapter_label = "BORDERLINE"
        else:
            adapter_label = "CLEAN"

    cats: dict = {}
    if c.toxicity_score is not None:
        cats = {"toxic": c.toxicity_score}

    return Row(
        comment_id=c.comment_id,
        author_id=c.author_id,
        author=c.author,
        text=c.text or "",
        likes=c.like_count or 0,
        replies=c.reply_count or 0,
        sentiment=(c.sentiment or "NEUTRAL").lower(),
        sentiment_score=c.sentiment_score or 0.0,
        published_at=published,
        toxicity_score=c.toxicity_score,
        toxicity_label=adapter_label,
        toxicity_categories=cats,
        avatar=None,              # your Comment table doesn't store avatars
        subscribers=None,         # ... or subscriber counts
        subscribers_hidden=False,
    )


def load_rows(db: Session, video_id: str, include_spam: bool = False) -> list[Row]:
    q = db.query(Comment).filter(Comment.video_id == video_id)
    if not include_spam:
        q = q.filter(Comment.is_spam.is_not(True))
    return [_to_row(c) for c in q.all()]


def build_report(db: Session, video_id: str, comment_limit: int = 50) -> Optional[dict]:
    video = db.get(Video, video_id)
    if video is None:
        return None
    rows = load_rows(db, video_id)
    if not rows:
        return None
    return compute_report(video, rows, comment_limit)


def list_comments(db: Session, video_id: str, *, sentiment: Optional[str] = None,
                  toxicity: Optional[str] = None, search: Optional[str] = None,
                  sort: str = "likes", limit: int = 25, offset: int = 0) -> dict:
    """Paginated comments for the frontend's comment list view.

    `toxicity` filter is accepted from the frontend's vocabulary
    (clean | borderline | toxic) and translated to YOUR label_toxicity.
    """
    q = db.query(Comment).filter(Comment.video_id == video_id, Comment.is_spam.is_not(True))
    if sentiment:
        q = q.filter(func.upper(Comment.sentiment) == sentiment.upper())
    if toxicity:
        t = toxicity.lower()
        if t == "toxic":
            q = q.filter(Comment.label_toxicity == "toxic")
        elif t == "borderline":
            q = q.filter(Comment.toxicity_score >= 0.4,
                         Comment.label_toxicity != "toxic")
        elif t == "clean":
            q = q.filter(Comment.toxicity_score < 0.4)
    if search:
        escaped = search.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        q = q.filter(Comment.text.ilike(f"%{escaped}%", escape="\\"))

    order = {
        "likes":    [Comment.like_count.desc()],
        "recent":   [Comment.published_at.desc()],
        "toxicity": [Comment.toxicity_score.desc().nullslast()],
    }.get(sort, [Comment.like_count.desc()])

    total = q.count()
    page = q.order_by(*order, Comment.id).offset(offset).limit(limit).all()
    now = datetime.now(timezone.utc)
    return {
        "video_id": video_id, "total": total, "limit": limit, "offset": offset,
        "comments": [_comment_item(_to_row(c), now) for c in page],
    }


# ─── History (per-user saved reports) ───────────────────────────────────────

def save_report(db: Session, user_id: int, report: dict) -> None:
    from sqlalchemy.dialects.postgresql import insert as pg_insert
    from sqlalchemy.dialects.sqlite import insert as sqlite_insert
    from app.database import engine

    values = {
        "user_id":        user_id,
        "video_id":       report["id"],
        "title":          report.get("title"),
        "channel":        report.get("channel"),
        "thumbnail_url":  report.get("thumbnail"),
        "total_comments": report.get("totalCommentsAnalyzed") or 0,
        "overall_score":  report.get("overallScore") or 0,
        "report":         report,
        "updated_at":     datetime.now(timezone.utc),
    }
    Insert = pg_insert if engine.dialect.name == "postgresql" else sqlite_insert
    stmt = Insert(SavedReport).values(**values)
    stmt = stmt.on_conflict_do_update(
        index_elements=["user_id", "video_id"],
        set_={k: v for k, v in values.items() if k not in ("user_id", "video_id")},
    )
    db.execute(stmt)
    db.commit()


def build_history(db: Session, user_id: int, limit: int = 30) -> list[dict]:
    rows = (db.query(SavedReport.video_id, SavedReport.title, SavedReport.channel,
                     SavedReport.thumbnail_url, SavedReport.total_comments,
                     SavedReport.overall_score, SavedReport.updated_at)
              .filter(SavedReport.user_id == user_id)
              .order_by(SavedReport.updated_at.desc()).limit(limit).all())
    return [{
        "id": r.video_id, "url": f"https://www.youtube.com/watch?v={r.video_id}",
        "title": r.title or "Untitled", "channel": r.channel or "",
        "thumbnail": r.thumbnail_url,
        "totalCommentsAnalyzed": r.total_comments or 0,
        "overallScore": r.overall_score or 0,
        "analyzedAt": medium_date(r.updated_at) if r.updated_at else None,
    } for r in rows]


def get_saved_report(db: Session, user_id: int, video_id: str) -> Optional[dict]:
    row = (db.query(SavedReport)
             .filter(SavedReport.user_id == user_id, SavedReport.video_id == video_id).first())
    if row is None:
        return None
    return {**row.report, "savedAt": row.updated_at.isoformat() if row.updated_at else None}


def remove_from_history(db: Session, user_id: int, video_id: Optional[str] = None) -> int:
    q = db.query(SavedReport).filter(SavedReport.user_id == user_id)
    if video_id:
        q = q.filter(SavedReport.video_id == video_id)
    n = q.delete(synchronize_session=False)
    db.commit()
    return n