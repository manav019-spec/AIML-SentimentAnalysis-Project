# SentiScope — YouTube Comment Sentiment & Toxicity Analysis

SentiScope is a full-stack AI-powered application designed to analyze YouTube comments and uncover meaningful audience insights. Powered by a custom fine-tuned **HingRoBERTa** multilingual model, it performs multi-task classification to identify **Sentiment (Positive, Neutral, Negative), Toxicity (Toxic, Non-Toxic), and Spam** in YouTube comments.

By combining machine learning, data visualization, and an interactive dashboard, SentiScope helps users understand audience opinions, identify harmful or irrelevant content, and explore engagement patterns through actionable insights.

## Features

- **AI-Powered Sentiment Analysis:** Analyzes up to 500 comments per video using a custom-trained PyTorch model.
- **Multi-Task Classification:** Simultaneously predicts sentiment, toxicity, and spam using a shared HingRoBERTa backbone with three specialized classification heads.
- **Toxicity & Spam Detection:** Identifies harmful comments and filters promotional or irrelevant spam to improve the quality of audience insights.
- **Interactive Analytics Dashboard:** Presents results through intuitive visualizations, including donut charts, sentiment trends, emoji reactions, and word clouds.
- **YouTube Integration:** Fetches video information and comments using the YouTube Data API v3.
- **User Authentication:** Implements JWT-based authentication for secure user registration, login, and session management.
- **Analysis History:** Allows users to save, access, and revisit previously generated video analysis reports.
- **Team Section:** Includes a dedicated portfolio section showcasing the project's development team and their contributions.

---

## Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons
- **Backend:** FastAPI, Python, SQLAlchemy
- **Database:** PostgreSQL (Neon)
- **Background Processing:** Celery, Redis, and background threads
- **Machine Learning:** PyTorch, Hugging Face Transformers
- **Pre-trained Backbone:** `l3cube-pune/hing-roberta-mixed`
- **Authentication:** JSON Web Tokens (JWT)
- **External API:** YouTube Data API v3

---

## 👥 The Team

