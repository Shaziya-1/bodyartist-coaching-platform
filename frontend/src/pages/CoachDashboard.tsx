import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, TrendingUp, Users, Activity, AlertCircle, ArrowLeft, CheckCircle, Scale, Flame } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { apiClient } from '../api/client';
import { AthleteCard } from '../components/AthleteCard';
import { AdherenceHeatmap } from '../components/AdherenceHeatmap';
import { SimpleLineChart } from '../components/SimpleLineChart';

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
  mealHistory: any[];
}

interface CoachDashboardProps {
  athletes: Athlete[];
  selectedAthlete: Athlete | null;
  onSelectAthlete: (athlete: Athlete | null) => void;
  onLogout: () => void;
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({
  athletes: initialAthletes,
  selectedAthlete,
  onSelectAthlete,
  onLogout,
}) => {
  const navigate = useNavigate();
  const name = useAuthStore((state) => state.name);
  const [athletes, setAthletes] = useState<Athlete[]>(initialAthletes);
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [provName, setProvName] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provPassword, setProvPassword] = useState('');
  const [provisionError, setProvisionError] = useState('');
  const [provisionSuccess, setProvisionSuccess] = useState(false);

  // Load real-time adherence stats for each athlete in the roster
  useEffect(() => {
    const fetchAthleteStats = async () => {
      try {
        const statsPromises = initialAthletes.map(async (athlete) => {
          try {
            const summary = await apiClient.get(`/api/v1/athlete/dashboard-summary/${athlete.id}`);
            return {
              ...athlete,
              score: summary.score || 0,
              status: summary.status || 'red',
              weight: summary.weight || athlete.weight,
              waterLog: summary.water_logged || 0,
              streak: summary.streak || athlete.streak
            };
          } catch (e) {
            return athlete;
          }
        });
        const updated = await Promise.all(statsPromises);
        setAthletes(updated);
      } catch (err) {
        console.error("Failed to load roster stats", err);
      }
    };
    fetchAthleteStats();
  }, [initialAthletes]);

  // Diet plan target configuration states for drill-down view
  const [dietMealsTarget, setDietMealsTarget] = useState(5);
  const [dietWaterTarget, setDietWaterTarget] = useState(8);
  const [dietStepsTarget, setDietStepsTarget] = useState(10000);
  const [dietCardioTarget, setDietCardioTarget] = useState(30);
  const [suppsList, setSuppsList] = useState<{ name: string; required: boolean }[]>([]);
  const [newSuppName, setNewSuppName] = useState('');
  const [newSuppRequired, setNewSuppRequired] = useState(true);

  // Load configured targets when selectedAthlete changes
  useEffect(() => {
    if (selectedAthlete) {
      const loadTargets = async () => {
        try {
          const targets = await apiClient.get(`/api/v1/athlete/targets/${selectedAthlete.id}`);
          setDietMealsTarget(targets.meals_target || 5);
          setDietWaterTarget(targets.water_target || 8);
          setDietStepsTarget(targets.steps_target || 10000);
          setDietCardioTarget(targets.cardio_target || 30);
          if (targets.supplement_checklist && Array.isArray(targets.supplement_checklist)) {
             setSuppsList(targets.supplement_checklist.map((s: any) => ({ name: s.name || s, required: s.required !== false })));
          } else {
             setSuppsList([]);
          }
        } catch (err) {
          console.error("Failed to load targets", err);
        }
      };
      loadTargets();
    }
  }, [selectedAthlete]);

  const handleSaveTargets = async () => {
    if (!selectedAthlete) return;
    
    const nextSupplements = suppsList.map(s => ({
      name: s.name,
      required: s.required,
      id: Math.random().toString()
    }));

    try {
      await apiClient.post('/api/v1/diet-plan', {
        athlete_id: selectedAthlete.id,
        meals_target: dietMealsTarget,
        water_target: dietWaterTarget,
        steps_target: dietStepsTarget,
        cardio_target: dietCardioTarget,
        tolerance_percent: 10,
        target_macros: { p: 200, c: 250, f: 75, cal: 2475 },
        supplement_checklist: nextSupplements
      });
      
      // Refresh parent dashboard state
      const nextAthletes = athletes.map(a => {
        if (a.id === selectedAthlete.id) {
          return {
            ...a,
            mealsTarget: dietMealsTarget,
            waterTarget: dietWaterTarget,
            supplements: nextSupplements as any
          };
        }
        return a;
      });
      setAthletes(nextAthletes);
      alert('Diet plan targets updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update targets');
    }
  };

