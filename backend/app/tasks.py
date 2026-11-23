from celery import Celery
from celery.signals import worker_ready
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.config import settings
from app.database import SessionLocal, engine
from app.models import Base, Video, Comment, AnalysisJob
from app.model_def import get_predictor

Base.metadata.create_all(bind=engine)

# ─── Celery App ───────────────────────────────────────────────────────────────
celery_app = Celery("sentiment_worker", broker=settings.REDIS_URL, backend=settings.REDIS_URL)
celery_app.conf.worker_prefetch_multiplier = 1          # one long job at a time per worker

if settings.REDIS_URL.startswith("rediss://"):
    celery_app.conf.broker_use_ssl = {"ssl_cert_reqs": "none"}
    celery_app.conf.redis_backend_use_ssl = {"ssl_cert_reqs": "none"}


@worker_ready.connect
def _warm_up(**kwargs):
    get_predictor()                                     # load the model once when the worker starts


def _parse_dt(s):
    if s:
        try:
            return datetime.fromisoformat(s.replace("Z", "+00:00"))
        except (ValueError, AttributeError):
            pass
    return datetime.now(timezone.utc)


UPDATE_COLS = ["is_spam", "spam_score", "sentiment", "sentiment_score", "label_toxicity",
               "toxicity_score", "like_count", "reply_count", "model_version"]


@celery_app.task
@celery_app.task
def process_comments_pipeline(job_id: str, video_meta: dict, comments_data: list):
    db = SessionLocal()
    try:
        # 1. Mark IN_PROGRESS and FETCHING
        db.query(AnalysisJob).filter(AnalysisJob.job_id == job_id).update(
            {"status": "IN_PROGRESS", "progress_percentage": 10, "stage": "FETCHING"})
        db.commit()

        # 2. Upsert Video
        db.execute(
            pg_insert(Video).values(
                video_id=video_meta["video_id"], title=video_meta.get("video_title"),
                channel_id=video_meta.get("channel_id"), channel_title=video_meta.get("channel_title"),
                published_at=video_meta.get("published_at"),
            ).on_conflict_do_update(
                index_elements=["video_id"],
                set_={"title": video_meta.get("video_title"), "channel_id": video_meta.get("channel_id"),
                      "channel_title": video_meta.get("channel_title"), "published_at": video_meta.get("published_at")},
            ))
        db.commit()

        # 3. Inference with the fine-tuned multi-task model
        predictor = get_predictor()
        texts = [(c.get("text") or "") for c in comments_data]
        last = {"p": 10}

        # NEW: Mark stage as ANALYZING before the loop
        db.query(AnalysisJob).filter(AnalysisJob.job_id == job_id).update(
            {"stage": "ANALYZING"})
        db.commit()

        def on_progress(done, total):
            p = 10 + int(80 * done / total)
            if p - last["p"] >= 5 or done == total:
                last["p"] = p
                db.query(AnalysisJob).filter(AnalysisJob.job_id == job_id).update({"progress_percentage": p})
                db.commit()

        preds = predictor.predict(texts, batch_size=settings.INFERENCE_BATCH_SIZE, progress=on_progress)

        rows = {}
        for item, pr in zip(comments_data, preds):
            rows[item["comment_id"]] = {                 # dict keyed by comment_id removes duplicates
                "comment_id": item["comment_id"], "video_id": video_meta["video_id"],
                "author_id": item.get("author_id"), "author": item.get("author"),
                "text": (item.get("text") or "")[:2000],
                "like_count": item.get("like_count", 0), "reply_count": item.get("reply_count", 0),
                "is_spam": pr["is_spam"], "spam_score": round(pr["spam_score"], 4),
                "sentiment": pr["sentiment"],
                "sentiment_score": None if pr["sentiment_score"] is None else round(pr["sentiment_score"], 4),
                "label_toxicity": pr["label_toxicity"],
                "toxicity_score": None if pr["toxicity_score"] is None else round(pr["toxicity_score"], 4),
                "model_version": predictor.version,
                "published_at": _parse_dt(item.get("published_at")),
            }
        rows = list(rows.values())

        # 4. Bulk upsert in chunks of 500
        # NEW: Mark stage as SAVING
        db.query(AnalysisJob).filter(AnalysisJob.job_id == job_id).update(
            {"stage": "SAVING", "progress_percentage": 90})
        db.commit()

        for i in range(0, len(rows), 500):
            stmt = pg_insert(Comment).values(rows[i:i + 500])
            db.execute(stmt.on_conflict_do_update(
                index_elements=["comment_id"],
                set_={c: getattr(stmt.excluded, c) for c in UPDATE_COLS}))
            db.commit()

        # 5. Mark COMPLETED
        db.query(AnalysisJob).filter(AnalysisJob.job_id == job_id).update(
            {"status": "COMPLETED", "progress_percentage": 100, "stage": "DONE"})
        db.commit()

    except Exception as e:
        db.rollback()
        # NEW: Save the error message to the database
        db.query(AnalysisJob).filter(AnalysisJob.job_id == job_id).update({
            "status": "FAILED",
            "error_type": "INTERNAL_ERROR",
            "error_message": str(e)[:500]
        })
        db.commit()
        raise
    finally:
        db.close()