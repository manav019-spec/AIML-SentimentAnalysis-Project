"""Dispatch analysis jobs — Celery if REDIS_URL is set, otherwise a background thread."""
import logging
from concurrent.futures import ThreadPoolExecutor

from app.config import settings
from app.tasks import process_comments_pipeline

log = logging.getLogger(__name__)
_executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="ext-analysis")


def _log_failure(future):
    exc = future.exception()
    if exc:
        log.error("ext analysis crashed: %s", exc)


def enqueue(job_id: str, video_meta: dict, comments: list) -> None:
    if settings.REDIS_URL:
        process_comments_pipeline.delay(job_id, video_meta, comments)
    else:
        _executor.submit(process_comments_pipeline.run, job_id, video_meta, comments) \
                 .add_done_callback(_log_failure)