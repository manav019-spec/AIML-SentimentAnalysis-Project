
from sqlalchemy import Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class Video(Base):
    __tablename__ = "videos"

    video_id      = Column(String(50), primary_key=True, index=True)
    title         = Column(String(255), nullable=True)
    channel_id    = Column(String(100), nullable=True)
    channel_title = Column(String(255), nullable=True)
    published_at  = Column(DateTime(timezone=True), nullable=True)
    created_at    = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    comments = relationship("Comment", back_populates="video", cascade="all, delete-orphan")


class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"

    job_id              = Column(String(100), primary_key=True, index=True)
    video_id            = Column(String(50), ForeignKey("videos.video_id", ondelete="CASCADE"), index=True)
    status              = Column(String(20), default="PENDING")
    progress_percentage = Column(Integer, default=0)
    created_at          = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # ── NEW optional columns ──
    stage          = Column(String(30), nullable=True)
    total_comments = Column(Integer, nullable=True)
    error_type     = Column(String(40), nullable=True)
    error_message  = Column(Text, nullable=True)

class Comment(Base):
    __tablename__ = "comments"

    id           = Column(Integer, primary_key=True, index=True)
    comment_id   = Column(String(100), unique=True, index=True)
    video_id     = Column(String(50), ForeignKey("videos.video_id", ondelete="CASCADE"), index=True)
    author_id    = Column(String(100), index=True, nullable=True)
    author       = Column(String(100), nullable=True)
    text         = Column(Text, nullable=False)
    like_count   = Column(Integer, default=0)
    reply_count  = Column(Integer, default=0)

    # ML Sentiment
    sentiment       = Column(String(20))   # POSITIVE | NEUTRAL | NEGATIVE
    sentiment_score = Column(Float)        # Confidence 0.0 - 1.0

    # ML Toxicity
    label_toxicity  = Column(String(20), default="non-toxic")
    toxicity_score  = Column(Float, default=0.0)

    # ML Spam (new)
    is_spam       = Column(Boolean, default=False, index=True)
    spam_score    = Column(Float)
    model_version = Column(String(40))

    published_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    video = relationship("Video", back_populates="comments")
