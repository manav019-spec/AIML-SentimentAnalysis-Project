from pathlib import Path
from app.config import settings

art = Path(settings.MODEL_DIR)
print("MODEL_DIR =", art)
for n in [f"{settings.MODEL_RUN}_best.pt", f"config_{settings.MODEL_RUN}.json", "tokenizer", "backbone_config"]:
    print(("OK       " if (art / n).exists() else "MISSING  ") + n)

from app.model_def import get_predictor

p = get_predictor()
tests = ["yeh movie bahut acchi thi", "yeh video bakwaas hai", "यह गाना बहुत अच्छा है",
         "This song is absolutely amazing, love it", "Worst movie ever, complete waste of time",
         "The match starts at 7 pm tomorrow", "Check out my channel and subscribe https://youtu.be/abc12345678"]
for t, r in zip(tests, p.predict(tests)):
    print(r, "|", t)