import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # ── Existing (unchanged) ──────────────────────────────────────────────
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://neondb_owner:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"
    )
    REDIS_URL: str = os.getenv(
        "REDIS_URL",
        "rediss://default:password@your-upstash.upstash.io:6379"
    )
    YOUTUBE_API_KEY: str = os.getenv("YOUTUBE_API_KEY", "")

    MODEL_DIR: str = os.getenv(
        "MODEL_DIR",
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "artifacts"),   # -> app/artifacts
    )
    MODEL_RUN: str = os.getenv("MODEL_RUN", "run2")
    INFERENCE_BATCH_SIZE: int = int(os.getenv("INFERENCE_BATCH_SIZE", "32"))

    # ── NEW: Auth (required by app/ext/security.py & app/ext/auth.py) ─────
    # JWT_SECRET: if empty, app/ext/security.py auto-generates one and stores
    # it in backend/.jwt_secret so logins survive restarts during local dev.
    # ALWAYS set this explicitly in production.
    JWT_SECRET: str = os.getenv("JWT_SECRET", "")
    ACCESS_TOKEN_MINUTES: int = int(os.getenv("ACCESS_TOKEN_MINUTES", "60"))
    REFRESH_TOKEN_DAYS: int   = int(os.getenv("REFRESH_TOKEN_DAYS", "30"))
    MIN_PASSWORD_LENGTH: int  = int(os.getenv("MIN_PASSWORD_LENGTH", "8"))
    ADMIN_EMAILS: list = [
        e.strip().lower()
        for e in os.getenv("ADMIN_EMAILS", "").split(",")
        if e.strip()
    ]

    # ── NEW: CORS (frontend origin) ───────────────────────────────────────
    # The online frontend runs on http://localhost:5173 (Vite default).
    # main.py currently hard-codes allow_origins=["*"]; use this instead.
    CORS_ORIGINS: list = [
        o.strip()
        for o in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if o.strip()
    ]

    # ── NEW: Comment fetching (used by app/ext/youtube.py) ────────────────
    MAX_COMMENTS: int = int(os.getenv("MAX_COMMENTS", "500"))
    CACHE_MINUTES: int = int(os.getenv("CACHE_MINUTES", "30"))


settings = Settings()