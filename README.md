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

**Model Weights:**
Because the fine-tuned model (run2_best.pt) is large (1.03GB), it is not tracked by Git. Thus, we have placed our model files inside backend/app/artifacts/:
1. run2_best.pt
2. config_run2.json
3. backbone_config/ (folder)
4. tokenizer/ (folder)

Environment Variables:
Create a backend/.env file and add your specific keys:

env
DATABASE_URL=postgresql://user:password@host/dbname
REDIS_URL=redis://localhost:6379/0  # Optional: Leave blank to use background threads instead of Celery
YOUTUBE_API_KEY=your_youtube_api_key
JWT_SECRET=super_secret_random_string
CORS_ORIGINS=http://localhost:5173
Database Migration (Important for existing databases):
If you are connecting to an existing PostgreSQL database, run this SQL command in your database (e.g., via Neon SQL Editor) to support video thumbnails:

sql
ALTER TABLE videos ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(500);
Start Backend Server:

bash
uvicorn app.main:app --reload --port 8000
(Optional) If using Celery/Redis for background jobs, start the worker in a new terminal:

bash
celery -A app.tasks.celery_app worker --loglevel=info --pool=solo
2. Frontend Setup
Open a new terminal window:

bash
cd frontend
npm install
Create a frontend/.env file:

env
VITE_API_URL=http://localhost:8000/api/v1
Start Frontend:

bash
npm run dev
Open http://localhost:5173 in your browser to view the app!

📂 Project Structure
text
sentiscope/
├── backend/
│   ├── app/
│   │   ├── artifacts/       # AI Model weights and tokenizers (ignored by Git)
│   │   ├── ext/             # API Adapters (Auth, Community, Reports, Routing)
│   │   ├── models.py        # SQLAlchemy database models
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── model_def.py     # PyTorch Multi-Task HingRoBERTa definition
│   │   └── tasks.py         # Celery background worker tasks
│   ├── requirements.txt
│   └── .env                 # Backend secrets (ignored by Git)
│
└── frontend/
    ├── public/              # Static assets (images, icons)
    ├── src/
    │   ├── components/      # React components (Dashboard, Landing, Common)
    │   ├── context/         # React contexts (Auth, Sentiment, Language)
    │   ├── services/        # API fetch handlers
    │   └── App.jsx
    ├── package.json
    └── .env                 # Frontend environment variables
📡 API Endpoints (Backend Overview)
Authentication
POST /api/v1/auth/register - Create a new account

POST /api/v1/auth/login - Sign in to get JWT tokens

GET /api/v1/auth/me - Get current user profile

Analysis
POST /api/v1/analyze-url - Starts the YouTube scraping & analysis job

GET /api/v1/status/{job_id} - Polls the progress of the analysis

GET /api/v1/report/{video_id} - Generates the full dashboard report JSON

GET /api/v1/history - Fetches the logged-in user's past analyses

🛡️ License
This project is created for educational and portfolio purposes. All rights reserved by the creators.
