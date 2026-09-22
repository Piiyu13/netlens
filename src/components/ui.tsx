import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'safe' | 'suspicious' | 'malicious' | 'info';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<string, { bg: string; text: string; dot: string }> = {
  default: { bg: 'rgba(139,149,176,0.15)', text: 'var(--text-secondary)', dot: '#8b95b0' },
  critical: { bg: 'rgba(220,38,38,0.15)', text: '#f87171', dot: '#dc2626' },
  high: { bg: 'rgba(249,115,22,0.15)', text: '#fb923c', dot: '#f97316' },
  medium: { bg: 'rgba(234,179,8,0.15)', text: '#facc15', dot: '#eab308' },
  low: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80', dot: '#22c55e' },
  safe: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80', dot: '#22c55e' },
  suspicious: { bg: 'rgba(234,179,8,0.15)', text: '#facc15', dot: '#eab308' },
  malicious: { bg: 'rgba(220,38,38,0.15)', text: '#f87171', dot: '#dc2626' },
  info: { bg: 'rgba(0,217,255,0.15)', text: '#22d3ee', dot: '#00d9ff' },
};

export function Badge({ children, variant = 'default', size = 'sm', className, dot }: BadgeProps) {
  const style = variantStyles[variant] || variantStyles.default;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
      style={{ background: style.bg, color: style.text }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full pulse-dot"
          style={{ background: style.dot, color: style.dot }}
        />
      )}
      {children}
    </span>
  );
}

export function Card({ children, className, hover = true }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={cn('card p-5', hover && 'hover:border-lc', className)}>
      {children}
    </div>
  );
}

export function StatCard({
  label, value, icon, trend, color = 'var(--accent)', sublabel,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  color?: string;
  sublabel?: string;
}) {
  return (
    <div className="card p-5 group hover:border-lc transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ background: `${color}20`, color }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              background: trend.positive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              color: trend.positive ? '#4ade80' : '#f87171',
            }}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-p font-mono">{value}</div>
      <div className="text-sm text-s mt-1">{label}</div>
      {sublabel && <div className="text-xs text-m mt-0.5">{sublabel}</div>}
    </div>
  );
}

export function Button({
  children, onClick, variant = 'primary', size = 'md', className, type = 'button', disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const variants: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'bg-tertiary text-p border border-c hover:border-lc',
    ghost: 'text-s hover:text-p hover:bg-hover-c',
    danger: 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25',
    success: 'bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        variants[variant], sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}

export function ProgressBar({ value, color = 'var(--accent)', className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={cn('h-2 rounded-full overflow-hidden bg-tertiary', className)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, value)}%`, background: color }}
      />
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        onClick={onChange}
        className="relative w-11 h-6 rounded-full transition-colors duration-200"
        style={{ background: checked ? 'var(--accent)' : 'var(--border-light)' }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
          style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
        />
      </button>
      {label && <span className="text-sm text-p">{label}</span>}
    </label>
  );
}

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div
      className="rounded-full border-2 border-transparent animate-spin"
      style={{
        width: size, height: size,
        borderTopColor: 'var(--accent)',
        borderRightColor: 'var(--accent)',
      }}
    />
  );
}

export function EmptyState({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-tertiary flex items-center justify-center mb-4 text-m">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-p mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-s max-w-sm">{subtitle}</p>}
    </div>
  );
}
