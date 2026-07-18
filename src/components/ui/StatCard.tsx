import { type ReactNode } from 'react';
import { GlassCard } from './GlassCard';

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  trend?: { value: string; positive?: boolean };
  accent?: 'primary' | 'secondary' | 'accent' | 'success' | 'error';
  delay?: number;
};

const accentGradients: Record<string, string> = {
  primary: 'from-primary-500/20 to-primary-600/5 text-primary-300',
  secondary: 'from-secondary-500/20 to-secondary-600/5 text-secondary-300',
  accent: 'from-accent-500/20 to-accent-600/5 text-accent-300',
  success: 'from-success-500/20 to-success-600/5 text-success-300',
  error: 'from-error-500/20 to-error-600/5 text-error-300',
};

const accentGlow: Record<string, string> = {
  primary: 'shadow-[0_0_20px_-4px_rgba(59,130,246,0.25)]',
  secondary: 'shadow-[0_0_20px_-4px_rgba(6,182,212,0.25)]',
  accent: 'shadow-[0_0_20px_-4px_rgba(245,158,11,0.20)]',
  success: 'shadow-[0_0_20px_-4px_rgba(34,197,94,0.20)]',
  error: 'shadow-[0_0_20px_-4px_rgba(239,68,68,0.20)]',
};

export function StatCard({ label, value, icon, trend, accent = 'primary', delay = 0 }: StatCardProps) {
  return (
    <GlassCard className="p-5" delay={delay} tilt>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-2xs font-semibold uppercase tracking-ultrawide text-ink-500">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-white">{value}</p>
        </div>
        {icon && (
          <div className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accentGradients[accent]} ${accentGlow[accent]} p-2.5`}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={`text-xs font-medium ${trend.positive ? 'text-success-400' : 'text-error-400'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-2xs text-ink-600">vs last week</span>
        </div>
      )}
    </GlassCard>
  );
}
