"""Pure computation layer of the online project's reports.py.

Kept verbatim EXCEPT for:
  • imports — the online version imports Author, Comment, SavedReport, Video from
    its models, settings from config, TOXICITY_CATEGORIES from services.nlp, and
    text_analysis helpers. Those DB/NLP couplings have been removed.
  • TOXICITY_CATEGORIES is inlined here as a literal (matches the online constant).
  • compute_toxicity() defaults BORDERLINE_THRESHOLD to 0.40 if settings isn't loaded.

DB access lives in app/ext/reports.py.
"""
import math
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from statistics import mean
from typing import Dict, List, Optional

from app.ext._adapters.formatting import format_count, format_duration, long_date, medium_date, short_date, time_ago
from app.ext._adapters.text_analysis import emoji_stats, keyword_stats, tag_stats

SENTIMENT_COLORS = {"positive": "#34d399", "neutral": "#a78bfa", "negative": "#f87171"}

TOXICITY_CATEGORIES = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]

BORDERLINE_THRESHOLD = 0.40   # matches online settings.BORDERLINE_THRESHOLD default


def net_score(positive: int, neutral: int, total: int) -> int:
    return int(100 * (positive + 0.5 * neutral) / total + 0.5) if total else 0


@dataclass
class Row:
    comment_id: str
    author_id: Optional[str]
    author: Optional[str]
    text: str
    likes: int
    replies: int
    sentiment: str
    sentiment_score: float
    published_at: datetime
    toxicity_score: Optional[float] = None
    toxicity_label: Optional[str] = None
    toxicity_categories: Dict[str, float] = field(default_factory=dict)
    avatar: Optional[str] = None
    subscribers: Optional[int] = None
    subscribers_hidden: bool = False

    @property
    def author_key(self) -> str:
        return self.author_id or f"name:{self.author or 'unknown'}"

    def as_dict(self) -> dict:
        return {"text": self.text, "sentiment": self.sentiment.upper()}


def _trim(text: str, n: int = 400) -> str:
    text = text.strip()
    return text if len(text) <= n else text[: n - 1].rstrip() + "…"


def compute_summary(rows: List[Row]) -> dict:
    total = len(rows)
    counts = Counter(r.sentiment for r in rows)
    breakdown = {
        name: {
            "count": counts.get(name, 0),
            "percentage": round(counts.get(name, 0) / total * 100, 1) if total else 0.0,
            "color": SENTIMENT_COLORS[name],
        }
        for name in ("positive", "neutral", "negative")
    }
    score = net_score(counts.get("positive", 0), counts.get("neutral", 0), total)
    if score >= 80:   label, subtitle = "Very Positive", "Highly receptive audience"
    elif score >= 60: label, subtitle = "Positive", "Net positive audience"
    elif score >= 40: label, subtitle = "Neutral", "Mixed or indifferent audience"
    elif score >= 20: label, subtitle = "Negative", "Audience is largely critical"
    else:             label, subtitle = "Very Negative", "Strongly negative reception"
    return {"total": total, "breakdown": breakdown, "overallScore": score,
            "sentimentLabel": label, "sentimentSubtitle": subtitle}