  const handleAddSupp = () => {
    if (!newSuppName.trim()) return;
    setSuppsList([...suppsList, { name: newSuppName.trim(), required: newSuppRequired }]);
    setNewSuppName('');
  };

  const handleRemoveSupp = (idx: number) => {
    setSuppsList(suppsList.filter((_, i) => i !== idx));
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvisionError('');
    setProvisionSuccess(false);

    if (!provName || !provEmail || !provPassword) {
      setProvisionError('All fields are required');
      return;
    }

    try {
      const coachId = useAuthStore.getState().id;
      if (!coachId) {
        setProvisionError('Coach ID not found');
        return;
      }

      const res = await fetch('http://localhost:8000/api/auth/athlete/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: provName,
          email: provEmail,
          password: provPassword,
          coachId: coachId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProvisionError(data.detail || 'Failed to provision athlete');
        return;
      }

      setProvisionSuccess(true);
      setProvName('');
      setProvEmail('');
      setProvPassword('');
      
      // Auto-reload athletes list
      setTimeout(() => {
        setShowProvisionModal(false);
        setProvisionSuccess(false);
        // Trigger a page refresh or call api to pull roster again
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setProvisionError(err.message || 'An error occurred');
    }
  };

  // Team stats aggregated dynamically
  const avgScore = athletes.length > 0
    ? Math.round(athletes.reduce((sum, a) => sum + a.score, 0) / athletes.length)
    : 0;
  const bestStreakAthlete = athletes.length > 0
    ? athletes.reduce((prev, current) => prev.streak > current.streak ? prev : current)
    : null;
  const criticalCount = athletes.filter(a => a.status === 'red' || a.status === 'orange').length;

  const mockHeatmapData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    score: Math.floor(Math.random() * 40) + 60,
  }));

  // Sort athletes: flagged/red/orange first and larger, then others
  const sortedAthletes = [...athletes].sort((a, b) => {
    const statusOrder = { red: 0, orange: 1, yellow: 2, green: 3 };
    return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
  });

  if (selectedAthlete) {
    // Find current updated profile from local state
    const currentProfile = athletes.find(a => a.id === selectedAthlete.id) || selectedAthlete;
    const weightHistoryPoints = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dStr = d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
      return {
        date: dStr,
        value: i === 6 ? currentProfile.weight : currentProfile.weight + (Math.random() * 0.6 - 0.3)
      };
    });

    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        
        {/* Dynamic ambient drill-down glows */}
        <div className="absolute top-0 left-0 w-[50%] h-[35%] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[35%] rounded-full bg-status-orange/5 blur-[120px] pointer-events-none" />

        {/* Drill-down view header */}
        <header className="sticky top-0 z-40 glass-panel border-b border-card-border/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onSelectAthlete(null)}
                className="p-2.5 rounded-xl text-muted-foreground hover:text-white border border-card-border hover:bg-card/40 transition-all cursor-pointer flex items-center justify-center"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-extrabold">Athletic Analytics Hub</p>
                <h1 className="text-xl font-black text-white">{currentProfile.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`px-3 py-1.5 rounded-xl border text-[10px] uppercase tracking-widest font-extrabold ${
                currentProfile.status === 'green' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                currentProfile.status === 'yellow' ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' :
                currentProfile.status === 'orange' ? 'bg-orange-500/10 text-orange-400 border-orange-500/25' :
                'bg-rose-500/10 text-rose-400 border-rose-500/25'
              }`}>
                {currentProfile.status.toUpperCase()} STATUS
              </span>
            </div>
          </div>
        </header>

        {/* Drill-down content */}
        <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 space-y-8">
          
          {/* Key metrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between min-h-[120px]">
              <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider mb-2">Today's Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{currentProfile.score}</span>
                <span className="text-xs text-muted-foreground font-bold">/100</span>
              </div>
              <div className="w-full h-1.5 bg-card rounded-full overflow-hidden mt-3">
                <div 
                  className={`h-full transition-all duration-500 ${
                    currentProfile.score >= 85 ? 'bg-emerald-500' :
                    currentProfile.score >= 70 ? 'bg-amber-500' :
                    currentProfile.score >= 50 ? 'bg-orange-500' :
                    'bg-rose-500'
                  }`} 
                  style={{ width: `${currentProfile.score}%` }} 
                />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between min-h-[120px]">
              <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider mb-2">Consistencies</p>
              <div className="flex items-center gap-2 text-status-orange font-black">
                <Flame className="w-8 h-8 fill-status-orange/10" />
                <span className="text-4xl text-white">{currentProfile.streak}</span>
                <span className="text-xs text-muted-foreground font-bold">days streak</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase mt-3">Verified checkoffs</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between min-h-[120px]">
              <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider mb-2">Latest Biometrics</p>
              <div className="flex items-baseline gap-2 text-white">
                <Scale className="w-6 h-6 text-status-orange" />
                <span className="text-4xl font-black">{currentProfile.weight}</span>
                <span className="text-xs text-muted-foreground font-bold">KG</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase mt-3">Time-series tracked</p>
            </div>
          </div>

          {/* Configuration & Charts Bento section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Target Config Form */}
            <div className="glass-panel p-6 rounded-3xl lg:col-span-1 space-y-5">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Diet Targets Builder</h3>
                <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Customize daily compliance variables</p>
              </div>

              <div className="space-y-4 text-xs font-bold">
                {/* Meals Target */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block">Meals Target Count</label>
                  <input
                    type="number"
                    value={dietMealsTarget}
                    onChange={(e) => setDietMealsTarget(Number(e.target.value))}
                    className="w-full py-2.5 px-4 rounded-xl bg-card border border-card-border text-white focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Water Target */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block">Water Intake Target (Glasses)</label>
                  <input
                    type="number"
                    value={dietWaterTarget}
                    onChange={(e) => setDietWaterTarget(Number(e.target.value))}
                    className="w-full py-2.5 px-4 rounded-xl bg-card border border-card-border text-white focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Steps Target */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block">Daily Steps Target</label>
                  <input
                    type="number"
                    value={dietStepsTarget}
                    onChange={(e) => setDietStepsTarget(Number(e.target.value))}
                    className="w-full py-2.5 px-4 rounded-xl bg-card border border-card-border text-white focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Cardio Target */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block">Cardio Active Target (Mins)</label>
                  <input
                    type="number"
                    value={dietCardioTarget}
                    onChange={(e) => setDietCardioTarget(Number(e.target.value))}
                    className="w-full py-2.5 px-4 rounded-xl bg-card border border-card-border text-white focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Supplement checklist builder */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Configure Supplements</span>
                  
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {suppsList.map((supp, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between p-2 rounded-xl bg-card border border-card-border">
                        <span className="text-[11px] truncate text-white">{supp.name}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[8px] px-1 rounded font-black uppercase ${supp.required ? 'bg-primary/20 text-primary' : 'bg-card border border-card-border text-muted-foreground'}`}>
                            {supp.required ? 'Req' : 'Opt'}
                          </span>
                          <button 
                            type="button"
                            onClick={() => handleRemoveSupp(sIdx)}
                            className="text-status-red hover:text-white text-[10px] px-1 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add supplement name"
                      value={newSuppName}
                      onChange={(e) => setNewSuppName(e.target.value)}
                      className="flex-1 py-2 px-3 rounded-xl bg-card border border-card-border text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSupp}
                      className="px-3 rounded-xl bg-primary text-white font-extrabold flex items-center justify-center cursor-pointer text-xs"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-1 select-none">
                    <input
                      type="checkbox"
                      id="new-supp-required"
                      checked={newSuppRequired}
                      onChange={(e) => setNewSuppRequired(e.target.checked)}
                      className="cursor-pointer accent-primary"
                    />
                    <label htmlFor="new-supp-required" className="text-[10px] text-muted-foreground cursor-pointer">
                      Required for Adherence Score
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSaveTargets}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:shadow-lg transition-all cursor-pointer text-xs"
                >
                  Save Targets Diet Configuration
                </button>
              </div>
            </div>

            {/* Charts & Heatmap */}
            <div className="lg:col-span-2 space-y-6">
              <AdherenceHeatmap scores={mockHeatmapData} athleteName={currentProfile.name} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SimpleLineChart
                  data={weightHistoryPoints}
                  title="Biometric Weight Logs"
                  metric="Weight (KG)"
                  color="orange"
                />
                
                {/* Hydration tracking chart mock */}
                <SimpleLineChart
                  data={Array.from({ length: 7 }, (_, i) => ({
                    date: `06-0${i + 4}`,
                    value: Math.floor(Math.random() * 4) + 5
                  }))}
                  title="Fluid Hydration Audit"
                  metric="Glasses/Day"
                  target={8}
                  color="green"
                />
              </div>
            </div>

          </div>

          {/* Meals logs feed timeline */}
          <div className="glass-panel p-6 rounded-3xl">
            <div className="mb-6">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Adherence Meal History Timeline</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Chronological feed of athlete uploaded meals</p>
            </div>

            {currentProfile.mealHistory && currentProfile.mealHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentProfile.mealHistory.map((meal: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-card/30 border border-card-border hover:border-white/10 transition-all flex gap-4">
                    {meal.photo ? (
                      <img src={meal.photo} alt={meal.food} className="w-20 h-20 rounded-xl object-cover border border-card-border flex-shrink-0" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-card border border-card-border flex items-center justify-center text-3xl flex-shrink-0">
                        🍳
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm truncate">{meal.food}</h4>
                          {meal.isEdited && (
                            <span className="text-[8px] bg-primary/10 border border-primary/20 text-primary font-black px-1.5 rounded uppercase">
                              Edited
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{meal.time} • Confidence: {meal.confidence}%</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs font-extrabold mt-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-primary">P: {meal.macros.p}g</span>
                          <span className="text-status-yellow">C: {meal.macros.c}g</span>
                          <span className="text-status-orange">F: {meal.macros.f}g</span>
                        </div>
                        <span className="text-white bg-card border border-card-border px-2 py-0.5 rounded-md text-[10px]">
                          {meal.calories || Math.round(meal.macros.p*4 + meal.macros.c*4 + meal.macros.f*9)} kcal
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <Users className="w-10 h-10 text-muted-foreground/45 mx-auto mb-3" />
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">No meal records found for today.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* Dynamic ambient portal glows */}
      <div className="absolute top-0 right-0 w-[50%] h-[35%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[45%] h-[35%] rounded-full bg-status-orange/5 blur-[120px] pointer-events-none animate-pulse-glow" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-card-border/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-extrabold">Coaching Workspace</p>
              <h1 className="text-lg font-black text-white">Coach {name || 'Dashboard'}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProvisionModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer text-xs"
            >
              <Plus className="w-4 h-4 text-white" />
              Add Athlete
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl text-muted-foreground hover:bg-card hover:text-white border border-transparent hover:border-card-border transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Provision Athlete Popup Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl animate-fade-in border-white/10">
            <div className="absolute top-0 inset-x-0 h-1 rounded-t-3xl bg-gradient-to-r from-primary to-purple-600" />
            
            <h2 className="text-2xl font-black text-white mb-2">Provision Athlete</h2>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">Create credentials for a new athlete workspace. This athlete will be bound to your roster and subject to PostgreSQL isolated query checks.</p>

            {provisionSuccess ? (
              <div className="p-4 rounded-2xl bg-status-green/10 border border-status-green/30 text-status-green text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Athlete provisioned successfully! Loading workspace...</span>
              </div>
            ) : (
              <form onSubmit={handleProvision} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Athlete Full Name</label>
                  <input
                    type="text"
                    value={provName}
                    onChange={(e) => setProvName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-card border border-card-border focus:border-primary/50 text-white font-bold text-sm focus:outline-none"
                    placeholder="Enter athlete's name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Athlete Email Address</label>
                  <input
                    type="email"
                    value={provEmail}
                    onChange={(e) => setProvEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-card border border-card-border focus:border-primary/50 text-white font-bold text-sm focus:outline-none"
                    placeholder="athlete@example.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Password Credentials</label>
                  <input
                    type="password"
                    value={provPassword}
                    onChange={(e) => setProvPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-card border border-card-border focus:border-primary/50 text-white font-bold text-sm focus:outline-none"
                    placeholder="Set athlete initial password"
                  />
                </div>

                {provisionError && (
                  <div className="p-3.5 rounded-xl bg-status-red/10 border border-status-red/30 text-status-red text-[11px] font-bold flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{provisionError}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProvisionModal(false)}
                    className="flex-1 py-3.5 rounded-2xl border border-card-border text-foreground hover:text-white font-bold transition-all cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold hover:shadow-lg transition-all cursor-pointer text-xs"
                  >
                    Create Workspace
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10 space-y-10">
        
        {/* Team Overview Bento Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Active Roster Size</span>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-black text-white">{athletes.length}</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-status-green/5 to-transparent flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Team Avg Score</span>
              <Activity className="w-5 h-5 text-status-green" />
            </div>
            <p className="text-3xl font-black text-white">{avgScore}</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-status-orange/5 to-transparent flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Top Streak</span>
              <TrendingUp className="w-5 h-5 text-status-orange" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{bestStreakAthlete?.streak || 0}</p>
              {bestStreakAthlete && (
                <p className="text-[9px] text-muted-foreground font-bold uppercase mt-1">Athlete: {bestStreakAthlete.name}</p>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-status-red/5 to-transparent flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Needs Attention</span>
              <AlertCircle className={`w-5 h-5 ${criticalCount > 0 ? 'text-status-red animate-pulse' : 'text-status-green'}`} />
            </div>
            <p className={`text-3xl font-black ${criticalCount > 0 ? 'text-status-red' : 'text-status-green'}`}>
              {criticalCount}
            </p>
          </div>
        </section>

        {/* Athletes Bento Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-card-border/50 pb-4">
            <h2 className="text-xl font-black text-white tracking-tight">Athlete Progress Trackers</h2>
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Flagged Profiles Promoted</span>
          </div>
          
          {athletes.length === 0 ? (
            <div className="glass-panel p-16 rounded-3xl text-center">
              <Users className="w-12 h-12 text-muted-foreground/35 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-4">No Athletes Bound to Workspace</p>
              <button
                onClick={() => setShowProvisionModal(true)}
                className="px-6 py-3 rounded-2xl bg-primary text-white font-bold hover:shadow-lg transition-all cursor-pointer text-xs"
              >
                Provision First Athlete
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedAthletes.map((athlete) => (
                <AthleteCard
                  key={athlete.id}
                  athlete={athlete}
                  onClick={() => onSelectAthlete(athlete)}
                  large={athlete.status === 'red' || athlete.status === 'orange'}
                />
              ))}
            </div>
          )}
        </section>

        {/* Team-wide Adherence Analytics Section */}
        {athletes.length > 0 && (
          <section className="space-y-6">
            <div className="border-b border-card-border/50 pb-4">
              <h2 className="text-xl font-black text-white tracking-tight">Team-wide Analytics Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <AdherenceHeatmap scores={mockHeatmapData} />
              </div>
              <div className="lg:col-span-2">
                <SimpleLineChart
                  data={Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    const dStr = d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
                    return {
                      date: dStr,
                      value: Math.floor(Math.random() * 20) + 70,
                    };
                  })}
                  title="Team Daily Scores Performance Trend"
                  metric="Average Score (0-100)"
                  target={75}
                  color="primary"
                />
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
};
