import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface CoachAuthProps {
  isSignUp: boolean;
  onLoginSuccess: (role: string, user: { name: string; email: string }) => void;
}

export const CoachAuth: React.FC<CoachAuthProps> = ({ isSignUp, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isSignUp) {
      if (!name || !inviteCode) {
        setError('Please fill in your name and registration invite code.');
        return;
      }
      if (inviteCode !== 'ARTIST2026') {
        setError('Invalid Coach Invite Code. This platform is restricted to designated coaches.');
        return;
      }
      
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8000/api/auth/coach/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, inviteCode }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || 'Registration failed');
        }
        
        useAuthStore.getState().setAuth({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        
        onLoginSuccess('coach', { name: data.name, email: data.email });
        navigate('/coach/dashboard');
      } catch (err: any) {
        setError(err.message || 'An error occurred during registration.');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8000/api/auth/coach/signin', {
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
        
        onLoginSuccess('coach', { name: data.name, email: data.email });
        navigate('/coach/dashboard');
      } catch (err: any) {
        setError(err.message || 'An error occurred during sign in.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Background Gradient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

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
          <span className="text-xs uppercase tracking-widest text-primary font-bold px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            Admin Access
          </span>
          <h2 className="text-3xl font-black mt-4 tracking-tight">
            {isSignUp ? 'Create Coach Account' : 'Coach Login'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUp
              ? 'Register your coaching team credentials'
              : 'Enter your credentials to monitor athlete adherence'}
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
          {isSignUp && (
            <div className="space-y-2">
              <label htmlFor="coach-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Full Name
              </label>
              <input
                type="text"
                id="coach-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Aryan Sharma…"
                className="w-full py-3 px-4 rounded-xl bg-card/50 border border-card-border focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/45 text-sm"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="coach-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Email Address
            </label>
            <input
              type="email"
              id="coach-email"
              name="email"
              autoComplete="email"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., coach@bodyartist.com…"
              className="w-full py-3 px-4 rounded-xl bg-card/50 border border-card-border focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/45 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="coach-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Password
            </label>
            <input
              type="password"
              id="coach-password"
              name="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password…"
              className="w-full py-3 px-4 rounded-xl bg-card/50 border border-card-border focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/45 text-sm"
            />
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="coach-invite" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Coach Invite Code
                </label>
                <span className="text-[10px] text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">
                  Use: ARTIST2026
                </span>
              </div>
              <input
                type="text"
                id="coach-invite"
                name="inviteCode"
                autoComplete="off"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter verification code…"
                className="w-full py-3 px-4 rounded-xl bg-card/50 border border-card-border focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/45 text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating…' : isSignUp ? 'Create Coach Account' : 'Verify & Enter'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-card-border pt-6">
          {isSignUp ? (
            <Link
              to="/coach/signin"
              className="text-xs text-muted-foreground hover:text-primary font-bold transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded outline-none"
            >
              Already registered? Sign In instead
            </Link>
          ) : (
            <Link
              to="/coach/signup"
              className="text-xs text-muted-foreground hover:text-primary font-bold transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded outline-none"
            >
              Don't have an admin account? Register here
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
