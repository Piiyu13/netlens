import { useMemo } from 'react';

interface LineChartProps {
  data: number[];
  color?: string;
  height?: number;
  labels?: string[];
  gradient?: boolean;
  strokeWidth?: number;
}

export function LineChart({ data, color = '#a3e635', height = 200, labels, gradient = true, strokeWidth = 2 }: LineChartProps) {
  const width = 800;
  const padding = { top: 20, right: 20, bottom: labels ? 30 : 10, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const { points, areaPath, max, min } = useMemo(() => {
    if (data.length === 0) return { points: '', areaPath: '', max: 0, min: 0 };
    const max = Math.max(...data) * 1.1;
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const step = chartW / Math.max(data.length - 1, 1);
    const pts = data.map((d, i) => {
      const x = padding.left + i * step;
      const y = padding.top + chartH - ((d - min) / range) * chartH;
      return `${x},${y}`;
    });
    const points = pts.join(' ');
    const areaPath = `M ${padding.left},${padding.top + chartH} L ${pts.join(' L ')} L ${padding.left + (data.length - 1) * step},${padding.top + chartH} Z`;
    return { points, areaPath, max, min };
  }, [data, chartW, chartH, padding.left, padding.top]);

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((p) => padding.top + chartH * p);
  const gid = useMemo(() => `grad-${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridLines.map((y, i) => (
        <line key={i} x1={padding.left} y1={y} x2={width - padding.right} y2={y}
          stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      ))}
      {gradient && <path d={areaPath} fill={`url(#${gid})`} />}
      <polyline points={points} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => {
        const step = chartW / Math.max(data.length - 1, 1);
        const x = padding.left + i * step;
        const range = (max - min) || 1;
        const y = padding.top + chartH - ((d - min) / range) * chartH;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} className="opacity-0 hover:opacity-100" />;
      })}
      {labels && labels.slice(0, 6).map((label, i) => {
        const step = chartW / Math.max(labels.length - 1, 1);
        const x = padding.left + i * step * (labels.length / 6);
        return (
          <text key={i} x={x} y={height - 8} fontSize="11" fill="var(--text-muted)" textAnchor="middle">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  horizontal?: boolean;
}

export function BarChart({ data, height = 200, horizontal = false }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  if (horizontal) {
    return (
      <div className="space-y-3" style={{ minHeight: height }}>
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-24 text-sm text-s truncate flex-shrink-0">{d.label}</div>
            <div className="flex-1 h-7 bg-tertiary rounded-lg overflow-hidden relative">
              <div
                className="h-full rounded-lg transition-all duration-500 flex items-center justify-end px-2"
                style={{ width: `${(d.value / max) * 100}%`, background: d.color || 'var(--accent)' }}
              >
                <span className="text-xs font-mono font-semibold text-white">{d.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
          <div className="w-full flex-1 flex items-end">
            <div
              className="w-full rounded-t-lg transition-all duration-500 group-hover:opacity-80 relative"
              style={{
                height: `${(d.value / max) * 100}%`,
                background: d.color || 'var(--accent)',
                minHeight: '4px',
              }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-p">
                {d.value}
              </span>
            </div>
          </div>
          <span className="text-xs text-m truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, size = 180, thickness = 28, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {data.map((d, i) => {
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const segment = (
              <circle
                key={i}
                cx={size / 2} cy={size / 2} r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            );
            offset += dash;
            return segment;
          })}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && <span className="text-2xl font-bold text-p font-mono">{centerValue}</span>}
            {centerLabel && <span className="text-xs text-s mt-1">{centerLabel}</span>}
          </div>
        )}
      </div>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm" style={{ background: d.color }} />
            <span className="text-sm text-s">{d.label}</span>
            <span className="text-sm font-mono text-p ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export function Sparkline({ data, color = '#a3e635', height = 40, width = 120 }: SparklineProps) {
  const max = Math.max(...data) || 1;
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = width / Math.max(data.length - 1, 1);
  const points = data.map((d, i) => `${i * step},${height - ((d - min) / range) * height}`).join(' ');
  const gid = `spark-${color.replace('#', '')}`;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface HeatmapProps {
  rows: number;
  cols: number;
  data?: number[][];
  colorScale?: (v: number) => string;
}

export function Heatmap({ rows, cols, data, colorScale }: HeatmapProps) {
  const grid = data || Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random())
  );
  const defaultScale = (v: number) => {
    if (v < 0.3) return 'rgba(34,197,94,0.3)';
    if (v < 0.6) return 'rgba(234,179,8,0.5)';
    if (v < 0.8) return 'rgba(249,115,22,0.7)';
    return 'rgba(220,38,38,0.9)';
  };
  const scale = colorScale || defaultScale;

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {grid.map((row, i) =>
        row.map((v, j) => (
          <div
            key={`${i}-${j}`}
            className="rounded-sm transition-all hover:scale-110 cursor-pointer"
            style={{
              aspectRatio: '1',
              background: scale(v),
            }}
            title={`Value: ${(v * 100).toFixed(0)}%`}
          />
        ))
      )}
    </div>
  );
}

interface GaugeProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  size?: number;
}

export function Gauge({ value, max = 100, label, color = '#a3e635', size = 120 }: GaugeProps) {
  const pct = Math.min(value / max, 1);
  const radius = size / 2 - 10;
  const circumference = Math.PI * radius;
  const dash = pct * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 + 10 }}>
        <svg width={size} height={size / 2 + 10}>
          <path
            d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
            fill="none"
            stroke="var(--border)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <span className="text-xl font-bold text-p font-mono">{value}%</span>
        </div>
      </div>
      {label && <span className="text-xs text-s mt-1">{label}</span>}
    </div>
  );
}

interface AreaChartProps {
  data: { in: number; out: number }[];
  height?: number;
}

export function AreaChart({ data, height = 200 }: AreaChartProps) {
  const width = 800;
  const padding = { top: 20, right: 20, bottom: 10, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const allVals = data.flatMap((d) => [d.in, d.out]);
  const max = Math.max(...allVals, 1) * 1.1;
  const step = chartW / Math.max(data.length - 1, 1);

  const makePath = (key: 'in' | 'out') => {
    const pts = data.map((d, i) => {
      const x = padding.left + i * step;
      const y = padding.top + chartH - (d[key] / max) * chartH;
      return `${x},${y}`;
    });
    const path = `M ${padding.left},${padding.top + chartH} L ${pts.join(' L ')} L ${padding.left + (data.length - 1) * step},${padding.top + chartH} Z`;
    return { path, points: pts.join(' ') };
  };

  const inData = makePath('in');
  const outData = makePath('out');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="area-in" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3e635" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="area-out" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1={padding.left} y1={padding.top + chartH * p} x2={width - padding.right} y2={padding.top + chartH * p}
          stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      ))}
      <path d={inData.path} fill="url(#area-in)" />
      <path d={outData.path} fill="url(#area-out)" />
      <polyline points={inData.points} fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={outData.points} fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
