---
name: frontend-design
description: Guidelines and workflows for building highly interactive, responsive React components with premium Tailwind HSL-based styling for the Coach-Athlete platform.
---

# Frontend Design & Component Guidelines

Instructions for the agent when designing and implementing UI components, Tailwind CSS layouts, and client-side interactions.

## When to use
Use this skill when:
1.  **Tailwind & Styling Setup**: Creating or editing Tailwind configuration, custom theme variables, and glassmorphic panels.
2.  **Bento Grid & Dashboard**: Coding the responsive coach bento grid cards, metrics cards, or navigation headers.
3.  **Visualizations**: Implementing the daily adherence heatmap (GitHub style) or time-series weight/water graphs.
4.  **Athlete Logging UI**: Designing the photo capture interface, confirmation/portion nudge modals, and manual inputs.

---

## Instructions

### 1. Theme Configuration & Core CSS Variables
Define HSL theme tokens inside `frontend/src/index.css` (or equivalent stylesheet) to keep palettes consistent and modern. Do not write hardcoded hex/RGB color codes directly in components:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;
    
    --card: 224 71% 7%;
    --card-foreground: 213 31% 95%;
    --card-border: 224 50% 12%;
    
    --primary: 263 90% 50%; /* Vibrant Premium Purple */
    --primary-foreground: 210 40% 98%;
    
    --muted: 223 47% 11%;
    --muted-foreground: 215.4 16.3% 56.9%;
    
    --accent: 216 34% 17%;
    --accent-foreground: 210 40% 98%;

    --status-green: 142 70% 45%;
    --status-yellow: 47 95% 50%;
    --status-orange: 24 95% 50%;
    --status-red: 0 84% 55%;
  }
}
```

### 2. Premium Glassmorphic Panels
Apply glassmorphic Tailwind styling combinations for cards to match the custom premium coaching dashboard feel:
*   Use a semi-transparent background combined with backdrop blur:
    `bg-slate-950/70 backdrop-blur-lg border border-white/10 shadow-2xl`
*   Add smooth, hardware-accelerated animations for active user feedback:
    `hover:-translate-y-1 hover:border-white/20 hover:shadow-primary/10 transition-all duration-300 ease-out`

### 3. Responsive Bento Grid Layout
Structure the coach's athlete list using a CSS Grid layout configured through Tailwind:
*   **Grid layout**: `grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6`
*   **Grid columns allocation**:
    *   *Normal cards*: `col-span-1`
    *   *Flagged/low-adherence cards*: `col-span-1 md:col-span-2`
*   Ensure smooth viewport responsiveness from mobile screens up to wide desktop monitors.

### 4. Contribution Adherence Heatmap
Represent athlete metrics over time using a contribution-style layout (one cell per day):
*   **Layout grid**: Use `grid grid-flow-col grid-rows-7 gap-1` to render days of the week vertically and weeks horizontally.
*   **Status colors**: Apply Tailwind color tokens based on the calculated daily adherence score:
    *   `bg-emerald-500` (Adherence $\ge 85\%$)
    *   `bg-amber-500` (Adherence $70\text{-}84\%$)
    *   `bg-orange-500` (Adherence $50\text{-}69\%$)
    *   `bg-rose-500` (Adherence $< 50\%$)
*   Add custom tooltips indicating date, running score, and checklist item status.

### 5. Athlete Photo Logging Confirmation Modal
When an athlete logs a meal via a camera upload:
1.  **Estimated Metrics Display**: Present the macros (Protein, Carbs, Fats) and micronutrients (Fiber, Zinc, Potassium) returned by the vision API side-by-side with the uploaded photo.
2.  **Confirm/Nudge Controls**: Render input sliders or number fields for the athlete to easily adjust and confirm the portion size before committing.
3.  **Confidence Flags**: Label micronutrient readings as "directional estimates" accompanied by confidence percentages.
