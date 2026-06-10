import React, { useState } from 'react';

interface ConsentModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ onAccept, onDecline }) => {
  const [consentHealth, setConsentHealth] = useState(false);
  const [consentAPI, setConsentAPI] = useState(false);
  const [error, setError] = useState('');

  const handleProceed = () => {
    if (!consentHealth || !consentAPI) {
      setError('Please review and accept both consent clauses to proceed.');
      return;
    }
    setError('');
    onAccept();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-lg glass-panel p-8 md:p-10 rounded-3xl relative flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-status-yellow/10 flex items-center justify-center border border-status-yellow/20 text-status-yellow mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Consent & Data Privacy</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            In compliance with **India's DPDP Act 2025**, we require your explicit consent to store and process your personal telemetry and images.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-status-red/10 border border-status-red/20 text-status-red text-xs font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Clauses */}
        <div className="space-y-6 mb-8 text-sm">
          
          {/* Clause 1: Health Telemetry */}
          <div className="flex gap-4 items-start p-4 rounded-2xl bg-card border border-card-border hover:border-card-border/80 transition-colors">
            <input
              type="checkbox"
              id="consent-health"
              checked={consentHealth}
              onChange={(e) => setConsentHealth(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-card-border text-primary focus:ring-primary cursor-pointer accent-primary"
            />
            <label htmlFor="consent-health" className="cursor-pointer leading-relaxed">
              <strong className="block text-foreground mb-1 font-bold">Health & Performance Telemetry</strong>
              I consent to the collection, storage, and retrieval of my weight tracking history, body measurements, steps, daily workout activity logs, and supplement checkoffs.
            </label>
          </div>

          {/* Clause 2: Image Processing */}
          <div className="flex gap-4 items-start p-4 rounded-2xl bg-card border border-card-border hover:border-card-border/80 transition-colors">
            <input
              type="checkbox"
              id="consent-api"
              checked={consentAPI}
              onChange={(e) => setConsentAPI(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-card-border text-primary focus:ring-primary cursor-pointer accent-primary"
            />
            <label htmlFor="consent-api" className="cursor-pointer leading-relaxed">
              <strong className="block text-foreground mb-1 font-bold">Third-Party Image Processing</strong>
              I acknowledge and consent that my uploaded food/meal photographs will be securely sent to third-party image recognition services (LogMeal / Spike API) to estimate macronutrient and micronutrient values.
            </label>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onDecline}
            className="flex-1 py-4 px-6 rounded-2xl bg-card border border-card-border hover:bg-accent/40 text-foreground font-semibold transition-all duration-300 cursor-pointer"
          >
            Decline & Logout
          </button>
          <button
            onClick={handleProceed}
            className="flex-1 py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 cursor-pointer"
          >
            Confirm & Proceed
          </button>
        </div>

      </div>
    </div>
  );
};
