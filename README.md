# Body Artist Coaching & Nutrition Platform

A responsive, responsive web-based platform designed for specialized coaching groups training enhanced athletes. The platform provides coaches with complete visibility into their athletes' daily metrics (diet, water, supplements, workouts, cardio, steps, adherence score) via a high-fidelity dashboard. Athletes get a frictionless mobile-first interface featuring image-based meal logging powered by computer-vision APIs.

---

## Table of Contents
1. [Product Overview](#product-overview)
2. [User Roles & Key Features](#user-roles--key-features)
3. [The Adherence Scoring Model](#the-adherence-scoring-model)
4. [AI Vision Pipeline & Accuracy Strategy](#ai-vision-pipeline--accuracy-strategy)
5. [Database Schema (Supabase/PostgreSQL)](#database-schema-supabasepostgresql)
6. [Row-Level Security (RLS) Policy Guide](#row-level-security-rls-policy-guide)
7. [Test Phase & Cost-Estimation Methodology](#test-phase--cost-estimation-methodology)
8. [Data Privacy & Compliance](#data-privacy--compliance)
9. [Development Phasing](#development-phasing)

---

## Product Overview

*   **Goal**: Simplify and centralize the monitoring of diet, hydration, supplements, and workout adherence for elite athletes, reducing tracking friction to a minimum using AI photo logging.
*   **Target Users**: Coaching groups and their roster of athletes.
*   **Key Value**: A single "Performance Score" and a GitHub-style heatmap per athlete, allowing coaches to identify non-adherence in less than 10 seconds.
*   **Test Phase Focus**: Gather empirical data on AI vision API usage, failure rates, and storage growth to model exact pricing before launching commercial tiers.

---

## User Roles & Key Features

### 1. Coach (Admin Dashboard)
*   **Bento Grid Landing**: A responsive bento-grid dashboard where each athlete is represented by a card showing their current score, streak, adherence strip, and status color. Low-adherence or highly flagged athletes are promoted to larger cards.
*   **Diet & Target Management**: Coaches set targets per athlete:
    *   Target meals per day.
    *   Macro targets (Protein, Carbs, Fats, Calories).
    *   Micronutrient targets (optional).
    *   Water intake target.
    *   Supplement checklists (customizable checklist of items marked as *required* or *optional*).
    *   Physical exercise targets (workout checkbox, cardio minutes, daily steps).
    *   Macro tolerance percentage (allowable variance).
*   **Adherence Heatmap**: A contribution-style grid (green-to-red gradient) representing historical daily performance scores.
*   **Time-Series Charts**: Sleek, clean graphs displaying trends for daily scores, macros, hydration, and body weight.
*   **Detailed Drill-down**: Click-through dashboard showing comprehensive logging history, meal photo galleries, and score details.

### 2. Athlete App (Mobile-First)
*   **Photo Meal Logging**: Upload or take a picture of a meal $\rightarrow$ server calls Vision API $\rightarrow$ system estimates nutrition breakdown $\rightarrow$ user confirms/nudges values $\rightarrow$ values are logged.
*   **Manual Metric Logging**: Easy checkboxes for supplements, input fields/quick counters for water intake, and exercise logs.
*   **Goals & Streak Tracker**: Daily checklist showing current completion rates, current streaks, and the running daily score.
*   **Self-History View**: Personal charts and heatmaps.

---

## The Adherence Scoring Model

The Daily Adherence Score is a weighted value from **0 to 100**, calculated based on completion of coach-configured targets. 

### Weighted Inputs (Default Configuration)
1.  **Meals Logged (Highest Weight)**: Completion-aware tracking (e.g., logging the required 5 meals). Adherence to macro targets is tracked separately in charts to avoid penalizing noisy AI estimates.
2.  **Supplement Checklist**: Percentage of required supplements checked off.
3.  **Water Intake**: Reaching or exceeding target glasses/volume.
4.  **Workouts & Cardio/Steps**: Met targets for steps, cardio minutes, or workout completion (if enabled by coach).

### Heatmap Color Map
*   **Green (High)**: 85 - 100
*   **Yellow/Orange (Mid)**: 50 - 84
*   **Red (Low)**: 0 - 49

---

## AI Vision Pipeline & Accuracy Strategy

To balance frictionless logging with data reliability, the pipeline utilizes a **Human-in-the-Loop** model.

```
[Athlete Photo Upload] 
         │
         ▼
[Vision API Call (LogMeal / Spike)] 
         │
         ▼
[Display Estimated Nutrition + Confidence Indicators]
         │
         ▼
[Athlete Confirm / Nudge Portion Step]  <-- Mitigates data-quality risk
         │
         ▼
[Commit to DB and Daily Score Calculation]
```

*   **Primary API**: LogMeal (Nutritional Information API returns micronutrients like B12, Calcium, Iron, Potassium, Zinc, etc.).
*   **Fallback API**: Spike Nutrition API.
*   **Accuracy Disclaimer**: Computer-vision estimation for food remains directional. All micronutrient outputs in the UI will be clearly marked as **estimates** accompanied by confidence values to manage expectations and ensure coaching decisions are based on realistic telemetry.

---

## Database Schema (Supabase/PostgreSQL)

This schema models the relationships cleanly. The relational design avoids denormalization (such as list columns for relations) and implements structured `JSONB` objects for highly customizable targets and logging.

```sql
-- Enable PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PROFILES (Linked to Supabase Auth)
-- ==========================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('coach', 'athlete')),
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Stores base user details and application roles.';

-- ==========================================
-- 2. ATHLETES (Linked to Profiles)
-- ==========================================
CREATE TABLE public.athletes (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    bmr NUMERIC(6,2),
    tdee NUMERIC(6,2),
    current_streak INT NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak INT NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.athletes IS 'Extends profiles with athlete-specific metadata, caching streaks and energy calculations.';

-- ==========================================
-- 3. DIET PLANS (Coach Settings)
-- ==========================================
CREATE TABLE public.diet_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID UNIQUE NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    target_meals_per_day INT NOT NULL DEFAULT 4 CHECK (target_meals_per_day > 0),
    target_protein NUMERIC(5,1) NOT NULL CHECK (target_protein >= 0), -- in grams
    target_carbs NUMERIC(5,1) NOT NULL CHECK (target_carbs >= 0),   -- in grams
    target_fat NUMERIC(5,1) NOT NULL CHECK (target_fat >= 0),       -- in grams
    target_calories NUMERIC(6,1) NOT NULL CHECK (target_calories >= 0), -- in kcal
    micronutrient_targets JSONB NOT NULL DEFAULT '{}'::jsonb,        -- e.g., {"fiber": 30, "sodium": 2000}
    water_target_glasses INT NOT NULL DEFAULT 8 CHECK (water_target_glasses >= 0),
    supplement_checklist JSONB NOT NULL DEFAULT '[]'::jsonb,         -- e.g., [{"name": "Creatine", "required": true}]
    workout_target_completed BOOLEAN NOT NULL DEFAULT FALSE,
    cardio_target_minutes INT NOT NULL DEFAULT 0 CHECK (cardio_target_minutes >= 0),
    step_target INT NOT NULL DEFAULT 0 CHECK (step_target >= 0),
    macro_tolerance_percent NUMERIC(4,2) NOT NULL DEFAULT 10.0 CHECK (macro_tolerance_percent >= 0 AND macro_tolerance_percent <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.diet_plans IS 'Diet and adherence targets configured by the Coach for each Athlete.';

-- ==========================================
-- 4. BODY METRICS (Weigh-ins & Measurements)
-- ==========================================
CREATE TABLE public.body_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    weight NUMERIC(5,2) NOT NULL CHECK (weight > 0), -- weight in kg
    body_fat_percent NUMERIC(4,2) CHECK (body_fat_percent IS NULL OR (body_fat_percent >= 0 AND body_fat_percent <= 100)),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_body_metrics_athlete_recorded_at ON public.body_metrics(athlete_id, recorded_at DESC);
COMMENT ON TABLE public.body_metrics IS 'Historical logs of athlete weigh-ins and body metrics.';

-- ==========================================
-- 5. MEAL LOGS (AI Food Estimates)
-- ==========================================
CREATE TABLE public.meal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    photo_url TEXT, -- Path inside Supabase Storage bucket
    food_name TEXT NOT NULL,
    
    -- Vision Pipeline Metadata
    raw_vision_response JSONB,
    confidence_score NUMERIC(3,2) CHECK (confidence_score IS NULL OR (confidence_score >= 0.0 AND confidence_score <= 1.0)),
    
    -- API Estimates
    estimated_calories NUMERIC(6,2) CHECK (estimated_calories >= 0),
    estimated_protein NUMERIC(5,2) CHECK (estimated_protein >= 0),
    estimated_carbs NUMERIC(5,2) CHECK (estimated_carbs >= 0),
    estimated_fat NUMERIC(5,2) CHECK (estimated_fat >= 0),
    estimated_micronutrients JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Committed Values (Edited/Confirmed by Athlete)
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    edited_calories NUMERIC(6,2) CHECK (edited_calories >= 0),
    edited_protein NUMERIC(5,2) CHECK (edited_protein >= 0),
    edited_carbs NUMERIC(5,2) CHECK (edited_carbs >= 0),
    edited_fat NUMERIC(5,2) CHECK (edited_fat >= 0),
    edited_micronutrients JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_meal_logs_athlete_logged_at ON public.meal_logs(athlete_id, logged_at DESC);
COMMENT ON TABLE public.meal_logs IS 'Chronological record of photo-captured and hand-adjusted athlete meals.';

-- ==========================================
-- 6. DAILY LOGS (Aggregated Adherence)
-- ==========================================
CREATE TABLE public.daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    water_intake_glasses INT NOT NULL DEFAULT 0 CHECK (water_intake_glasses >= 0),
    supplement_checkoffs JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g., [{"name": "Creatine", "completed": true}]
    workout_completed BOOLEAN NOT NULL DEFAULT FALSE,
    cardio_minutes_completed INT NOT NULL DEFAULT 0 CHECK (cardio_minutes_completed >= 0),
    steps_completed INT NOT NULL DEFAULT 0 CHECK (steps_completed >= 0),
    computed_daily_score INT NOT NULL DEFAULT 0 CHECK (computed_daily_score >= 0 AND computed_daily_score <= 100),
    color_bucket VARCHAR(10) NOT NULL CHECK (color_bucket IN ('green', 'yellow', 'orange', 'red')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (athlete_id, date)
);

CREATE INDEX idx_daily_logs_athlete_date ON public.daily_logs(athlete_id, date DESC);
COMMENT ON TABLE public.daily_logs IS 'Daily completion stats and aggregate performance metrics driving heatmaps.';

-- ==========================================
-- 7. VISION API CALLS (Cost Telemetry)
-- ==========================================
CREATE TABLE public.vision_api_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    api_provider VARCHAR(50) NOT NULL, -- 'LogMeal', 'Spike'
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'error')),
    error_message TEXT,
    retry_count INT NOT NULL DEFAULT 0,
    estimated_cost NUMERIC(6,4) NOT NULL DEFAULT 0.0000, -- in USD (e.g. 0.0512)
    image_size_bytes INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vision_api_calls_athlete ON public.vision_api_calls(athlete_id, timestamp DESC);
COMMENT ON TABLE public.vision_api_calls IS 'Detailed logging of external computer vision requests to calculate per-athlete usage cost.';
```

---

## Row-Level Security (RLS) Policy Guide

To satisfy data handling, privacy laws, and security standards, Supabase RLS is configured to restrict unauthorized access:

### Profiles Table
*   **SELECT**: Authenticated users can view their own profile, or coaches can view profiles of their assigned athletes.
*   **UPDATE**: Users can only update their own profile fields.
*   **INSERT/DELETE**: Restricted to system-level/admin actions.

### Athletes Table
*   **SELECT**: Athletes can read their own row. Coaches can read rows where `coach_id = auth.uid()`.
*   **UPDATE**: Coaches can modify target metrics/configurations, while athletes can read.
*   **INSERT/DELETE**: Coach-only or auto-created during provisioning.

### Diet Plans, Body Metrics, Meal Logs, Daily Logs
*   **SELECT**: Athletes can view their own records. Coaches can view records for any athlete whose `coach_id` matches the coach's ID.
*   **INSERT/UPDATE/DELETE**:
    *   *Diet Plans*: Coaches write/edit. Athletes can only select.
    *   *Meal Logs, Body Metrics, Daily Logs*: Athletes can write/edit. Coaches can view (and optionally add weigh-ins/body metrics).

---

## Test Phase & Cost-Estimation Methodology

Pricing modeling is deferred until actual operational telemetry is gathered. A **2-4 week closed test** will be conducted.

### 1. Key Metrics Recorded (Stored in `vision_api_calls`)
*   **Average Photos/Day/Athlete**: Frequency of camera usage.
*   **Success vs. Fail/Retry Rates**: Measuring how often network errors, low lighting, or bad framing trigger costly retries.
*   **Cost Multiplier**: The actual cumulative provider cost compared to a single-take baseline.
*   **Storage Overhead**: Tracking file footprint growth inside the Supabase Storage Bucket.

### 2. Output
At test completion, a report will generate a **per-athlete monthly cost band** (Low, Expected, High) factoring in:
$$\text{Cost/Athlete} = (\text{Avg. Daily Uploads} \times \text{Retry Factor} \times \text{Per-Image API Charge} \times 30) + \text{Pro-rated DB/Storage Seat Cost}$$

---

## Data Privacy & Compliance

In alignment with **India's DPDP Act 2025** regarding health data and personal identifiers:
1.  **Onboarding Consent**: Athletes must explicitly accept data storage policies and acknowledge that meal photos are processed by designated third-party APIs (LogMeal/Spike).
2.  **Strict Isolation**: RLS policies prevent database leaks across athletes.
3.  **Data Deletion**: A clear workflow allows athletes to purge historical photos and account records, erasing files from both Database and Storage Buckets.

---

## Development Phasing

### Phase 0: Foundations & Manual Tracking
*   Set up Supabase Auth, Profiles, and Roles.
*   Implement coach panel for provisioning athletes and setting up `diet_plans`.
*   Manual check-offs for water, steps, cardio, workouts, and supplement checklists.
*   Calculated daily score and streak, rendering the Bento grid, Adherence Heatmap, and simple graphs.

### Phase 1: AI Vision & Core Logic Integration
*   Integrate backend endpoint with LogMeal / Spike APIs.
*   Build photo capturing/upload interface with the "Confirm / Nudge" adjustment pane.
*   Enable `vision_api_calls` telemetry tracking.
*   Implement Storage Bucket cleanup routines.

### Phase 2: Pilot and Pricing Formulation
*   Run the closed group test.
*   Collect and analyze telemetry logs to establish baseline pricing models.
*   Refine scoring thresholds.
