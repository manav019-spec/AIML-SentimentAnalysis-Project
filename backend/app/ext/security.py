"""Pure-stdlib password hashing + HS256 JWT, following the online project's design."""
import base64, hashlib, hmac, json, secrets, time
from collections import defaultdict, deque
from typing import Deque, Dict, Optional

import os
_JWT_SECRET_ENV = os.getenv("JWT_SECRET", "").strip()


def _jwt_secret() -> str:
    if _JWT_SECRET_ENV:
        return _JWT_SECRET_ENV
    from pathlib import Path
    path = Path(__file__).resolve().parent.parent.parent / ".jwt_secret"
    try:
        if path.exists():
            saved = path.read_text().strip()
            if saved:
                return saved
        generated = secrets.token_urlsafe(48)
        path.write_text(generated)
        return generated
    except OSError:
        return secrets.token_urlsafe(48)


JWT_SECRET = _jwt_secret()
ACCESS_MINUTES = int(os.getenv("ACCESS_TOKEN_MINUTES", "60"))
REFRESH_DAYS   = int(os.getenv("REFRESH_TOKEN_DAYS", "30"))
MIN_PASSWORD   = int(os.getenv("MIN_PASSWORD_LENGTH", "8"))

# scrypt
_N, _R, _P = 2 ** 14, 8, 1


def _b64e(b: bytes) -> str: return base64.urlsafe_b64encode(b).rstrip(b"=").decode()
def _b64d(s: str) -> bytes: return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(password.encode(), salt=salt, n=_N, r=_R, p=_P, dklen=32)
    return f"scrypt${_N}${_R}${_P}${_b64e(salt)}${_b64e(digest)}"


def verify_password(password: str, stored: Optional[str]) -> bool:
    try:
        scheme, n, r, p, salt, digest = (stored or "").split("$")
        if scheme != "scrypt":
            return False
        cand = hashlib.scrypt(password.encode(), salt=_b64d(salt),
                              n=int(n), r=int(r), p=int(p), dklen=32)
        return hmac.compare_digest(cand, _b64d(digest))
    except (ValueError, TypeError):
        return False


_DUMMY_HASH = hash_password("timing-dummy")


def burn_password_check(password: str) -> None:
    verify_password(password, _DUMMY_HASH)


# JWT
class TokenError(Exception):
    def __init__(self, message: str, expired: bool = False):
        super().__init__(message); self.expired = expired


def _sign(signing_input: bytes, secret: str) -> str:
    return _b64e(hmac.new(secret.encode(), signing_input, hashlib.sha256).digest())


def create_token(user_id: int, token_type: str, tv: int, ttl_seconds: int,
                 secret: Optional[str] = None, now: Optional[float] = None) -> str:
    now = int(now if now is not None else time.time())
    header = _b64e(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode())
    payload = _b64e(json.dumps({"sub": str(user_id), "type": token_type, "tv": tv,
                                "iat": now, "exp": now + ttl_seconds},
                               separators=(",", ":")).encode())
    si = f"{header}.{payload}"
    return f"{si}.{_sign(si.encode(), secret or JWT_SECRET)}"


def decode_token(token: str, expected_type: str, secret: Optional[str] = None,
                 now: Optional[float] = None) -> Dict:
    try:
        header_b64, payload_b64, signature = token.split(".")
        header = json.loads(_b64d(header_b64))
        payload = json.loads(_b64d(payload_b64))
    except (ValueError, TypeError, json.JSONDecodeError):
        raise TokenError("Malformed token")
    if header.get("alg") != "HS256":
        raise TokenError("Unsupported algorithm")
    expected = _sign(f"{header_b64}.{payload_b64}".encode(), secret or JWT_SECRET)
    if not hmac.compare_digest(expected, signature):
        raise TokenError("Bad signature")
    if payload.get("type") != expected_type:
        raise TokenError("Wrong token type")
    if int(payload.get("exp", 0)) <= int(now if now is not None else time.time()):
        raise TokenError("Token expired", expired=True)
    return payload


def issue_token_pair(user) -> Dict[str, str]:
    return {
        "access_token": create_token(user.id, "access", user.token_version, ACCESS_MINUTES * 60),
        "refresh_token": create_token(user.id, "refresh", user.token_version, REFRESH_DAYS * 86400),
        "token_type": "bearer",
        "expires_in": ACCESS_MINUTES * 60,
    }


class RateLimiter:
    def __init__(self, limit: int, window: int):
        self.limit, self.window = limit, window
        self._hits: Dict[str, Deque[float]] = defaultdict(deque)

    def _prune(self, key, now):
        q = self._hits[key]
        while q and q[0] <= now - self.window:
            q.popleft()
        return q

    def allow(self, key, now=None):
        now = now if now is not None else time.time()
        q = self._prune(key, now)
        if len(q) >= self.limit:
            return False
        q.append(now); return True

    def blocked(self, key, now=None):
        now = now if now is not None else time.time()
        return len(self._prune(key, now)) >= self.limit

    def hit(self, key, now=None):
        now = now if now is not None else time.time()
        self._prune(key, now).append(now)

    def reset(self, key):
        self._hits.pop(key, None)