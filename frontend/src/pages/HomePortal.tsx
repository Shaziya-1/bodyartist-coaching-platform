import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Target, Camera, ChevronRight, Activity, ArrowUpRight, Database } from 'lucide-react';

export const HomePortal: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Premium Ambient Light Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-primary/15 blur-[150px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] rounded-full bg-status-orange/8 blur-[140px] pointer-events-none" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Modern Premium Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20 relative">
        <Link 
          to="/" 
          className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg outline-none group"
          aria-label="Body Artist Coaching - Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-status-orange flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-black tracking-tight text-xl text-white">
            BODY<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-status-orange">ARTIST</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/athlete/signin"
            className="text-sm font-semibold text-muted-foreground hover:text-white transition-colors py-2 px-4 rounded-xl focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            Athlete Portal
          </Link>
          <Link
            to="/coach/signin"
            className="text-sm font-semibold py-2.5 px-5 rounded-xl bg-card/60 border border-card-border hover:border-primary/40 text-foreground hover:text-white transition-[border-color,background-color] duration-200 focus-visible:ring-2 focus-visible:ring-primary outline-none shadow-sm"
          >
            Coach Log In
          </Link>
        </nav>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10 flex flex-col items-center">
        
        {/* Skip Link for Keyboard Accessibility */}
        <a href="#main-features" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:bg-primary focus:text-white p-3 rounded">
          Skip to main features
        </a>

        {/* Hero Section */}
        <section className="text-center max-w-4xl mb-24 animate-fade-in flex flex-col items-center">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-extrabold px-4.5 py-2 rounded-full bg-primary/10 border border-primary/25 shadow-sm shadow-primary/5">
            <Shield className="w-3.5 h-3.5 text-primary animate-pulse" /> DPDP Act 2025 Privacy Compliant
          </span>
          
          <h1 className="text-5xl md:text-7xl font-black mt-8 tracking-tight leading-[1.02] text-white max-w-3xl">
            Elite Coaching for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-status-yellow to-status-orange">Enhanced Athletes</span>
          </h1>
          
          <p className="mt-6 text-base md:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
            A secure, internal coaching portal tracking photo-based diet composition, supplement schedules, daily scores, and biometric telemetry.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
            <Link
              to="/coach/signup"
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:from-primary/95 hover:to-purple-600/95 shadow-xl shadow-primary/20 hover:shadow-primary/35 transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Register Coach Group</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/athlete/signin"
              className="flex-1 py-4 px-6 rounded-2xl bg-card border border-card-border hover:bg-accent/40 text-white font-bold hover:border-status-orange/30 shadow-md transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Athlete Sign In</span>
              <ArrowUpRight className="w-4 h-4 text-status-orange" />
            </Link>
          </div>
        </section>

        {/* Feature Cards Grid (Bento Style Layout) */}
        <section id="main-features" className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 animate-fade-in [animation-delay:150ms]">
          
          {/* Card 1: AI Vision Logging */}
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white mb-2.5">Photo-Based Meal Logging</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Seamless photo analysis. The external vision API identifies dishes, estimates portions, and updates macros and micronutrient metrics in seconds.
              </p>
            </div>
            <div className="border-t border-card-border/50 mt-6 pt-4 text-xs font-semibold text-primary flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Confirm & Adjust Portion Interface</span>
            </div>
          </div>

          {/* Card 2: Scoring Model */}
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-status-yellow/10 border border-status-yellow/20 flex items-center justify-center text-status-yellow mb-6">
                <Target className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white mb-2.5">Dynamic Adherence Score</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Daily performance score (0–100) combining required meals count, hydration milestones, training targets, and custom supplements checklists.
              </p>
            </div>
            <div className="border-t border-card-border/50 mt-6 pt-4 text-xs font-semibold text-status-yellow flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-status-yellow" />
              <span>Color-Coded Heatmap Grid</span>
            </div>
          </div>

          {/* Card 3: DPDP Compliance */}
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-status-orange/10 border border-status-orange/20 flex items-center justify-center text-status-orange mb-6">
                <Database className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white mb-2.5">PostgreSQL Isolation (RLS)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Isolate data scopes. Athletes read/write their own records, and coaches access only assigned athlete profiles via strict Row-Level Security.
              </p>
            </div>
            <div className="border-t border-card-border/50 mt-6 pt-4 text-xs font-semibold text-status-orange flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-status-orange" />
              <span>DPDP 2025 Explicit Onboarding</span>
            </div>
          </div>

        </section>

        {/* Cost Test Phase Disclosures */}
        <section className="w-full max-w-4xl glass-panel p-8 md:p-12 rounded-3xl mb-12 animate-fade-in [animation-delay:200ms] relative overflow-hidden">
          <div className="absolute right-[-5%] top-[-10%] w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <span className="text-[10px] text-primary uppercase tracking-widest font-extrabold bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">Active Phase 0/1</span>
              <h3 className="text-2xl font-black tracking-tight text-white mt-3">Pilot Run & Cost Calibration</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                The test phase logs every photo scan within `VisionApiCall` records to monitor API error rates, volume, and storage growth per athlete. Standardized pricing metrics will be computed following the 4-week validation run.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 p-6 rounded-2xl bg-card border border-card-border text-center shadow-inner">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-extrabold">Primary Vision Service</span>
              <span className="text-lg font-black text-white flex items-center justify-center gap-1.5">
                LogMeal API
              </span>
              <div className="text-[10px] text-muted-foreground mt-2 border-t border-card-border/60 pt-2 flex items-center justify-center gap-4">
                <span>Backup: Spike API</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-card-border/60 py-8 text-center text-xs text-muted-foreground relative z-10">
        <p>© 2026 Body Artist Coaching. All rights reserved. Managed in compliance with DPDP India guidelines.</p>
      </footer>
    </div>
  );
};
