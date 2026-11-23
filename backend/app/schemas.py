from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Literal
from datetime import datetime


# ─── Jashan's Ingestion Schemas (POST /api/v1/analyze) ───────────────────────

class CommentInput(BaseModel):
    comment_id: str
    author_id: Optional[str] = None
    author: Optional[str] = None
    text: str
    like_count: Optional[int] = 0
    reply_count: Optional[int] = 0
    published_at: Optional[datetime] = None


class IngestionPayload(BaseModel):
    video_id: str
    video_title: Optional[str] = "Untitled"
    channel_id: Optional[str] = None
    channel_title: Optional[str] = None
    published_at: Optional[datetime] = None
    comments: List[CommentInput]


class IngestionResponse(BaseModel):
    job_id: str
    status: str
    total_comments_received: int


#Status Polling (GET /api/v1/status/{job_id})

class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    progress_percentage: int


# ─── Analytics Schemas (Backend → Piyush) 

class SentimentSummaryResponse(BaseModel):
    video_id: str
    total_analyzed: int          # non-spam comments with a sentiment
    breakdown: Dict[str, int]
    positive_ratio: float
    total_comments: int = 0      # all comments, including spam
    spam_count: int = 0
    spam_rate: float = 0.0


class TrendPoint(BaseModel):
    date: str                   # "2026-08-22"
    positive: int
    neutral: int
    negative: int


class TrendsResponse(BaseModel):
    video_id: str
    timeline: List[TrendPoint]


# ─── Live Fetch-and-Analyze (POST /api/v1/fetch-and-analyze) ─────────────────

class FetchAndAnalyzeRequest(BaseModel):
    video_id: str = Field(..., description="YouTube video ID (e.g. 'dQw4w9WgXcQ')")
    max_comments: int = Field(
        default=500,
        ge=1,
        le=5000,
        description="Maximum number of comments to fetch (1–5000, default 500)",
    )
    order: Literal["relevance", "time"] = Field(
        default="relevance",
        description="Sort order for comments: 'relevance' (default) or 'time' (newest first)",
    )


class FetchAndAnalyzeResponse(BaseModel):
    job_id: str
    status: str
    video_id: str
    video_title: str
    total_comments_fetched: int


# ─── Toxicity Report (GET /api/v1/toxicity-report/{video_id}) ────────────────

class ToxicComment(BaseModel):
    comment_id:      str
    author:          Optional[str]
    text:            str
    label_toxicity:  str            # "toxic" | "non-toxic"
    toxicity_score:  float          # toxic confidence 0.0 - 1.0
    sentiment:       Optional[str]
    sentiment_score: Optional[float]
    like_count:      int


class ToxicityReportResponse(BaseModel):
    video_id:            str
    total_analyzed:      int
    total_toxic:         int
    toxicity_rate:       float               # e.g. 0.12 → 12 %
    avg_toxicity_score:  float
    top_toxic_comments:  List[ToxicComment]  # worst offenders, sorted by toxicity_score desc


# ─── Single Comment Analysis Result (GET /api/v1/comment/{comment_id}) ───────
# Matches the exact shape shown in the project spec:
# {
#   "sentiment": "POSITIVE",
#   "sentiment_score": 0.94,
#   "label_toxicity": "non-toxic",
#   "toxicity_score": 0.06
# }

class CommentAnalysisResult(BaseModel):
    comment_id:      str
    text:            str
    is_spam:         bool = False
    spam_score:      Optional[float] = None
    sentiment:       Optional[str] = None     # None for spam comments
    sentiment_score: Optional[float] = None
    label_toxicity:  Optional[str] = None
    toxicity_score:  Optional[float] = None