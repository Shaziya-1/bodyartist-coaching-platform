import React, { useMemo } from 'react';

interface HeatmapProps {
  scores: { date: string; score: number }[]; // Last 12 weeks of daily scores
  athleteName?: string;
  compact?: boolean;
  onCellClick?: (date: string) => void;
  selectedDate?: string;
}

export const AdherenceHeatmap: React.FC<HeatmapProps> = ({ scores, athleteName, compact = false, onCellClick, selectedDate }) => {
  // Generate heatmap cells (Last 12 weeks = 84 days) for a cleaner dashboard display
  const heatmapData = useMemo(() => {
    const cells: { date: string; score: number | null }[] = [];
    const scoreMap = new Map(scores.map(s => [s.date, s.score]));
    
    const today = new Date();
    // Start from 12 weeks ago (84 days)
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      cells.push({
        date: dateStr,
        score: scoreMap.get(dateStr) ?? null
      });
    }
    
    return cells;
  }, [scores]);

  const getColorClass = (score: number | null): string => {
    if (score === null) return 'bg-card/40 border-card-border/40';
    if (score >= 85) return 'bg-emerald-500 border-emerald-600/20 shadow-sm shadow-emerald-500/10';
    if (score >= 70) return 'bg-amber-500 border-amber-600/20 shadow-sm shadow-amber-500/10';
    if (score >= 50) return 'bg-orange-500 border-orange-600/20 shadow-sm shadow-orange-500/10';
    return 'bg-rose-500 border-rose-600/20 shadow-sm shadow-rose-500/10';
  };

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className={`${compact ? '' : 'glass-panel p-6 rounded-3xl'}`}>
      {!compact && (
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
          <span>📊 12-Week Adherence Heatmap</span>
          {athleteName && <span className="text-xs text-muted-foreground font-normal lowercase">({athleteName})</span>}
        </h3>
      )}
      
      <div className="flex items-center gap-3">
        {/* Day labels column */}
        <div className="flex flex-col gap-1.5 justify-between h-[116px] text-[10px] text-muted-foreground font-extrabold pr-1.5 select-none pt-0.5">
          {days.map((day, i) => (
            <span key={i} className="h-3.5 flex items-center justify-center">{day}</span>
          ))}
        </div>
        
        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2 flex-1 scrollbar-thin">
          <div 
            className="inline-grid gap-1.5" 
            style={{ 
              gridTemplateRows: 'repeat(7, minmax(0, 1fr))', 
              gridAutoFlow: 'column',
              gridAutoColumns: 'minmax(0, 1fr)'
            }}
          >
            {heatmapData.map((cell, idx) => {
              const isSelected = cell.date === selectedDate;
              return (
                <div
                  key={idx}
                  onClick={() => onCellClick && onCellClick(cell.date)}
                  className={`w-3.5 h-3.5 rounded-sm border transition-all duration-200 cursor-pointer hover:scale-115 relative group ${getColorClass(cell.score)} ${
                    isSelected ? 'ring-2 ring-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.5)] z-10' : ''
                  }`}
                >
                  {/* Custom Tooltip */}
                  <div className="pointer-events-none opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-card border border-card-border/80 text-[10px] font-semibold text-white rounded-xl whitespace-nowrap shadow-xl z-50 transition-opacity duration-200">
                    <span className="block font-bold">{cell.date}</span>
                    <span className="block text-primary">Score: {cell.score !== null ? `${cell.score}%` : 'No Log'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground uppercase font-bold mt-5 pr-2 select-none">
        <span>Red (Red Alert)</span>
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
          <div className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
          <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
        </div>
        <span>Green (Max Adherence)</span>
      </div>
    </div>
  );
};