def compute_trend(rows: List[Row], max_points: int = 12) -> List[dict]:
    if not rows:
        return []
    by_day: Dict = defaultdict(Counter)
    for r in rows:
        day = r.published_at.astimezone(timezone.utc).date()
        by_day[day][r.sentiment] += 1
        if r.toxicity_label == "TOXIC":
            by_day[day]["toxic"] += 1

    days = sorted(by_day)
    first, span = days[0], (days[-1] - days[0]).days + 1
    bucket = 1 if len(days) <= 14 else math.ceil(span / max_points)

    buckets: Dict = defaultdict(Counter)
    for d in days:
        start = first + timedelta(days=((d - first).days // bucket) * bucket)
        buckets[start].update(by_day[d])

    return [{
        "date": short_date(datetime(s.year, s.month, s.day)),
        "isoDate": s.isoformat(),
        "positive": c["positive"], "neutral": c["neutral"], "negative": c["negative"],
        "toxic": c["toxic"],
    } for s, c in sorted(buckets.items())]


def _highlight(r: Row) -> dict:
    return {
        "id": r.comment_id, "author": r.author or "Unknown", "likes": r.likes,
        "sentiment": r.sentiment, "confidence": round(r.sentiment_score, 3),
        "text": _trim(r.text), "date": medium_date(r.published_at), "avatar": r.avatar,
        "toxicity": round(r.toxicity_score, 2) if r.toxicity_score is not None else None,
    }


def compute_highlights(rows: List[Row], limit: int = 5) -> dict:
    recent = lambda r: r.published_at.timestamp()
    most_liked = sorted(rows, key=lambda r: (-r.likes, -recent(r)))[:limit]
    positive = sorted((r for r in rows if r.sentiment == "positive"),
                      key=lambda r: (-r.likes, -r.sentiment_score))[:limit]
    critical = sorted((r for r in rows if r.sentiment == "negative"),
                      key=lambda r: (-r.likes, -r.sentiment_score))[:limit]
    return {
        "mostLiked": [_highlight(r) for r in most_liked],
        "topPositive": [_highlight(r) for r in positive],
        "topCritical": [_highlight(r) for r in critical],
    }


def compute_toxicity(rows: List[Row], limit: int = 5) -> dict:
    scored = [r for r in rows if r.toxicity_score is not None]
    if not scored:
        return {"available": False}
    total = len(scored)
    toxic = [r for r in scored if r.toxicity_label == "TOXIC"]
    borderline = [r for r in scored if r.toxicity_label == "BORDERLINE"]
    clean_n = total - len(toxic) - len(borderline)
    pct = lambda n: round(n / total * 100, 1)

    toxic_pct = len(toxic) / total * 100
    level = "Low" if toxic_pct < 2 else "Moderate" if toxic_pct < 8 else "High"
    health = round(100 - (len(toxic) + 0.5 * len(borderline)) / total * 100)

    categories = []
    for key in TOXICITY_CATEGORIES:
        n = sum(1 for r in scored if r.toxicity_categories.get(key, 0) >= 0.5)
        categories.append({"key": key, "name": key.replace("_", " ").title(),
                           "count": n, "percentage": pct(n)})

    worst = sorted((r for r in scored if r.toxicity_score >= BORDERLINE_THRESHOLD),
                   key=lambda r: -r.toxicity_score)[:limit]
    return {
        "available": True, "analyzed": total,
        "toxicCount": len(toxic), "toxicPercentage": pct(len(toxic)),
        "borderlineCount": len(borderline), "borderlinePercentage": pct(len(borderline)),
        "cleanCount": clean_n, "cleanPercentage": pct(clean_n),
        "averageScore": round(mean(r.toxicity_score for r in scored), 3),
        "healthScore": health, "level": level, "categories": categories,
        "mostToxic": [{
            **_highlight(r),
            "score": round(r.toxicity_score, 3), "label": r.toxicity_label,
            "flags": [k.replace("_", " ") for k, v in sorted(
                r.toxicity_categories.items(), key=lambda kv: -kv[1]) if v >= 0.5][:3],
        } for r in worst],
    }


def _profile(rs: List[Row]) -> dict:
    first = rs[0]
    sentiments = Counter(r.sentiment for r in rs)
    tox = [r.toxicity_score for r in rs if r.toxicity_score is not None]
    avatar = next((r.avatar for r in rs if r.avatar), None)
    return {
        "authorId": first.author_id, "name": first.author or "Unknown", "avatar": avatar,
        "profileUrl": f"https://www.youtube.com/channel/{first.author_id}" if first.author_id else None,
        "commentCount": len(rs), "totalLikes": sum(r.likes for r in rs),
        "totalReplies": sum(r.replies for r in rs),
        "positive": sentiments["positive"], "neutral": sentiments["neutral"], "negative": sentiments["negative"],
        "toxicComments": sum(1 for r in rs if r.toxicity_label == "TOXIC"),
        "maxToxicity": round(max(tox), 3) if tox else 0.0,
        "subscribers": first.subscribers, "subscribersFormatted": format_count(first.subscribers),
        "subscribersHidden": first.subscribers_hidden,
    }


def compute_users(rows: List[Row], limit: int = 10) -> dict:
    groups: Dict[str, List[Row]] = defaultdict(list)
    for r in rows:
        groups[r.author_key].append(r)
    profiles = [_profile(rs) for rs in groups.values()]

    most_active = sorted((p for p in profiles if p["commentCount"] >= 2),
                         key=lambda p: (-p["commentCount"], -p["totalLikes"]))
    most_liked = sorted((p for p in profiles if p["totalLikes"] > 0),
                        key=lambda p: (-p["totalLikes"], -p["commentCount"]))
    top_fans = sorted((p for p in profiles
                       if p["positive"] > 0 and p["negative"] == 0 and p["toxicComments"] == 0),
                      key=lambda p: (-p["positive"], -p["totalLikes"]))
    most_critical = sorted((p for p in profiles if p["negative"] > 0),
                           key=lambda p: (-p["negative"], -p["totalLikes"]))
    most_toxic = sorted((p for p in profiles
                         if p["toxicComments"] > 0 or p["maxToxicity"] >= BORDERLINE_THRESHOLD),
                        key=lambda p: (-p["toxicComments"], -p["maxToxicity"]))
    with_subs = [p for p in profiles if p["subscribers"] is not None]
    top_subscribers = sorted(with_subs, key=lambda p: -p["subscribers"])

    return {
        "summary": {
            "uniqueCommenters": len(profiles), "repeatCommenters": len(most_active),
            "averageCommentsPerUser": round(len(rows) / len(profiles), 2) if profiles else 0.0,
            "toxicCommenters": sum(1 for p in profiles if p["toxicComments"] > 0),
            "withSubscriberData": len(with_subs),
        },
        "mostActive": most_active[:limit], "mostLiked": most_liked[:limit],
        "topFans": top_fans[:limit], "mostCritical": most_critical[:limit],
        "mostToxic": most_toxic[:limit], "topSubscribers": top_subscribers[:limit],
    }


def compute_engagement(rows: List[Row]) -> dict:
    total = len(rows)
    likes = sum(r.likes for r in rows)
    replied = sum(1 for r in rows if r.replies > 0)
    return {
        "totalCommentLikes": likes,
        "averageLikesPerComment": round(likes / total, 2) if total else 0.0,
        "totalReplies": sum(r.replies for r in rows),
        "repliedCommentsPercentage": round(replied / total * 100, 1) if total else 0.0,
        "averageCommentLength": round(mean(len(r.text) for r in rows)) if total else 0,
    }


_LIKE_BUCKETS   = [("0", 0, 0), ("1-2", 1, 2), ("3-9", 3, 9), ("10-49", 10, 49), ("50+", 50, None)]
_LENGTH_BUCKETS = [("1-20", 0, 20), ("21-60", 21, 60), ("61-120", 61, 120),
                   ("121-250", 121, 250), ("250+", 251, None)]


def _bucket(value: int, buckets) -> str:
    for label, lo, hi in buckets:
        if value >= lo and (hi is None or value <= hi):
            return label
    return buckets[-1][0]


def compute_charts(rows: List[Row]) -> dict:
    sentiments = ("positive", "neutral", "negative")

    likes = Counter(_bucket(r.likes, _LIKE_BUCKETS) for r in rows)
    likes_by_bucket = [{"label": l, "count": likes.get(l, 0)} for l, _, _ in _LIKE_BUCKETS]

    length: Dict[str, Counter] = defaultdict(Counter)
    for r in rows:
        length[_bucket(len(r.text), _LENGTH_BUCKETS)][r.sentiment] += 1
    length_by_bucket = [{"label": l, **{s: length[l][s] for s in sentiments},
                         "total": sum(length[l].values())} for l, _, _ in _LENGTH_BUCKETS]

    engagement = []
    for s in sentiments:
        group = [r for r in rows if r.sentiment == s]
        total_likes = sum(r.likes for r in group)
        engagement.append({
            "sentiment": s, "comments": len(group), "totalLikes": total_likes,
            "averageLikes": round(total_likes / len(group), 2) if group else 0.0,
            "averageConfidence": round(mean(r.sentiment_score for r in group), 3) if group else 0.0,
        })

    scored = [r for r in rows if r.toxicity_score is not None]
    histogram = [0] * 10
    for r in scored:
        histogram[min(int(r.toxicity_score * 10), 9)] += 1
    toxicity_histogram = [{"label": f"{i * 10}-{i * 10 + 10}%", "count": c} for i, c in enumerate(histogram)]

    cross_tab = {s: {"CLEAN": 0, "BORDERLINE": 0, "TOXIC": 0} for s in sentiments}
    for r in scored:
        cross_tab[r.sentiment][r.toxicity_label or "CLEAN"] += 1

    per_user = Counter(r.author_key for r in rows)
    commenter_buckets = []
    for label, test in (("1 comment", lambda n: n == 1),
                        ("2 comments", lambda n: n == 2),
                        ("3+ comments", lambda n: n >= 3)):
        users = [k for k, n in per_user.items() if test(n)]
        commenter_buckets.append({"label": label, "users": len(users),
                                  "comments": sum(per_user[k] for k in users)})

    return {
        "likesByBucket": likes_by_bucket,
        "lengthBySentiment": length_by_bucket,
        "engagementBySentiment": engagement,
        "toxicityHistogram": toxicity_histogram if scored else [],
        "toxicityBySentiment": cross_tab if scored else {},
        "commenterBuckets": commenter_buckets,
    }


def _comment_item(r: Row, now: datetime) -> dict:
    return {
        "id": r.comment_id, "author": r.author or "Unknown", "authorId": r.author_id,
        "authorAvatar": r.avatar, "sentiment": r.sentiment,
        "score": round(r.sentiment_score, 3), "likes": r.likes, "replies": r.replies,
        "timeAgo": time_ago(r.published_at, now), "publishedAt": r.published_at.isoformat(),
        "text": r.text,
        "toxicity": {
            "score": round(r.toxicity_score, 3) if r.toxicity_score is not None else None,
            "label": r.toxicity_label,
        },
    }


def compute_report(video_like, rows: List[Row], comment_limit: int = 50,
                   now: Optional[datetime] = None) -> dict:
    """`video_like` is anything with .video_id .title .channel_title .channel_id
    .channel_avatar .thumbnail_url .published_at .analyzed_at .created_at
    .view_count .like_count .total_comment_count .duration_seconds .channel_subscribers"""
    now = now or datetime.now(timezone.utc)
    summary = compute_summary(rows)
    dicts = [r.as_dict() for r in rows]
    keywords = keyword_stats(dicts, top_n=15)
    top_comments = sorted(rows, key=lambda r: (-r.likes, -r.published_at.timestamp()))[:comment_limit]
    analyzed_at = getattr(video_like, "analyzed_at", None) or getattr(video_like, "created_at", None)

    return {
        "id": video_like.video_id,
        "url": f"https://www.youtube.com/watch?v={video_like.video_id}",
        "title": video_like.title or "Untitled",
        "channel": video_like.channel_title or "Unknown channel",
        "channelAvatar": getattr(video_like, "channel_avatar", None),
        "thumbnail": getattr(video_like, "thumbnail_url", None),
        "publishedDate": long_date(getattr(video_like, "published_at", None)) or "",
        "analyzedAt": medium_date(analyzed_at) if analyzed_at else "Just Now",
        "totalCommentsAnalyzed": summary["total"],
        "totalViews": format_count(getattr(video_like, "view_count", None)),
        "videoDuration": format_duration(getattr(video_like, "duration_seconds", None)),
        "overallScore": summary["overallScore"],
        "sentimentLabel": summary["sentimentLabel"],
        "sentimentSubtitle": summary["sentimentSubtitle"],
        "breakdown": summary["breakdown"],
        "trendTimeline": compute_trend(rows),
        "highlightLists": compute_highlights(rows),
        "tags": tag_stats(dicts, top_n=24),
        "emojis": emoji_stats(dicts, top_n=6),
        "comments": [_comment_item(r, now) for r in top_comments],
        "topKeywords": keywords,
        "toxicity": compute_toxicity(rows),
        "users": compute_users(rows),
        "engagement": compute_engagement(rows),
        "charts": compute_charts(rows),
        "channelStats": {
            "title": video_like.channel_title,
            "avatar": getattr(video_like, "channel_avatar", None),
            "subscribers": getattr(video_like, "channel_subscribers", None),
            "subscribersFormatted": format_count(getattr(video_like, "channel_subscribers", None)),
            "channelUrl": (f"https://www.youtube.com/channel/{video_like.channel_id}"
                           if getattr(video_like, "channel_id", None) else None),
        },
        "videoStats": {
            "views": getattr(video_like, "view_count", None),
            "likes": getattr(video_like, "like_count", None),
            "totalComments": getattr(video_like, "total_comment_count", None),
            "commentsAnalyzed": summary["total"],
            "durationSeconds": getattr(video_like, "duration_seconds", None),
        },
    }