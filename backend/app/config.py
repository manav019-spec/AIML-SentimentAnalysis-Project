import os
import urllib.request
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# ── NEW: Download AI model from Hugging Face (for Render deployment) ──────
def download_artifacts_if_missing():
    # REPLACE 'YOUR_HF_USERNAME' with your actual Hugging Face username!
    hf_repo = "hiabn121/sentiscope-model"
    hf_token = os.getenv("HF_TOKEN")
    
    artifacts_dir = Path(os.path.dirname(os.path.abspath(__file__))) / "artifacts"
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    
    # Map Hugging Face root files -> to local subfolder structure
    files_to_download = {
        "run2_best.pt": "run2_best.pt",
        "config_run2.json": "config_run2.json",
        "config.json": "backbone_config/config.json",
        "tokenizer.json": "tokenizer/tokenizer.json",
        "tokenizer_config.json": "tokenizer/tokenizer_config.json"
    }
    
    for hf_file, local_path in files_to_download.items():
        file_path = artifacts_dir / local_path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        if not file_path.exists():
            print(f"Downloading {hf_file} from Hugging Face...")
            url = f"https://huggingface.co/{hf_repo}/resolve/main/{hf_file}?download=true"
            req = urllib.request.Request(url)
            if hf_token:
                req.add_header("Authorization", f"Bearer {hf_token}")
            try:
                with urllib.request.urlopen(req) as response, open(file_path, 'wb') as out_file:
                    out_file.write(response.read())
                print(f"Successfully downloaded {hf_file} -> {local_path}")
            except Exception as e:
                print(f"Error downloading {hf_file}: {e}")

# Run the download check immediately when settings load
download_artifacts_if_missing()
# ──────────────────────────────────────────────────────────────────────────


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