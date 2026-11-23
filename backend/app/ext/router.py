"""One router that mounts every NEW endpoint the SentiScope frontend calls.
Registered ONCE in main.py:  app.include_router(router)."""
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.ext import auth as ext_auth, community as ext_community, jobs as ext_jobs
from app.ext import reports as ext_reports, youtube as ext_youtube
from app.ext import store as ext_store
from app.ext.models import User
from app.ext.schemas import (
    AnalyzeUrlRequest, AnalyzeUrlResponse,
)
from app.models import AnalysisJob

router = APIRouter(prefix="/api/v1", tags=["ext"])

# Auth + community are sub-routers; both already carry the /api/v1 prefix,
# so mount them WITHOUT re-prefixing.
router.include_router(ext_auth.router)
router.include_router(ext_community.router)


@router.get("/config")
def public_config():
    return {
        "googleClientId": None,
        "youtubeSource": "api" if settings.YOUTUBE_API_KEY else "scrape",
        "maxComments": settings.MAX_COMMENTS,
        "minPasswordLength": settings.MIN_PASSWORD_LENGTH,
    }


# ─── Analyze by URL ──────────────────────────────────────────────────────────
@router.post("/analyze-url", response_model=AnalyzeUrlResponse)
def analyze_url(body: AnalyzeUrlRequest,
                user: User = Depends(ext_auth.get_current_user),
                db: Session = Depends(get_db)):
    video_id = ext_youtube.parse_video_id(body.url)
    if not video_id:
        raise HTTPException(400, {"type": "INVALID_URL",
                                  "message": "That doesn't look like a YouTube link."})

    if not body.refresh:
        recent = (db.query(AnalysisJob)
                    .filter(AnalysisJob.video_id == video_id,
                            AnalysisJob.created_at >= datetime.now(timezone.utc)
                                - timedelta(minutes=settings.CACHE_MINUTES),
                            AnalysisJob.status.in_(["COMPLETED", "PENDING", "IN_PROGRESS"]))
                    .order_by(AnalysisJob.created_at.desc()).first())
        if recent:
            return AnalyzeUrlResponse(job_id=recent.job_id, video_id=video_id,
                                      status=recent.status,
                                      cached=recent.status == "COMPLETED")

    job_id = str(uuid.uuid4())
    # Video row must exist for the FK on AnalysisJob.
    ext_store.store_upsert_video(db, {"video_id": video_id})
    db.add(AnalysisJob(job_id=job_id, video_id=video_id, status="PENDING"))
    db.commit()

    try:
        meta, comments = ext_youtube.fetch_bundle(
            video_id, body.max_comments or settings.MAX_COMMENTS
        )
    except Exception as exc:
        db.query(AnalysisJob).filter(AnalysisJob.job_id == job_id).update(
            {"status": "FAILED"})
        db.commit()
        raise HTTPException(502, {"type": "YOUTUBE", "message": str(exc)})

    ext_store.store_upsert_video(db, meta)
    ext_jobs.enqueue(job_id, meta, comments)
    return AnalyzeUrlResponse(job_id=job_id, video_id=video_id, status="PENDING")


# ─── Report ──────────────────────────────────────────────────────────────────
@router.get("/report/{video_id}")
def get_report(video_id: str,
               comments: int = Query(50, ge=0, le=500),
               save: bool = Query(True),
               user: User = Depends(ext_auth.get_current_user),
               db: Session = Depends(get_db)):
    report = ext_reports.build_report(db, video_id, comment_limit=comments)
    if report is None:
        raise HTTPException(404, {"type": "NOT_ANALYZED",
                                  "message": "Nothing analyzed for this video yet."})
    if save:
        ext_reports.save_report(db, user.id, report)
    return report


# ─── History ─────────────────────────────────────────────────────────────────
@router.get("/videos")
def list_videos(limit: int = Query(30, ge=1, le=100),
                user: User = Depends(ext_auth.get_current_user),
                db: Session = Depends(get_db)):
    return {"videos": ext_reports.build_history(db, user.id, limit=limit)}


