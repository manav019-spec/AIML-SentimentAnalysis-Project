from pydantic import BaseModel, Field
from typing import List, Optional


class CommentInput(BaseModel):
    comment_id: str
    author_id: Optional[str] = None
    author: Optional[str] = None
    author_avatar: Optional[str] = None
    text: str
    like_count: Optional[int] = 0
    reply_count: Optional[int] = 0
    published_at: Optional[str] = None


class IngestionPayload(BaseModel):
    video_id: str
    video_title: Optional[str] = "Untitled"
    channel_id: Optional[str] = None
    channel_title: Optional[str] = None
    published_at: Optional[str] = None
    thumbnail_url: Optional[str] = None
    channel_avatar: Optional[str] = None
    channel_subscribers: Optional[int] = None
    view_count: Optional[int] = None
    like_count: Optional[int] = None
    duration_seconds: Optional[int] = None
    comments: List[CommentInput]


class AnalyzeUrlRequest(BaseModel):
    url: str
    max_comments: Optional[int] = Field(None, ge=10, le=2000)
    refresh: bool = False


class AnalyzeUrlResponse(BaseModel):
    job_id: str
    video_id: str
    status: str
    cached: bool = False


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    progress_percentage: int
    video_id: Optional[str] = None
    stage: Optional[str] = None
    total_comments: Optional[int] = None
    error_type: Optional[str] = None
    error_message: Optional[str] = None


class RegisterBody(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., max_length=255)
    password: str = Field(..., max_length=200)


class LoginBody(BaseModel):
    email: str = Field(..., max_length=255)
    password: str = Field(..., max_length=200)


class RefreshBody(BaseModel):
    refresh_token: str


class UpdateProfileBody(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class ChangePasswordBody(BaseModel):
    current_password: Optional[str] = Field(None, max_length=200)
    new_password: str = Field(..., max_length=200)


class ContactBody(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., max_length=255)
    message: str = Field(..., min_length=5, max_length=3000)