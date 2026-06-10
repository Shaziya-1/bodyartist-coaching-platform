import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Info } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface AthleteAuthProps {
  onLoginSuccess: (role: string, user: { name: string; email: string }) => void;
}

export const AthleteAuth: React.FC<AthleteAuthProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/auth/athlete/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Sign in failed');
      }

      useAuthStore.getState().setAuth({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      onLoginSuccess('athlete', { name: data.name, email: data.email });
      
      const accepted = localStorage.getItem(`consent-${email}`);
      if (accepted === 'true') {
        navigate('/athlete/dashboard');
      } else {
        navigate('/athlete/dashboard'); 
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Background Gradient Glows */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-status-orange/5 blur-[120px] pointer-events-none" />

      {/* Back to Portal button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg outline-none"
        aria-label="Back to Portal"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portal</span>
      </Link>

      {/* Form Container */}
      <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl z-10 animate-fade-in">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-status-orange font-bold px-3 py-1 rounded-full bg-status-orange/10 border border-status-orange/20">
            Athlete Access
          </span>
          <h2 className="text-3xl font-black mt-4 tracking-tight">
            Athlete Sign In
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to track your training metrics and diet adherence
          </p>
        </div>

        {error && (
          <div 
            className="mb-6 p-4 rounded-xl bg-status-red/10 border border-status-red/20 text-status-red text-xs font-semibold flex items-start gap-2.5 animate-fade-in"
            aria-live="polite"
          >
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="athlete-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Email Address
            </label>
            <input
              type="email"
              id="athlete-email"
              name="email"
              autoComplete="email"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., athlete@bodyartist.com…"
              className="w-full py-3 px-4 rounded-xl bg-card/50 border border-card-border focus:border-status-orange/50 focus-visible:ring-2 focus-visible:ring-status-orange/30 outline-none transition-all placeholder:text-muted-foreground/45 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="athlete-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Password
            </label>
            <input
              type="password"
              id="athlete-password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password…"
              className="w-full py-3 px-4 rounded-xl bg-card/50 border border-card-border focus:border-status-orange/50 focus-visible:ring-2 focus-visible:ring-status-orange/30 outline-none transition-all placeholder:text-muted-foreground/45 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 rounded-2xl bg-card border border-card-border hover:bg-accent/40 text-foreground font-bold hover:border-status-orange/30 hover:shadow-lg hover:shadow-status-orange/5 transition-all duration-300 cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating…' : 'Authenticate Credentials'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-card-border pt-6 text-xs text-muted-foreground leading-relaxed flex flex-col items-center">
          <Info className="w-4 h-4 text-primary/60 mb-2" />
          <p>
            <strong>Notice</strong>: Public signups are disabled. Athlete accounts are provisioned exclusively by their designated coaches. If you do not have credentials, please contact your coach.
          </p>
        </div>
      </div>
    </div>
  );
};
