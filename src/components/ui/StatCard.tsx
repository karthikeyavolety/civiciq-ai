import { type ReactNode } from 'react';
import { GlassCard } from './GlassCard';

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  trend?: { value: string; positive?: boolean };
  accent?: string;
  delay?: number;
};

export function StatCard({ label, value, icon, trend, accent = 'primary', delay = 0 }: StatCardProps) {
  const accentColors: Record<string, string> = {
    primary: 'from-primary-500/20 to-primary-600/5 text-primary-300',
    secondary: 'from-secondary-500/20 to-secondary-600/5 text-secondary-300',
    accent: 'from-accent-500/20 to-accent-600/5 text-accent-300',
    success: 'from-success-500/20 to-success-600/5 text-success-300',
    error: 'from-error-500/20 to-error-600/5 text-error-300',
  };

  return (
    <GlassCard className="p-5" transition={{ delay }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wider">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold text-white">{value}</p>
        </div>
        {icon && (
          <div className={`rounded-2xl bg-gradient-to-br ${accentColors[accent]} p-2.5`}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className={trend.positive ? 'text-success-400' : 'text-error-400'}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-ink-500">vs last week</span>
        </div>
      )}
    </GlassCard>
  );
}
