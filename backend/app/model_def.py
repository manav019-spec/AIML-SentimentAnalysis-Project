import json, re
from pathlib import Path

import emoji, wordninja
import torch, torch.nn as nn, torch.nn.functional as F
from transformers import AutoConfig, AutoModel, AutoTokenizer

from app.config import settings

HUB_NAME = "l3cube-pune/hing-roberta-mixed"
LABELS = ["NEGATIVE", "NEUTRAL", "POSITIVE"]

# ---- cleaning: IDENTICAL to training ----
URL_RE = re.compile(r"(?:https?://|www\.)\S+|\b\S+\.(?:com|be|co|in|ly|me)/\S*", re.I)

def clean_comment(text):
    if not isinstance(text, str) or not text.strip():
        return ""
    text = URL_RE.sub(" URL ", text)
    text = emoji.demojize(text, delimiters=(" ", " "))
    text = re.sub(r"[:_]", " ", text)
    text = re.sub(r"@\w+", " ", text)
    def split_tag(m):
        try: words = wordninja.split(m.group(1))
        except Exception: words = [m.group(1)]
        return " " + " ".join(words)
    text = re.sub(r"#(\w+)", split_tag, text)
    return re.sub(r"\s+", " ", text).strip()


class MultiTaskHingRoBERTa(nn.Module):
    def __init__(self, backbone_cfg):
        super().__init__()
        self.backbone = AutoModel.from_config(backbone_cfg)
        h = self.backbone.config.hidden_size
        self.dropout = nn.Dropout(0.1)
        self.spam_head, self.sentiment_head, self.toxicity_head = nn.Linear(h, 2), nn.Linear(h, 3), nn.Linear(h, 2)

    def forward(self, input_ids, attention_mask):
        x = self.backbone(input_ids=input_ids, attention_mask=attention_mask).last_hidden_state[:, 0, :]
        x = self.dropout(x)
        return {"spam_logits": self.spam_head(x), "sentiment_logits": self.sentiment_head(x),
                "toxicity_logits": self.toxicity_head(x)}


class Predictor:
    def __init__(self):
        art, run = Path(settings.MODEL_DIR), settings.MODEL_RUN
        self.cfg = json.load(open(art / f"config_{run}.json", encoding="utf-8"))
        self.thr, self.max_len = self.cfg["thresholds"], self.cfg.get("max_len", 128)
        self.version = f"hingroberta-mt-{run}"
        self.tok = self._load(AutoTokenizer, art / "tokenizer")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = MultiTaskHingRoBERTa(self._load(AutoConfig, art / "backbone_config"))
        res = self.model.load_state_dict(torch.load(art / f"{run}_best.pt", map_location="cpu"), strict=False)
        if res.missing_keys:      # weights the model needs but the file lacks = a real problem
            raise RuntimeError(f"Checkpoint does not match the model. Missing: {res.missing_keys[:5]}")
        self.model.to(self.device).eval()
        print(f"[model] {self.version} loaded on {self.device}; thresholds {self.thr}")

    @staticmethod
    def _load(cls, local):
        try:
            return cls.from_pretrained(str(local))
        except Exception:
            print(f"[model] could not load {local}; falling back to the Hugging Face hub")
            return cls.from_pretrained(HUB_NAME)

    @torch.inference_mode()
    def predict(self, texts, batch_size=32, progress=None):
        cleaned = [clean_comment(t) or "." for t in texts]
        order = sorted(range(len(cleaned)), key=lambda i: len(cleaned[i]))   # similar lengths -> less padding
        out = [None] * len(cleaned)
        for s in range(0, len(order), batch_size):
            ids = order[s:s + batch_size]
            enc = self.tok([cleaned[i] for i in ids], truncation=True, max_length=self.max_len,
                           padding=True, return_tensors="pt").to(self.device)
            o = self.model(enc["input_ids"], enc["attention_mask"])
            sp = F.softmax(o["spam_logits"].float(), -1)[:, 1].cpu().numpy()
            se = F.softmax(o["sentiment_logits"].float(), -1).cpu().numpy()
            tx = F.softmax(o["toxicity_logits"].float(), -1)[:, 1].cpu().numpy()
            for k, i in enumerate(ids):
                spam = bool(sp[k] >= self.thr["spam"])
                r = {"is_spam": spam, "spam_score": float(sp[k]), "sentiment": None, "sentiment_score": None,
                     "label_toxicity": None, "toxicity_score": None}
                if not spam:                      # same gating as in the evaluation
                    c = int(se[k].argmax())
                    r.update(sentiment=LABELS[c], sentiment_score=float(se[k][c]),
                             label_toxicity="toxic" if tx[k] >= self.thr["toxicity"] else "non-toxic",
                             toxicity_score=float(tx[k]))
                out[i] = r
            if progress:
                progress(min(s + batch_size, len(order)), len(order))
        return out


_predictor = None
def get_predictor():
    global _predictor
    if _predictor is None:
        _predictor = Predictor()
    return _predictor