---
name: coach-athlete
description: Specialized workflows for implementing and testing the Coach-Athlete platform's core scoring, API vision, and Tailwind Bento UI components.
---

# Coach-Athlete Development Workflows

Instructions for the agent when creating, modifying, or testing the core components of the Coach-Athlete Coaching and Nutrition Platform.

## When to use
Use this skill when:
1.  **Backend Adherence Scoring**: Implementing or modifying the daily score calculation (0-100) and color-bucket classification in FastAPI.
2.  **AI Vision Pipeline**: Connecting to LogMeal / Spike APIs, processing estimates, or writing cost logging parameters into the database via SQLAlchemy.
3.  **Frontend Views**: Building the coach's bento-grid landing dashboard, adherence heatmap, or the athlete's photo confirmation screen using React + Vite + Tailwind CSS.

---

## Instructions

### 1. Daily Adherence Score Calculation (FastAPI + PostgreSQL)
When writing score-aggregation routines in Python, calculate a weighted score based on active settings in `diet_plans`:
*   **Default Weights**:
    *   *Meal Count Adherence*: 50% (Score = $\text{Meals Logged} / \text{Meals Target} \times 100$)
    *   *Supplement checklist*: 20% (Score = $\text{Supplements Checked} / \text{Required Target} \times 100$)
    *   *Hydration goal*: 15% (Score = $100$ if water target met, else $0$)
    *   *Cardio/Steps targets*: 15% (Score = percentage of targets completed)
*   **Color-bucket logic**:
    *   Score $\ge 85$: `'green'`
    *   $50 \le$ Score $< 85$: `'yellow'` (or `'orange'` if below $70$)
    *   Score $< 50$: `'red'`

### 2. LogMeal Vision Pipeline Flow
Ensure the backend API vision integration follows this sequence:
1.  Accept image payload $\rightarrow$ store in Supabase Storage Bucket $\rightarrow$ query LogMeal Nutritional API.
2.  Log the transaction in `vision_api_calls` table (storing `api_provider`, `status`, `retry_count`, `estimated_cost`, `image_size_bytes`).
3.  Format the response to return both raw AI estimates and placeholder objects for user confirmation.
4.  Do not edit the original AI fields; all human changes must write to the `edited_` prefixed columns in the database.

### 3. Bento UI Component (React + Tailwind CSS)
Ensure the dashboard components adhere to:
*   **Visual Hierarchy**: Promote flagged/low-adherence athletes (status 'red' or 'orange') to larger grid columns.
    *   *Example grid container*: `grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6`
    *   *Normal Athlete Card*: `col-span-1`
    *   *Flagged Athlete Card*: `col-span-1 md:col-span-2`
*   **Glassmorphic Design**: Implement modern panels using:
    *   `bg-slate-950/70 backdrop-blur-lg border border-white/10 shadow-2xl`
    *   *Hover state*: `hover:-translate-y-1 hover:border-white/20 hover:shadow-primary/10 transition-all duration-300 ease-out`
*   **Adherence Color Utilities**: Use dynamic Tailwind HSL colors for status badges and cards:
    *   `bg-emerald-500/10 text-emerald-400 border-emerald-500/20` (Green / Good)
    *   `bg-amber-500/10 text-amber-400 border-amber-500/20` (Yellow / Mid)
    *   `bg-orange-500/10 text-orange-400 border-orange-500/20` (Orange / Alert)
    *   `bg-rose-500/10 text-rose-400 border-rose-500/20` (Red / Critical)

### 4. Contribution Adherence Heatmap
For the GitHub-style adherence heatmap, draw cells in an SVG grid or CSS flexbox structure using Tailwind CSS:
*   **Grid layout**: `grid grid-flow-col grid-rows-7 gap-1` (representing weeks as columns, days as rows)
*   **Dynamic Color Classes**:
    *   `bg-emerald-500` (High: 85-100)
    *   `bg-amber-500` (Mid: 70-84)
    *   `bg-orange-500` (Warning: 50-69)
    *   `bg-rose-500` (Critical: <50)
*   Ensure cell borders are styled with `rounded-sm border border-slate-900/50`.

### 5. Athlete Photo Logging Confirmation Pane
When an athlete uploads a meal image:
1.  **State Management**: Store the returned macros in local React state.
2.  **Confirm Modal**: Display the uploaded image side-by-side with slider components (or number inputs) for Protein, Carbs, Fat, and Calories.
3.  **Visual Indicators**: Highlight values in orange/red if they exceed or fall short of the day's remaining target budget.
4.  **Commit Button**: Trigger database save only when the athlete confirms/adjusts.
