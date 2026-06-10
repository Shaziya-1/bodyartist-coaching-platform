import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Target, Camera, ChevronRight, Activity, ArrowUpRight } from 'lucide-react';

export const HomePortal: React.FC = () => {

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Background Gradient Glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] rounded-full bg-status-orange/5 blur-[130px] pointer-events-none" />

      {/* Modern Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20 relative">
        <Link 
          to="/" 
          className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg outline-none"
          aria-label="Body Artist Coaching - Home"
        >
          <Activity className="w-6 h-6 text-primary animate-pulse" />
          <span className="font-black tracking-tight text-xl bg-clip-text bg-gradient-to-r from-foreground to-foreground/80">
            BODY<span className="text-primary">ARTIST</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            to="/athlete/signin"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
          >
            Athlete Portal
          </Link>
          <Link
            to="/coach/signin"
            className="text-sm font-semibold py-2 px-5 rounded-xl bg-card border border-card-border hover:border-primary/20 text-foreground transition-[border-color,background-color] duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
          >
            Coach Log In
          </Link>
        </nav>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative z-10 flex flex-col items-center">
        
        {/* Skip Link for Keyboard Accessibility */}
        <a href="#main-features" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:bg-primary focus:text-white p-3 rounded">
          Skip to main features
        </a>

        {/* Hero Section */}
        <section className="text-center max-w-3xl mb-20 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary font-bold px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Shield className="w-3.5 h-3.5" /> DPDP Act 2025 Compliant Telemetry
          </span>
          
          <h1 className="text-4xl md:text-6xl font-black mt-8 tracking-tight leading-[1.05] text-wrap-balance">
            Next-Gen Performance & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-status-yellow to-status-orange">Nutrition</span> Sync
          </h1>
          
          <p className="mt-6 text-base md:text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            The private dashboard platform for coaching groups training enhanced athletes. Real-time hydration audits, supplement checklists, and photo-based meal logging powered by computer-vision APIs.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
            <Link
              to="/coach/signup"
              className="flex-1 py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-[background-color,box-shadow] duration-200 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none cursor-pointer"
            >
              <span>Register Coach Group</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/athlete/signin"
              className="flex-1 py-4 px-6 rounded-2xl bg-card border border-card-border hover:bg-accent/40 text-foreground font-bold hover:border-status-orange/30 transition-[background-color,border-color] duration-200 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none cursor-pointer"
            >
              <span>Athlete Sign In</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Feature Cards Grid (Bento Style) */}
        <section id="main-features" className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 animate-fade-in [animation-delay:150ms]">
          
          {/* Card 1: AI Vision Logging */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between group hover:border-primary/20 transition-[border-color,transform] duration-300 hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">Photo-Based Meal Logging</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Log meals instantly by uploading photos. The LogMeal Nutritional API identifies dishes, estimates portion weights, and retrieves macros and micronutrient metrics.
              </p>
            </div>
            <div className="border-t border-card-border mt-6 pt-4 text-xs font-semibold text-primary flex items-center gap-1.5">
              <span>Human-in-the-Loop Confirmation</span>
            </div>
          </div>

          {/* Card 2: Scoring Model */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between group hover:border-primary/20 transition-[border-color,transform] duration-300 hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-status-yellow/10 border border-status-yellow/20 flex items-center justify-center text-status-yellow mb-6">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">Weighted Adherence Score</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dynamic daily score (0–100) calculated from completed meals, hydration milestones, and customized supplements checklists configured by the coach.
              </p>
            </div>
            <div className="border-t border-card-border mt-6 pt-4 text-xs font-semibold text-status-yellow flex items-center gap-1.5">
              <span>Adherence Heatmap Visualization</span>
            </div>
          </div>

          {/* Card 3: DPDP Compliance */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between group hover:border-primary/20 transition-[border-color,transform] duration-300 hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-status-orange/10 border border-status-orange/20 flex items-center justify-center text-status-orange mb-6">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">DPDP Act Privacy Standards</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Complete data safety for enhanced athletes. Includes consent onboarding flows for health records and isolated database queries via PostgreSQL Row-Level Security.
              </p>
            </div>
            <div className="border-t border-card-border mt-6 pt-4 text-xs font-semibold text-status-orange flex items-center gap-1.5">
              <span>Secure isolated access policies</span>
            </div>
          </div>

        </section>

        {/* Cost Test Phase Disclosures */}
        <section className="w-full max-w-4xl glass-panel p-8 md:p-12 rounded-3xl mb-12 animate-fade-in [animation-delay:200ms] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-black tracking-tight text-foreground">Controlled Test & Cost Phase</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                The initial rollout implements a 2–4 week pilot tracking system to log real API volume (`VisionApiCall` records). The platform monitors upload count, retry rates, and storage growth per athlete to establish precise monthly costing bands.
              </p>
            </div>
            <div className="flex flex-col gap-2 p-6 rounded-2xl bg-card border border-card-border text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-extrabold">Primary Vision API</span>
              <span className="text-lg font-black text-primary">LogMeal API</span>
              <span className="text-[10px] text-muted-foreground mt-2 border-t border-card-border pt-2">Fallback: Spike API</span>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-card-border py-8 text-center text-xs text-muted-foreground relative z-10">
        <p>© 2026 Body Artist Coaching. All rights reserved. Data handled according to Indian DPDP guidelines.</p>
      </footer>
    </div>
  );
};