@router.get("/history/{video_id}")
def get_saved_report(video_id: str,
                     user: User = Depends(ext_auth.get_current_user),
                     db: Session = Depends(get_db)):
    r = ext_reports.get_saved_report(db, user.id, video_id)
    if r is None:
        raise HTTPException(404, {"type": "NOT_SAVED", "message": "Not in your history."})
    return r


@router.delete("/videos/{video_id}")
def delete_history_item(video_id: str,
                        user: User = Depends(ext_auth.get_current_user),
                        db: Session = Depends(get_db)):
    return {"removed": ext_reports.remove_from_history(db, user.id, video_id)}


@router.delete("/videos")
def clear_history(user: User = Depends(ext_auth.get_current_user),
                  db: Session = Depends(get_db)):
    return {"removed": ext_reports.remove_from_history(db, user.id)}


# ─── Sub-reports ─────────────────────────────────────────────────────────────
def _require_rows(db: Session, video_id: str):
    rows = ext_reports.load_rows(db, video_id)
    if not rows:
        raise HTTPException(404, {"type": "NOT_ANALYZED",
                                  "message": "No analyzed comments for this video."})
    return rows


@router.get("/toxicity/{video_id}")
def get_toxicity(video_id: str, db: Session = Depends(get_db),
                 _: User = Depends(ext_auth.get_current_user)):
    from app.ext._adapters.reports import compute_toxicity
    return {"video_id": video_id, **compute_toxicity(_require_rows(db, video_id))}


@router.get("/users/{video_id}")
def get_users(video_id: str, limit: int = Query(10, ge=1, le=50),
              db: Session = Depends(get_db),
              _: User = Depends(ext_auth.get_current_user)):
    from app.ext._adapters.reports import compute_users
    return {"video_id": video_id, **compute_users(_require_rows(db, video_id), limit=limit)}


@router.get("/keywords/{video_id}")
def get_keywords(video_id: str, limit: int = Query(15, ge=1, le=50),
                 db: Session = Depends(get_db),
                 _: User = Depends(ext_auth.get_current_user)):
    from app.ext._adapters.text_analysis import keyword_stats, tag_stats
    rows = _require_rows(db, video_id)
    dicts = [r.as_dict() for r in rows]
    return {"video_id": video_id,
            "keywords": keyword_stats(dicts, top_n=limit),
            "tags":     tag_stats(dicts, top_n=limit)}


@router.get("/emojis/{video_id}")
def get_emojis(video_id: str, limit: int = Query(10, ge=1, le=30),
               db: Session = Depends(get_db),
               _: User = Depends(ext_auth.get_current_user)):
    from app.ext._adapters.text_analysis import emoji_stats
    rows = _require_rows(db, video_id)
    return {"video_id": video_id,
            "emojis": emoji_stats([r.as_dict() for r in rows], top_n=limit)}


@router.get("/engagement/{video_id}")
def get_engagement(video_id: str, db: Session = Depends(get_db),
                   _: User = Depends(ext_auth.get_current_user)):
    from app.ext._adapters.reports import compute_engagement
    return {"video_id": video_id, **compute_engagement(_require_rows(db, video_id))}


@router.get("/comments/{video_id}")
def get_comments(video_id: str,
                 sentiment: Optional[str] = Query(None),
                 toxicity: Optional[str] = Query(None),
                 search: Optional[str] = Query(None, max_length=100),
                 sort: str = Query("likes", pattern="^(likes|recent|toxicity)$"),
                 limit: int = Query(25, ge=1, le=100),
                 offset: int = Query(0, ge=0),
                 db: Session = Depends(get_db),
                 _: User = Depends(ext_auth.get_current_user)):
    return ext_reports.list_comments(db, video_id, sentiment=sentiment, toxicity=toxicity,
                                     search=search, sort=sort, limit=limit, offset=offset)