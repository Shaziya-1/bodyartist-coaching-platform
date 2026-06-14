import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { HomePortal } from './pages/HomePortal';
import { CoachAuth } from './pages/CoachAuth';
import { AthleteAuth } from './pages/AthleteAuth';
import { CoachDashboard } from './pages/CoachDashboard';
import { AthleteDashboard } from './pages/AthleteDashboard';
import { ConsentModal } from './components/ConsentModal';
import { useAuthStore } from './store/useAuthStore';

// Types
interface Athlete {
  id: string;
  name: string;
  email: string;
  score: number;
  streak: number;
  weight: number;
  waterLog: number;
  waterTarget: number;
  mealsLogged: number;
  mealsTarget: number;
  supplements: { name: string; completed: boolean; required: boolean }[];
  status: 'green' | 'yellow' | 'orange' | 'red';
  mealHistory: { id: string; time: string; food: string; calories: number; macros: { p: number; c: number; f: number }; photo: string }[];
}

function MainApp() {
  const role = useAuthStore((state) => state.role);
  const name = useAuthStore((state) => state.name);
  const email = useAuthStore((state) => state.email);

  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  // Fetch athletes for coach dashboard
  React.useEffect(() => {
    if (role === 'coach') {
      const coachId = useAuthStore.getState().id;
      if (coachId) {
        fetch(`http://localhost:8000/api/auth/coach/athletes?coach_id=${coachId}`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setAthletes(data);
            }
          })
          .catch((err) => console.error('Failed to fetch roster:', err));
      }
    }
  }, [role]);

  const handleLoginSuccess = (userRole: string, loggedUser: { name: string; email: string }) => {
    if (userRole === 'athlete') {
      const accepted = localStorage.getItem(`consent-${loggedUser.email}`);
      if (!accepted || accepted !== 'true') {
        setShowConsentModal(true);
      }
    }
  };

  const handleConsentAccept = () => {
    if (email) {
      localStorage.setItem(`consent-${email}`, 'true');
    }
    setShowConsentModal(false);
  };

  const handleConsentDecline = () => {
    useAuthStore.getState().clearAuth();
    setShowConsentModal(false);
  };

  const handleLogout = () => {
    useAuthStore.getState().clearAuth();
    setSelectedAthlete(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <ThemeToggle />

      <ConsentModal
        isOpen={showConsentModal}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
        athleteName={name}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePortal />} />
        <Route path="/coach/signin" element={<CoachAuth isSignUp={false} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/coach/signup" element={<CoachAuth isSignUp={true} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/athlete/signin" element={<AthleteAuth onLoginSuccess={handleLoginSuccess} />} />

        {/* Coach Dashboard Route */}
        <Route
          path="/coach/dashboard"
          element={
            role === 'coach' ? (
              <CoachDashboard
                athletes={athletes}
                selectedAthlete={selectedAthlete}
                onSelectAthlete={setSelectedAthlete}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/coach/signin" replace />
            )
          }
        />

        {/* Athlete Dashboard Route */}
        <Route
          path="/athlete/dashboard"
          element={
            role === 'athlete' ? (
              <AthleteDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/athlete/signin" replace />
            )
          }
        />

        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
