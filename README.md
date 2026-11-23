# SentiScope — YouTube Comment Sentiment & Toxicity Analysis

SentiScope is a full-stack AI application that analyzes YouTube comments to extract deep audience insights. It uses a custom fine-tuned **HingRoBERTa** (multilingual) model to perform multi-task classification: **Sentiment** (Positive/Neutral/Negative), **Toxicity** (Toxic/Non-Toxic), and **Spam** detection.

## ✨ Features
- **Instant NLP Scoring:** Analyzes up to 500 comments per video using a custom PyTorch model.
- **Toxicity & Spam Filtering:** Automatically isolates promotional spam and flags toxic language.
- **Interactive Dashboard:** Beautiful data visualizations (Donut charts, Trend lines, Emoji reactions, Word clouds).
- **User Accounts & History:** JWT-based authentication to save and reopen your analysis reports.
- **Team Section:** Built-in portfolio page for the development team.

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL (Neon), Celery & Redis
- **Machine Learning:** PyTorch, Hugging Face Transformers (`l3cube-pune/hing-roberta-mixed`)

---

## 👥 The Team
- **Manav Jain** (Team Lead - Full Stack & ML Engineer) - [manav4830.se24@chitkara.edu.in](mailto:manav4830.se24@chitkara.edu.in) | [LinkedIn](https://www.linkedin.com/in/manav-jain-7055b4315)
- **Lakshya Singla** (Backend Engineer) - [lakshya4825.se24@chitkara.edu.in](mailto:lakshya4825.se24@chitkara.edu.in) | [LinkedIn](https://linkedin.com/in/lakshya-singla-a794b931b)
- **Jasanpreet Kaur** (Data Scientist) - [jasanpreet4809.se24@chitkara.edu.in](mailto:jasanpreet4809.se24@chitkara.edu.in) | [LinkedIn](https://linkedin.com/in/jasanpreet-kaur-5905ba264)
- **Piyush Mehta** (Frontend & Data Viz) - [piyush4855.se24@chitkara.edu.in](mailto:piyush4855.se24@chitkara.edu.in) | [LinkedIn](https://linkedin.com/in/piyush-mehta-6bb09132a)

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL database (e.g., [Neon](https://neon.tech/))
- YouTube Data API v3 Key

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Activate the virtual environment:
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt