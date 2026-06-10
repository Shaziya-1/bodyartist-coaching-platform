# Coach-Athlete Project Rules & Guidelines

This document serves as the system prompt and behavioral guide for AI Agents working in this repository.

---

## 1. Tech Stack & Architecture

*   **Backend**: Python 3.10+, FastAPI, SQLAlchemy (relational database mapping, default PostgreSQL), Uvicorn.
*   **Frontend**: React (Vite + TypeScript), Vanilla CSS styling (premium, clean look, HSL colors). *No TailwindCSS unless explicitly requested.*
*   **Database**: Supabase / PostgreSQL.
*   **Directory Structure**:
    *   `/backend` - FastAPI server and modules.
    *   `/frontend` - React + Vite user interface.
    *   `/.agents/skills` - Installed agent skills.

---

## 2. Command Reference

All commands must be executed with reference to the root directory `coach-athlete/`.

### Virtual Environment (Python)
*   **Activate**: `.\venv\Scripts\activate` (or conda activate coach-athlete)
*   **Install Deps**: `pip install -r backend/requirements.txt`

### Backend Commands
*   **Run Dev Server**: `python -m backend.main`
*   **Run DB Connection/Migrate Test**: `python -m backend.app.tests.test_dbconnection`

### Frontend Commands
*   **Install Deps**: `cd frontend && npm install`
*   **Run Dev Server**: `cd frontend && npm run dev`

---

## 3. Database & Model Standards (SQLAlchemy)

*   **Imports**: All modules in `backend/app/` must use absolute imports starting with the `backend` prefix (e.g. `from backend.app.config.database import Base` instead of `from app.config...`). This allows running files as modules from the root workspace directory.
*   **Self-Referencing Relations**: Use clean, standard parent-child relation formats with `backref` for coaches and athletes:
    ```python
    coach = relationship("User", remote_side=[id], backref="athletes")
    ```
*   **JSONB usage**: Store checklist requirements (like `supplement_checklist`) and daily log checkoffs as structured `JSONB` to allow dynamic changes without altering table structures.
*   **Body Weight Metrics**: Maintain historical weights inside a `body_metrics` table for time-series scaling, instead of flat list properties.

---

## 4. Front-End Design & UX Rules

*   **Aesthetics**: Create a custom, premium dashboard feel (bento layout, HSL tailored variables, dark modes, soft gradients, responsive cards). No plain basic templates.
*   **Photo Logging flow**: Keep meal tracking frictionless. When a photo is uploaded:
    1.  Submit it to the AI vision endpoint.
    2.  Display returned macros and micronutrients.
    3.  **Mandatory**: Provide a "Confirm / Nudge" adjustment screen before saving it to the database. Do not commit values immediately.
*   **Micronutrients**: Clearly label micronutrient values as "directional estimates" with confidence levels.

---

## 5. Compliance & Security

*   **DPDP Act 2025**:
    *   Explicitly show a consent prompt during athlete onboarding to save health telemetry and meal photos.
    *   Ensure all database tables have Row-Level Security (RLS) enabled so athletes can only read/write their own records, and coaches can only see athletes assigned to them (`coach_id`).
