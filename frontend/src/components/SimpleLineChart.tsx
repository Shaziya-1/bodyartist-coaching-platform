import React, { useMemo } from 'react';

interface ChartDataPoint {
  date: string;
  value: number;
}

interface SimpleLineChartProps {
  data: ChartDataPoint[];
  title: string;
  metric: string;
  target?: number;
  threshold?: number;
  color?: 'primary' | 'green' | 'orange';
  height?: number;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  title,
  metric,
  target,
  color = 'primary',
  height = 180,
}) => {
  const { min, max, width, height: chartHeight, points } = useMemo(() => {
    const defaultData = data && data.length > 0 ? data : [
      { date: 'Day 1', value: 70 },
      { date: 'Day 2', value: 80 }
    ];

    const values = defaultData.map(d => d.value);
    const minVal = Math.min(...values, target || 0);
    const maxVal = Math.max(...values, target || 100);
    const diff = maxVal - minVal;
    const padding = diff * 0.15 || 10;
    
    const min = Math.max(0, minVal - padding);
    const max = maxVal + padding;
    
    const w = 450;
    const h = height;
    
    const points = defaultData.map((d, i) => {
      const x = (i / (defaultData.length - 1)) * (w - 70) + 40;
      const y = h - 35 - ((d.value - min) / (max - min)) * (h - 60);
      return { x, y, value: d.value, date: d.date };
    });

    return { min, max, width: w, height: h, points };
  }, [data, height, target]);

  const strokeColor = useMemo(() => {
    if (color === 'green') return 'hsl(var(--status-green))';
    if (color === 'orange') return 'hsl(var(--status-orange))';
    return 'hsl(var(--primary))';
  }, [color]);

  const gradientId = useMemo(() => `chart-glow-${Math.random().toString(36).substr(2, 9)}`, []);

  // Compute curved path logic (Cubic Bezier control points)
  const pathData = useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 3;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (2 * (next.x - curr.x)) / 3;
      const cpY2 = next.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return d;
  }, [points]);

  // Compute gradient area path
  const areaPathData = useMemo(() => {
    if (points.length === 0) return '';
    return `${pathData} L ${points[points.length - 1].x} ${chartHeight - 35} L ${points[0].x} ${chartHeight - 35} Z`;
  }, [pathData, points, chartHeight]);

  const targetY = useMemo(() => {
    if (target === undefined) return 0;
    return chartHeight - 35 - ((target - min) / (max - min)) * (chartHeight - 60);
  }, [target, min, max, chartHeight]);

  return (
    <div className="glass-panel p-6 rounded-3xl overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">{title}</h4>
          <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-0.5 block">{metric}</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto select-none scrollbar-none">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${width} ${chartHeight}`} className="min-w-[400px]">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid horizontal guidelines */}
          {[0.25, 0.5, 0.75].map((pct, i) => {
            const y = chartHeight - 35 - (chartHeight - 60) * pct;
            return (
              <line
                key={i}
                x1="35"
                y1={y}
                x2={width - 30}
                y2={y}
                stroke="rgba(255, 255, 255, 0.04)"
                strokeDasharray="4"
              />
            );
          })}

          {/* Target Milestone Threshold line */}
          {target !== undefined && (
            <g>
              <line
                x1="35"
                y1={targetY}
                x2={width - 30}
                y2={targetY}
                stroke="hsl(var(--status-orange))"
                strokeDasharray="5"
                strokeWidth="1.5"
                opacity="0.5"
              />
              <text
                x={width - 80}
                y={targetY - 6}
                fill="hsl(var(--status-orange))"
                className="text-[9px] font-extrabold uppercase tracking-widest"
                opacity="0.8"
              >
                Target
              </text>
            </g>
          )}

          {/* Fill Gradient Area under curve */}
          {areaPathData && (
            <path d={areaPathData} fill={`url(#${gradientId})`} />
          )}

          {/* Core Curve Path */}
          {pathData && (
            <path
              d={pathData}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Coordinates hover highlight spots */}
          {points.map((p, i) => (
            <g key={i} className="group/dot cursor-help">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="hsl(var(--background))"
                stroke={strokeColor}
                strokeWidth="2.5"
              />
              {/* Tooltip Overlay inside SVG */}
              <g className="opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200">
                <rect
                  x={Math.max(10, p.x - 35)}
                  y={p.y - 32}
                  width="70"
                  height="20"
                  rx="4"
                  fill="hsl(var(--card))"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                />
                <text
                  x={p.x}
                  y={p.y - 19}
                  textAnchor="middle"
                  fill="white"
                  className="text-[9px] font-extrabold"
                >
                  {p.value}
                </text>
              </g>
            </g>
          ))}

          {/* Axes lines */}
          <line x1="35" y1="20" x2="35" y2={chartHeight - 35} stroke="rgba(255, 255, 255, 0.06)" />
          <line x1="35" y1={chartHeight - 35} x2={width - 20} y2={chartHeight - 35} stroke="rgba(255, 255, 255, 0.06)" />
        </svg>
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase font-bold mt-2 pr-2 select-none">
        <span>{data[0]?.date || 'Start'}</span>
        {target !== undefined && <span className="text-status-orange/70">Threshold: {target}</span>}
        <span>{data[data.length - 1]?.date || 'End'}</span>
      </div>
    </div>
  );
};
