"""parse_video_id + fetch_bundle — wraps YOUR existing youtube_fetcher."""
import re
from app.youtube_fetcher import fetch_video_metadata, fetch_comments

_YT_RE = re.compile(
    r"(?:youtube\.com/(?:watch\?v=|shorts/|embed/|live/)|youtu\.be/)([A-Za-z0-9_-]{11})"
)


def parse_video_id(url: str) -> str:
    if not url:
        return ""
    m = _YT_RE.search(url)
    if m:
        return m.group(1)
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", url):
        return url
    return ""


def fetch_bundle(video_id: str, max_comments: int):
    meta = fetch_video_metadata(video_id)
    raw = fetch_comments(video_id, max_comments=max_comments, order="relevance")
    comments = [{
        "comment_id":   c["comment_id"],
        "author_id":    c.get("author_id"),
        "author":       c.get("author"),
        "text":         c.get("text") or "",
        "like_count":   c.get("like_count") or 0,
        "reply_count":  c.get("reply_count") or 0,
        "published_at": c.get("published_at"),
    } for c in raw]
    return meta, comments