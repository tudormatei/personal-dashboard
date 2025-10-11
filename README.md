## Personal Dashboard — Weight, Calories, Macros & Workouts

Track your health metrics in one place and easily import Apple Health data.

![Weight Page](./docs/weight.png)
![Macros Page](./docs/macros.png)
![Workouts Page](./docs/workouts.png)

### Description

Personal Dashboard is a privacy‑first web app for visualizing your weight, calories, macronutrients, and workouts over time. It gives you a single, simple place to see trends, set targets, and stay consistent—without surrendering your data to third parties. You can import Apple Health data to backfill historical records quickly and keep everything self‑hosted.

Key goals:

- Keep your data local and portable (SQLite by default)
- Fast, frictionless viewing of trends and summaries
- Easy import of Apple Health data (weight, workouts, dietary intake)

---

### Features

- **Unified Dashboard**: View weight, calories, macros, and workout summaries.
- **Apple Health Import**: Upload your Health export XML to backfill data.
- **Weight Trends**: Daily averages and moving averages (7/30/90‑day windows).
- **Macros & Calories**: Per‑day totals, moving averages, and period summaries.
- **Workout Analytics**: Session counts, durations, weekly/monthly breakdowns, and streaks.
- **Maintenance Estimator**: Estimate maintenance calories from weight trend vs calorie intake.
- **Local Storage**: SQLite database created and managed automatically.
- **Responsive UI**: Vite + React frontend; charts via Recharts.

### Todo:

- Finance:
  - Have expense tracker linked to bank account (specifically for rent utilities and groceries)
- Productivity
  - Leetcode / study helper + ollama to generate proper insights from notion notes

---

### Tech Stack

- **Backend**: FastAPI (Python 3.11), Uvicorn
- **Parsing & Analytics**: pandas, numpy, scikit‑learn
- **Database**: SQLite (file at `backend/app/db/db.sqlite3`)
- **Frontend**: React + TypeScript + Vite, Recharts, React Router
- **Containers**: Dockerfiles for backend and frontend + Docker Compose

Minimum recommended versions:

- Python 3.11+
- Node.js 18+ (or 20+)

---

### Installation

Prerequisites:

- Python 3.11+
- Node.js 18+
- Git

Clone the repository:

```bash
git clone https://github.com/tudormatei/personal-dashboard
cd personal-dashboard
```

Backend setup (FastAPI):

```bash
cd backend
python -m venv .venv
source .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend setup (Vite React):

```bash
cd frontend
npm install
npm run dev
```

Open the frontend at `http://localhost:5173` and the API at `http://localhost:8000`.

Docker:

```bash
docker compose up --build
```

---

### Usage

1. Import Apple Health data

- On iPhone: Health app → Profile → Export All Health Data → save `export.zip`.
- Send `export.zip` to your computer and unzip to get `export.xml` (or keep as XML inside zip if you prefer extracting the XML only).
- Use the API endpoint below to upload the XML. A simple UI upload may exist in the frontend; otherwise, use `curl`.

API endpoints (base: `http://localhost:8000/api`):

```bash
# Import Apple Health XML (content-type: multipart/form-data)
curl -X POST \
  -F "file=@/path/to/export.xml" \
  http://localhost:8000/api/health

# Weight history (supports start_date, end_date, ma_windows, target_weight)
curl "http://localhost:8000/api/weight?start_date=2024-01-01&ma_windows=7,30,90&target_weight=80"

# Macros (supports start_date, end_date, ma_windows, target_values like calories:2500,protein:160)
curl "http://localhost:8000/api/macros?start_date=2024-01-01&target_values=calories:2500,protein:160"

# Maintenance calories estimate
curl "http://localhost:8000/api/maintenance?start_date=2024-01-01&min_daily_calories=2500"

# Workout stats (supports start_date, end_date)
curl "http://localhost:8000/api/workouts?start_date=2024-01-01"
```

2. Explore charts and summaries in the frontend

- The React app (Vite) uses Recharts for interactive graphs.
- Weight and macro views support 7/30/90‑day moving averages.
- Workouts include totals, weekly/monthly breakdowns, and streaks.

3. Data storage

- The backend stores imported data in `backend/app/db/db.sqlite3`.
- Re‑importing replaces previous `health_records` and `workouts` tables with fresh data.
