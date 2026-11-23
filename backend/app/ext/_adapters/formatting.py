"""Display-formatting helpers. Output strings match what the React frontend already renders."""
from datetime import datetime, timezone
from typing import Optional


def format_count(n: Optional[int]) -> Optional[str]:
    """182340 -> '182K', 1_250_000 -> '1.2M'. None stays None."""
    if n is None:
        return None
    n = int(n)
    if n >= 1_000_000_000:
        return f"{n / 1_000_000_000:.1f}B".replace(".0B", "B")
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M".replace(".0M", "M")
    if n >= 1_000:
        value = n / 1_000
        return (f"{value:.0f}K" if value >= 100 else f"{value:.1f}K".replace(".0K", "K"))
    return str(n)


def format_duration(seconds: Optional[int]) -> Optional[str]:
    """614 -> '10:14', 3725 -> '1:02:05'."""
    if seconds is None:
        return None
    seconds = int(seconds)
    h, rem = divmod(seconds, 3600)
    m, s = divmod(rem, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def parse_iso_duration(value: Optional[str]) -> Optional[int]:
    """YouTube contentDetails.duration (e.g. 'PT1H2M5S') -> seconds."""
    if not value or not value.startswith("P"):
        return None
    import re
    m = re.fullmatch(r"P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?", value)
    if not m:
        return None
    d, h, mi, s = (int(x) if x else 0 for x in m.groups())
    return d * 86400 + h * 3600 + mi * 60 + s


def long_date(dt: Optional[datetime]) -> Optional[str]:
    """'July 22, 2026'"""
    if dt is None:
        return None
    return f"{dt:%B} {dt.day}, {dt.year}"


def medium_date(dt: Optional[datetime]) -> Optional[str]:
    """'Jul 22, 2026'"""
    if dt is None:
        return None
    return f"{dt:%b} {dt.day:02d}, {dt.year}"


def short_date(dt: datetime) -> str:
    """'Jul 22'"""
    return f"{dt:%b} {dt.day:02d}"


def time_ago(dt: Optional[datetime], now: Optional[datetime] = None) -> str:
    if dt is None:
        return ""
    now = now or datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    seconds = max(0, int((now - dt).total_seconds()))
    for unit_seconds, name in (
        (31_536_000, "year"), (2_592_000, "month"), (604_800, "week"),
        (86_400, "day"), (3_600, "hour"), (60, "minute"),
    ):
        if seconds >= unit_seconds:
            n = seconds // unit_seconds
            return f"{n} {name}{'s' if n != 1 else ''} ago"
    return "just now"


def parse_dt(value) -> Optional[datetime]:
    """Accept datetime / ISO-8601 string (incl. trailing 'Z') / None."""
    if value is None or value == "":
        return None
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    try:
        dt = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
    except ValueError:
        return None
