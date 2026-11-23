from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.config import settings
from sqlalchemy.dialects.postgresql import insert as pg_insert
import uuid

from app.database import get_db, engine
from app.models import Base, AnalysisJob, Comment, Video
from app.schemas import (
    IngestionPayload, IngestionResponse,
    JobStatusResponse,
    SentimentSummaryResponse,
    TrendsResponse, TrendPoint,
    FetchAndAnalyzeRequest, FetchAndAnalyzeResponse,
    ToxicityReportResponse, ToxicComment,
    CommentAnalysisResult,
)
from app.tasks import process_comments_pipeline
from app.youtube_fetcher import fetch_video_metadata, fetch_comments
from googleapiclient.errors import HttpError

# ─── NEW: import ext models so create_all() knows about them ─────────────
from app.ext.models import User, SavedReport, ContactMessage  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)        # now includes users/saved_reports/contact_messages
    yield


app = FastAPI(
    title="YouTube Sentiment API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── NEW: mount every endpoint the SentiScope frontend calls ─────────────
from app.ext.router import router as ext_router
app.include_router(ext_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


# ─── 1. Ingestion (Jashan → Backend) ─────────────────────────────────────────

@app.post("/api/v1/analyze", response_model=IngestionResponse)
def analyze_video(payload: IngestionPayload, db: Session = Depends(get_db)):
    # 🛡️ Safety Guard: Stop if no comments were provided
    if not payload.comments:
        raise HTTPException(
            status_code=400,
            detail="No comments provided. Ensure the video is public and has comments enabled.",
        )
    job_id = str(uuid.uuid4())

    # Upsert Video
    db.execute(
        pg_insert(Video).values(
            video_id=payload.video_id,
            title=payload.video_title,
            channel_id=payload.channel_id,
            channel_title=payload.channel_title,
            published_at=payload.published_at,
        ).on_conflict_do_update(
            index_elements=["video_id"],
            set_={
                "title": payload.video_title,
                "channel_id": payload.channel_id,
                "channel_title": payload.channel_title,
                "published_at": payload.published_at,
            },
        )
    )
    db.add(AnalysisJob(job_id=job_id, video_id=payload.video_id, status="PENDING"))
    db.commit()

    video_meta = {
        "video_id":      payload.video_id,
        "video_title":   payload.video_title,
        "channel_id":    payload.channel_id,
        "channel_title": payload.channel_title,
        "published_at":  payload.published_at.isoformat() if payload.published_at else None,
    }

    total_items = len(payload.comments)

    process_comments_pipeline.delay(
        job_id,
        video_meta,
        [c.model_dump(mode="json") for c in payload.comments],
    )

    return IngestionResponse(
        job_id=job_id,
        status="PENDING",
        total_comments_received=total_items,
    )


# ─── 2. Job Status Polling ───────────────────────────────────────────────────

@app.get("/api/v1/status/{job_id}", response_model=JobStatusResponse)
def get_job_status(job_id: str, db: Session = Depends(get_db)):
    job = db.query(AnalysisJob).filter(AnalysisJob.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return JobStatusResponse(
        job_id=job.job_id,
        status=job.status,
        progress_percentage=job.progress_percentage or 0,
        video_id=job.video_id,
        stage=job.stage,               # This sends "FETCHING", "ANALYZING", etc.
        total_comments=job.total_comments,
        error_type=job.error_type,
        error_message=job.error_message,
    )


# ─── 3. Sentiment Summary (Piyush: Donut / Pie Chart) ────────────────────────


@app.get("/api/v1/sentiment-summary/{video_id}", response_model=SentimentSummaryResponse)
def get_sentiment(video_id: str, db: Session = Depends(get_db)):
    total_all = (
        db.query(func.count(Comment.id))
        .filter(Comment.video_id == video_id)
        .scalar() or 0
    )

    spam_count = (
        db.query(func.count(Comment.id))
        .filter(
            Comment.video_id == video_id,
            Comment.is_spam.is_(True)
        )
        .scalar() or 0
    )

    rows = (
        db.query(Comment.sentiment, func.count(Comment.id))
        .filter(
            Comment.video_id == video_id,
            Comment.is_spam.is_not(True)
        )
        .group_by(Comment.sentiment)
        .all()
    )

    breakdown = {"positive": 0, "neutral": 0, "negative": 0}

    for label, count in rows:
        if label:
            breakdown[label.lower()] = count

    total = sum(breakdown.values())

    return SentimentSummaryResponse(
        video_id=video_id,
        total_analyzed=total,
        breakdown=breakdown,
        positive_ratio=round(breakdown["positive"] / total, 2) if total > 0 else 0.0,
        total_comments=total_all,
        spam_count=spam_count,
        spam_rate=round(spam_count / total_all, 4) if total_all else 0.0,
    )


# ─── 4. Sentiment Trends Over Time (Line Chart)

@app.get("/api/v1/trends/{video_id}", response_model=TrendsResponse)
def get_trends(video_id: str, db: Session = Depends(get_db)):
    rows = (
        db.query(
            func.date_trunc("day", Comment.published_at).label("day"),
            Comment.sentiment,
            func.count(Comment.id),
        )
        .filter(Comment.video_id == video_id)
        .group_by("day", Comment.sentiment)
        .order_by("day")
        .all()
    )
    timeline_data = {}
    for day, sent, count in rows:
        d_str = day.strftime("%Y-%m-%d")
        if d_str not in timeline_data:
            timeline_data[d_str] = {"positive": 0, "neutral": 0, "negative": 0}
        if sent:
            timeline_data[d_str][sent.lower()] = count
    timeline = [
        TrendPoint(date=d, **counts)
        for d, counts in timeline_data.items()
    ]
    return TrendsResponse(video_id=video_id, timeline=timeline)


# ─── 5. Live Fetch-and-Analyze (YouTube API → Backend Pipeline) ──────────────

@app.post("/api/v1/fetch-and-analyze", response_model=FetchAndAnalyzeResponse)
def fetch_and_analyze(payload: FetchAndAnalyzeRequest, db: Session = Depends(get_db)):
    """
    Fetches video metadata and comments directly from the YouTube Data API v3,
    then kicks off the Celery sentiment-analysis pipeline.

    Required env var: YOUTUBE_API_KEY
    """
    # 1. Fetch video metadata from YouTube
    try:
        meta = fetch_video_metadata(payload.video_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except HttpError as exc:
        raise HTTPException(
            status_code=exc.resp.status,
            detail=f"YouTube API error: {exc.reason}",
        )

    # 2. Fetch comments from YouTube
    try:
        raw_comments = fetch_comments(
            video_id=payload.video_id,
            max_comments=payload.max_comments,
            order=payload.order,
        )
    except HttpError as exc:
        raise HTTPException(
            status_code=exc.resp.status,
            detail=f"YouTube API error while fetching comments: {exc.reason}",
        )

    if not raw_comments:
        raise HTTPException(
            status_code=400,
            detail="No comments found. The video may have comments disabled or no comments yet.",
        )

    # 3. Upsert video & create job (same logic as /api/v1/analyze)
    job_id = str(uuid.uuid4())

    db.execute(
        pg_insert(Video).values(
            video_id=meta["video_id"],
            title=meta["video_title"],
            channel_id=meta["channel_id"],
            channel_title=meta["channel_title"],
            published_at=meta["published_at"],
        ).on_conflict_do_update(
            index_elements=["video_id"],
            set_={
                "title":         meta["video_title"],
                "channel_id":    meta["channel_id"],
                "channel_title": meta["channel_title"],
                "published_at":  meta["published_at"],
            },
        )
    )
    db.add(AnalysisJob(job_id=job_id, video_id=meta["video_id"], status="PENDING"))
    db.commit()

    # 4. Dispatch Celery task
    process_comments_pipeline.delay(job_id, meta, raw_comments)

    return FetchAndAnalyzeResponse(
        job_id=job_id,
        status="PENDING",
        video_id=meta["video_id"],
        video_title=meta["video_title"],
        total_comments_fetched=len(raw_comments),
    )


# ─── 6. Toxicity Report ───────────────────────────────────────────────────────

@app.get("/api/v1/toxicity-report/{video_id}", response_model=ToxicityReportResponse)
def get_toxicity_report(
    video_id: str,
    top_n: int = 10,
    db: Session = Depends(get_db),
):
    """
    Returns a toxicity summary for all analyzed comments on a video:
    - Overall toxic comment count & rate
    - Average toxicity score across ALL comments
    - Top-N most toxic comments (sorted by toxicity_score desc)

    Query param:
        top_n  — number of worst-offender comments to return (default 10)
    """
    # All analyzed comments for this video
    comments = (
        db.query(Comment)
        .filter(Comment.video_id == video_id, Comment.toxicity_score.isnot(None))
        .all()
    )

    if not comments:
        raise HTTPException(
            status_code=404,
            detail="No analyzed comments found for this video. Run /api/v1/analyze or /api/v1/fetch-and-analyze first.",
        )

    total          = len(comments)
    toxic_comments = [c for c in comments if c.label_toxicity == "toxic"]
    total_toxic    = len(toxic_comments)
    toxicity_rate  = round(total_toxic / total, 4) if total > 0 else 0.0
    avg_score      = round(sum(c.toxicity_score for c in comments) / total, 4) if total > 0 else 0.0

    # Top-N worst offenders
    top_toxic = sorted(toxic_comments, key=lambda c: c.toxicity_score, reverse=True)[:top_n]

    return ToxicityReportResponse(
        video_id=video_id,
        total_analyzed=total,
        total_toxic=total_toxic,
        toxicity_rate=toxicity_rate,
        avg_toxicity_score=avg_score,
        top_toxic_comments=[
            ToxicComment(
                comment_id=c.comment_id,
                author=c.author,
                text=c.text,
                label_toxicity=c.label_toxicity,
                toxicity_score=round(c.toxicity_score, 4),
                sentiment=c.sentiment,
                sentiment_score=round(c.sentiment_score, 2) if c.sentiment_score else None,
                like_count=c.like_count or 0,
            )
            for c in top_toxic
        ],
    )


# ─── 7. Single Comment Analysis Result ───────────────────────────────────────


@app.get("/api/v1/comment/{comment_id}", response_model=CommentAnalysisResult)
def get_comment_analysis(comment_id: str, db: Session = Depends(get_db)):
    c = db.query(Comment).filter(Comment.comment_id == comment_id).first()

    if not c:
        raise HTTPException(status_code=404, detail="Comment not found.")

    if c.is_spam:
        return CommentAnalysisResult(
            comment_id=c.comment_id,
            text=c.text,
            is_spam=True,
            spam_score=round(c.spam_score or 0.0, 3)
        )

    if c.sentiment is None:
        raise HTTPException(
            status_code=202,
            detail="Comment has not been analyzed yet. Check job status."
        )

    return CommentAnalysisResult(
        comment_id=c.comment_id,
        text=c.text,
        is_spam=False,
        spam_score=round(c.spam_score or 0.0, 3),
        sentiment=c.sentiment,
        sentiment_score=round(c.sentiment_score or 0.0, 2),
        label_toxicity=c.label_toxicity or "non-toxic",
        toxicity_score=round(c.toxicity_score or 0.0, 2)
    )
