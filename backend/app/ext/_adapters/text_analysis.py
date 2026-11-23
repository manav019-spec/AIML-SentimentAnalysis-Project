"""Pure-Python text analytics (no ML, no DB): emojis, keywords and topic tags.

Every function takes plain dicts so it can be unit-tested without a database:
    {"text": str, "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE", ...}
"""
import re
from collections import Counter
from typing import Dict, Iterable, List

# ─── Emoji ───────────────────────────────────────────────────────────────────

# Symbols/pictographs, dingbats, misc symbols, stars. Skin-tone modifiers are stripped later.
_EMOJI_RE = re.compile("[\U0001F300-\U0001FAFF\u2600-\u27BF\u2B50\u2B55\u2B1B\u2B1C]")
_SKIN_TONES = set(chr(c) for c in range(0x1F3FB, 0x1F400))

# glyph -> (name, mood)
EMOJI_INFO: Dict[str, tuple] = {
    "🔥": ("Fire", "Excited"), "❤": ("Heart", "Loving"), "😍": ("Heart Eyes", "Loving"),
    "🥰": ("Smiling Hearts", "Loving"), "💖": ("Sparkling Heart", "Loving"),
    "💕": ("Two Hearts", "Loving"), "💗": ("Growing Heart", "Loving"), "💙": ("Blue Heart", "Loving"),
    "🖤": ("Black Heart", "Loving"), "💜": ("Purple Heart", "Loving"), "💛": ("Yellow Heart", "Loving"),
    "👏": ("Applause", "Appreciative"), "🙌": ("Raised Hands", "Grateful"),
    "🙏": ("Folded Hands", "Grateful"), "🚀": ("Rocket", "Inspiring"), "💯": ("Hundred", "Impressed"),
    "😂": ("Laughing", "Amused"), "🤣": ("Rolling on Floor", "Amused"), "😭": ("Crying", "Emotional"),
    "😊": ("Smile", "Happy"), "😀": ("Grin", "Happy"), "😁": ("Beaming", "Happy"),
    "😄": ("Happy Grin", "Happy"), "😃": ("Big Smile", "Happy"), "🙂": ("Slight Smile", "Content"),
    "👍": ("Thumbs Up", "Approving"), "👎": ("Thumbs Down", "Critical"),
    "😡": ("Angry", "Angry"), "😠": ("Annoyed", "Angry"), "🤬": ("Cursing", "Angry"),
    "😢": ("Sad", "Sad"), "😞": ("Disappointed", "Disappointed"), "😒": ("Unimpressed", "Critical"),
    "🙄": ("Eye Roll", "Critical"), "🤔": ("Thinking", "Curious"), "😎": ("Cool", "Confident"),
    "🎉": ("Party", "Celebratory"), "🥳": ("Partying Face", "Celebratory"), "✨": ("Sparkles", "Delighted"),
    "💪": ("Strong", "Motivated"), "🤯": ("Mind Blown", "Amazed"), "🤩": ("Star Struck", "Amazed"),
    "😮": ("Surprised", "Amazed"), "😲": ("Astonished", "Amazed"), "👌": ("OK Hand", "Satisfied"),
    "😅": ("Nervous Laugh", "Amused"), "😉": ("Wink", "Playful"), "😘": ("Blowing Kiss", "Loving"),
    "🥹": ("Touched", "Emotional"), "😔": ("Pensive", "Sad"), "🤡": ("Clown", "Mocking"),
    "💀": ("Skull", "Amused"), "🙈": ("See No Evil", "Amused"), "⭐": ("Star", "Appreciative"),
    "🌟": ("Glowing Star", "Appreciative"), "🏆": ("Trophy", "Impressed"), "🎯": ("Bullseye", "Impressed"),
    "⚡": ("Lightning", "Excited"), "🤝": ("Handshake", "Appreciative"), "😇": ("Angel", "Grateful"),
    "🫡": ("Salute", "Respectful"), "🥺": ("Pleading", "Emotional"), "😴": ("Sleepy", "Bored"),
    "🤮": ("Vomiting", "Critical"), "👀": ("Eyes", "Curious"), "💡": ("Light Bulb", "Inspiring"),
    "📚": ("Books", "Studious"),
}


def extract_emojis(text: str) -> List[str]:
    """All emoji glyphs in `text` (with repeats), normalised: no variation selectors / skin tones."""
    return [c for c in _EMOJI_RE.findall(text or "") if c not in _SKIN_TONES]


def emoji_stats(comments: Iterable[dict], top_n: int = 8) -> List[dict]:
    """Per emoji: number of comments containing it and share of all comments."""
    comments = list(comments)
    total = len(comments)
    doc_freq: Counter = Counter()
    for c in comments:
        doc_freq.update(set(extract_emojis(c.get("text", ""))))

    result = []
    for glyph, count in doc_freq.most_common(top_n):
        name, mood = EMOJI_INFO.get(glyph, ("Emoji", "Expressive"))
        result.append({
            "emoji": glyph,
            "name": name,
            "count": count,
            "percentage": round(count / total * 100, 1) if total else 0.0,
            "mood": mood,
        })
    return result


# ─── Keywords / tags ─────────────────────────────────────────────────────────

