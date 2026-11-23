"""
youtube_fetcher.py
~~~~~~~~~~~~~~~~~~
Wraps the YouTube Data API v3 to fetch video metadata and top-level
comments (with replies) for a given video ID.

Dependencies:
    google-api-python-client  (pip install google-api-python-client)
"""

from __future__ import annotations

import logging
from typing import Optional

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from app.config import settings

logger = logging.getLogger(__name__)

# ─── YouTube client (lazy singleton) ─────────────────────────────────────────

_youtube_client = None


def get_youtube_client():
    global _youtube_client
    if _youtube_client is None:
        if not settings.YOUTUBE_API_KEY:
            raise ValueError(
                "YOUTUBE_API_KEY is not set. "
                "Add it to your .env file or environment variables."
            )
        _youtube_client = build(
            "youtube", "v3",
            developerKey=settings.YOUTUBE_API_KEY,
            cache_discovery=False,  # avoids file-system cache issues
        )
    return _youtube_client


# ─── Video metadata ───────────────────────────────────────────────────────────

def fetch_video_metadata(video_id: str) -> dict:
    """
    Returns a dict with keys:
        video_id, video_title, channel_id, channel_title, published_at
    Raises HttpError on API failure or ValueError if video not found.
    """
    youtube = get_youtube_client()
    response = youtube.videos().list(
        part="snippet",
        id=video_id,
    ).execute()

    items = response.get("items", [])
    if not items:
        raise ValueError(f"Video '{video_id}' not found or is private/deleted.")

    snippet = items[0]["snippet"]
    return {
        "video_id":      video_id,
        "video_title":   snippet.get("title", "Untitled"),
        "channel_id":    snippet.get("channelId"),
        "channel_title": snippet.get("channelTitle"),
        "published_at":  snippet.get("publishedAt"),   # ISO-8601 string
    }


# ─── Comments fetcher ─────────────────────────────────────────────────────────

def fetch_comments(
    video_id: str,
    max_comments: int = 500,
    order: str = "relevance",   # "relevance" | "time"
) -> list[dict]:
    """
    Fetches top-level comments (and their replies) for *video_id*.

    Returns a list of dicts compatible with CommentInput:
        comment_id, author_id, author, text, like_count, reply_count, published_at

    Args:
        video_id:     YouTube video ID.
        max_comments: Hard cap on the number of comments returned (default 500).
        order:        "relevance" (default) or "time" (newest first).
    """
    youtube  = get_youtube_client()
    comments = []
    page_token: Optional[str] = None

    while len(comments) < max_comments:
        batch_size = min(100, max_comments - len(comments))  # API max per page = 100

        try:
            response = youtube.commentThreads().list(
                part="snippet,replies",
                videoId=video_id,
                maxResults=batch_size,
                order=order,
                pageToken=page_token,
                textFormat="plainText",
            ).execute()
        except HttpError as exc:
            # 403 → comments disabled; 404 → video gone
            logger.warning("YouTube API error while fetching comments: %s", exc)
            break

        for thread in response.get("items", []):
            top = thread["snippet"]["topLevelComment"]["snippet"]
            comments.append({
                "comment_id":   thread["snippet"]["topLevelComment"]["id"],
                "author_id":    top.get("authorChannelId", {}).get("value"),
                "author":       top.get("authorDisplayName"),
                "text":         top.get("textDisplay", ""),
                "like_count":   top.get("likeCount", 0),
                "reply_count":  thread["snippet"].get("totalReplyCount", 0),
                "published_at": top.get("publishedAt"),   # ISO-8601 string
            })

            # Include replies if present and we haven't hit the cap yet
            replies = thread.get("replies", {}).get("comments", [])
            for reply in replies:
                if len(comments) >= max_comments:
                    break
                rsnip = reply["snippet"]
                comments.append({
                    "comment_id":   reply["id"],
                    "author_id":    rsnip.get("authorChannelId", {}).get("value"),
                    "author":       rsnip.get("authorDisplayName"),
                    "text":         rsnip.get("textDisplay", ""),
                    "like_count":   rsnip.get("likeCount", 0),
                    "reply_count":  0,
                    "published_at": rsnip.get("publishedAt"),
                })

            if len(comments) >= max_comments:
                break

        page_token = response.get("nextPageToken")
        if not page_token:
            break   # no more pages

    logger.info("Fetched %d comments for video %s", len(comments), video_id)
    return comments[:max_comments]