- **Manav Jain** (Team Lead – Full Stack & ML Engineer) – [manav4830.se24@chitkara.edu.in](mailto:manav4830.se24@chitkara.edu.in) | [LinkedIn](https://www.linkedin.com/in/manav-jain-7055b4315)
- **Lakshya Singla** (Backend Engineer) – [lakshya4825.se24@chitkara.edu.in](mailto:lakshya4825.se24@chitkara.edu.in) | [LinkedIn](https://linkedin.com/in/lakshya-singla-a794b931b)
- **Jasanpreet Kaur** (Data Scientist) – [jasanpreet4809.se24@chitkara.edu.in](mailto:jasanpreet4809.se24@chitkara.edu.in) | [LinkedIn](https://linkedin.com/in/jasanpreet-kaur-5905ba264)
- **Piyush Mehta** (Frontend & Data Visualization) – [piyush4855.se24@chitkara.edu.in](mailto:piyush4855.se24@chitkara.edu.in) | [LinkedIn](https://linkedin.com/in/piyush-mehta-6bb09132a)

---

## How to Run Locally

### Prerequisites

Make sure you have the following installed:

- Python 3.10+
- Node.js 18+
- PostgreSQL database (e.g., [Neon](https://neon.tech/))
- YouTube Data API v3 Key

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a Python virtual environment:

```bash
python -m venv venv
```

**Activate the virtual environment:**

Windows:

```powershell
.\venv\Scripts\activate
```

Mac/Linux:

```bash
source venv/bin/activate
```

**Install dependencies:**

```bash
pip install -r requirements.txt
```

### Model Weights

SentiScope uses a custom fine-tuned HingRoBERTa multi-task classification model. Since the trained checkpoint (`run2_best.pt`) is approximately **1.03 GB**, it is not tracked through Git.

The model artifacts must be placed inside:

```text
backend/app/artifacts/
```
or can be found through following drive link: 
https://colab.research.google.com/drive/1PAoHBZOYui7zPhpfxd_hZ6LlYSl1wO_h#scrollTo=Wfnlvd9JD88E

Required model files:

1. `run2_best.pt` – Fine-tuned model checkpoint containing the trained weights for the multi-task architecture.
2. `config_run2.json` – Model configuration, classification thresholds, and inference settings.
3. `backbone_config/` – Hugging Face backbone configuration.
4. `tokenizer/` – Tokenizer files required for preprocessing and inference.

**Important:** Ensure that all model artifacts are available in the configured model directory before starting the backend.

### Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@host/dbname
REDIS_URL=redis://localhost:6379/0
YOUTUBE_API_KEY=your_youtube_api_key
JWT_SECRET=super_secret_random_string
CORS_ORIGINS=http://localhost:5173
```

Redis is optional. If it is not configured, the application can use background threads for processing instead of Celery.

### Database Migration

If you are connecting to an existing PostgreSQL database, execute the following SQL command through your database console or Neon SQL Editor to support video thumbnails:

```sql
ALTER TABLE videos
ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(500);
```

### Start the Backend Server

From the `backend/` directory, run:

```bash
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at:

```text
http://localhost:8000
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

**Optional: Start Celery and Redis for background processing**

If you are using Celery and Redis, ensure your Redis server is running and start the Celery worker in a separate terminal:

```bash
celery -A app.tasks.celery_app worker --loglevel=info --pool=solo
```

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the required Node.js dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Start the Frontend

Run the development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

### In General:

_Terminal 1:_ Run the Backend

```bash
.\venv\Scripts\Activate.ps1
```

```text
uvicorn app.main:app --reload --port 8000
```

(Leave this terminal open. It will say Application startup complete and load your AI model).

_Terminal 2:_ Run the Frontend
Open a new PowerShell window and run:

```text
npm run dev
```
(Leave this terminal open. It will give you a http://localhost:5173 link).

(Optional) _Terminal 3:_ Run Celery (Background Worker)
If you are using Redis and want background processing, open a third terminal window:

```text
.\venv\Scripts\Activate.ps1
celery -A app.tasks.celery_app worker --loglevel=info --pool=solo
```

(If you aren't using Redis right now, you can skip this—the backend will process jobs automatically in the background).

**_SentiScope is now ready to use locally!_**

---

## Project Structure

```text
sentiscope/
│
├── backend/
│   ├── app/
│   │   ├── artifacts/          # Fine-tuned model weights, configs and tokenizers
│   │   ├── ext/                # API adapters (Auth, Community, Reports, Routing)
│   │   ├── models.py           # SQLAlchemy database models
│   │   ├── main.py             # FastAPI application entry point
│   │   ├── model_def.py        # Multi-task HingRoBERTa model and prediction logic
│   │   └── tasks.py            # Celery background worker tasks
│   │
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Backend environment variables (not tracked by Git)
│
├── frontend/
│   ├── public/                 # Static assets, images and icons
│   ├── src/
│   │   ├── components/         # Dashboard, Landing and Common components
│   │   ├── context/            # Authentication, Sentiment and Language contexts
│   │   ├── services/           # API request handlers and integrations
│   │   └── App.jsx             # Main React application
│   │
│   ├── package.json            # Frontend dependencies and scripts
│   └── .env                    # Frontend environment variables
│
└── README.md
```

---

## API Endpoints

The backend exposes RESTful APIs through FastAPI for authentication, video analysis, report generation, and user history.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Registers a new user account. |
| POST | `/api/v1/auth/login` | Authenticates a user and generates JWT tokens. |
| GET | `/api/v1/auth/me` | Retrieves the authenticated user's profile. |

### Video Analysis

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/analyze-url` | Initiates YouTube comment collection and analysis. |
| GET | `/api/v1/status/{job_id}` | Retrieves the progress and status of an analysis job. |
| GET | `/api/v1/report/{video_id}` | Generates and retrieves the complete dashboard report. |
| GET | `/api/v1/history` | Retrieves the authenticated user's previous analyses. |

---

## Machine Learning Architecture

SentiScope uses a custom fine-tuned HingRoBERTa model built on the `l3cube-pune/hing-roberta-mixed` multilingual backbone.

The architecture follows a shared-backbone, multi-task learning approach:

- **Shared Backbone:** Processes input comments and extracts contextual representations.
- **Spam Classification Head:** Predicts whether a comment is spam or legitimate.
- **Sentiment Classification Head:** Classifies comments into Positive, Neutral, or Negative categories.
- **Toxicity Classification Head:** Identifies toxic and non-toxic language.

The model applies a preprocessing pipeline consistent with training, including URL normalization, emoji conversion, mention removal, hashtag segmentation, and text normalization.

Spam detection is applied as a gating mechanism: comments classified as spam are excluded from subsequent sentiment and toxicity interpretation.

---

## License

This project has been developed for educational, research and portfolio purposes.

**All rights reserved by the creators.**