_STOPWORDS = set("""
a about above after again against all also am an and any are aren't as at be because been before being
below between both but by can can't cannot could couldn't did didn't do does doesn't doing don't down
during each few for from further get got had hadn't has hasn't have haven't having he her here hers
herself him himself his how i i'd i'll i'm i've if in into is isn't it it's its itself just let's like
me more most my myself no nor not now of off on once only or other ought our ours out over own same
she should shouldn't so some such than that that's the their theirs them themselves then there these
they this those through to too under until up very was wasn't we were weren't what when where which
while who whom why will with won't would wouldn't you you'd you'll you're you've your yours yourself
really much many one two also still even well make made love thanks thank please pls plz sir mam
video videos watch watching watched channel comment comments youtube yt guys guy bro dude video's
hai hain ka ki ke ko se me mein ye yeh tha thi the aur bhi toh nahi nhi kya kaise bhai bhaiya
hi ho hu hum tum aap mai mera meri mujhe apna kar karo kiya wala wali liye lie sab bahut bohot
""".split())

_URL_RE = re.compile(r"https?://\S+|www\.\S+")
_MENTION_RE = re.compile(r"@[\w.\-]+")
_HASHTAG_RE = re.compile(r"#(\w{2,40})")
_WORD_RE = re.compile(r"[^\W\d_][\w'’]*", re.UNICODE)


def _tokens(text: str) -> List[str]:
    text = _URL_RE.sub(" ", text or "")
    text = _MENTION_RE.sub(" ", text)
    text = _HASHTAG_RE.sub(" ", text)
    return [w.replace("’", "'") for w in _WORD_RE.findall(text.lower())]


def _is_keyword(token: str) -> bool:
    return len(token) >= 3 and token not in _STOPWORDS


def _dominant_sentiment(counts: Counter) -> str:
    pos, neu, neg = counts["POSITIVE"], counts["NEUTRAL"], counts["NEGATIVE"]
    if pos > neu and pos > neg:
        return "positive"
    if neg > pos and neg > neu:
        return "negative"
    return "neutral"


def keyword_stats(comments: Iterable[dict], top_n: int = 15, min_count: int = 2) -> List[dict]:
    """Most-mentioned words / two-word phrases, with the dominant sentiment of the comments
    that mention them. Counts are per comment (a word repeated in one comment counts once)."""
    doc_freq: Counter = Counter()
    sentiment_by_term: Dict[str, Counter] = {}

    for c in comments:
        tokens = _tokens(c.get("text", ""))
        terms = {t for t in tokens if _is_keyword(t)}
        for a, b in zip(tokens, tokens[1:]):          # bigrams of adjacent real keywords
            if _is_keyword(a) and _is_keyword(b):
                terms.add(f"{a} {b}")
        sentiment = (c.get("sentiment") or "NEUTRAL").upper()
        for term in terms:
            doc_freq[term] += 1
            sentiment_by_term.setdefault(term, Counter())[sentiment] += 1

    # Drop a single word when a phrase containing it is nearly as frequent ("rest" vs "rest api").
    phrases = {t: n for t, n in doc_freq.items() if " " in t and n >= min_count}
    def covered(word: str, n: int) -> bool:
        return any(word in p.split() and pn >= 0.7 * n for p, pn in phrases.items())

    ranked = sorted(
        ((t, n) for t, n in doc_freq.items()
         if n >= min_count and not (" " not in t and covered(t, n))),
        key=lambda item: (-item[1], -len(item[0].split()), item[0]),
    )[:top_n]

    out = []
    for term, count in ranked:
        s = sentiment_by_term[term]
        out.append({
            "word": term,
            "count": count,
            "sentiment": _dominant_sentiment(s),
            "positive": s["POSITIVE"], "neutral": s["NEUTRAL"], "negative": s["NEGATIVE"],
        })
    return out


def _camel_hashtag(term: str) -> str:
    return "#" + "".join(part.capitalize() for part in re.split(r"[\s'’]+", term) if part)


def tag_stats(comments: Iterable[dict], top_n: int = 10) -> List[dict]:
    """Frontend 'topic tags': real #hashtags used in comments + top keywords as #CamelCase."""
    comments = list(comments)
    tag_freq: Counter = Counter()
    tag_sent: Dict[str, Counter] = {}
    display: Dict[str, str] = {}

    for c in comments:
        sentiment = (c.get("sentiment") or "NEUTRAL").upper()
        for raw in set(_HASHTAG_RE.findall(c.get("text", ""))):
            key = raw.lower()
            display.setdefault(key, "#" + raw)
            tag_freq[key] += 1
            tag_sent.setdefault(key, Counter())[sentiment] += 1

    merged: Dict[str, dict] = {
        key: {"name": display[key], "count": n, "sentiment": _dominant_sentiment(tag_sent[key])}
        for key, n in tag_freq.items()
    }
    for kw in keyword_stats(comments, top_n=top_n * 2):
        tag = _camel_hashtag(kw["word"])
        merged.setdefault(tag.lower().lstrip("#"), {
            "name": tag, "count": kw["count"], "sentiment": kw["sentiment"],
        })

    return sorted(merged.values(), key=lambda t: (-t["count"], t["name"]))[:top_n]
