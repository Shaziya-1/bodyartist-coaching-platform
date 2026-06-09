# Backend Setup Guide

This guide explains how to set up, configure, and run the Python backend for the Coach-Athlete Coaching and Nutrition Platform.

All commands should be run from the **project root directory** (`coach-athlete/`).

---

## Steps to Setup and Run

### 1. Create a Virtual Environment
If you are using Python's built-in `venv`:
```bash
python -m venv venv
```
If you are using `conda`:
```bash
conda create -n coach-athlete python=3.10 -y
```

### 2. Activate the Virtual Environment
If you are using `venv` (Windows):
```bash
.\venv\Scripts\activate
```
If you are using `conda`:
```bash
conda activate coach-athlete
```

### 3. Install Dependencies
```bash
pip install -r backend/requirements.txt
```
*(If you don't have a requirements file yet, make sure `fastapi`, `uvicorn`, `sqlalchemy`, `psycopg2-binary`, and `python-dotenv` are installed).*

### 4. Configure Database & Environment Variables
Create a file named `.env` inside the `backend/` directory:
```env
# backend/.env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/coach-athlete
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
LOGMEAL_API_KEY=your_logmeal_token_here
```
> Make sure to replace `your_password` with your local PostgreSQL password, and ensure that a database named `coach-athlete` exists on your PostgreSQL server.

### 5. Create Database Tables (Run Test)
Run this command from the root directory to verify your database connection and automatically generate the tables:
```bash
python -m backend.app.tests.test_dbconnection
```

### 6. Run the Application
Start the FastAPI development server:
```bash
python -m backend.main
```
The server will start running on [http://localhost:8000](http://localhost:8000). You can check the documentation/Swagger UI at [http://localhost:8000/docs](http://localhost:8000/docs).
