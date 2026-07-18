import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

type BadgeProps = {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'critical';
  className?: string;
  icon?: ReactNode;
};

const variants = {
  default: 'bg-white/10 text-ink-200 border-white/15',
  success: 'bg-success-500/15 text-success-300 border-success-500/30',
  warning: 'bg-warning-500/15 text-warning-300 border-warning-500/30',
  error: 'bg-error-500/15 text-error-300 border-error-500/30',
  info: 'bg-primary-500/15 text-primary-300 border-primary-500/30',
  critical: 'bg-red-500/20 text-red-300 border-red-500/40',
};

export function Badge({ children, variant = 'default', className = '', icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

type PriorityBadgeProps = { priority: string };

export function PriorityBadge({ priority }: PriorityBadgeProps) {
const map: Record<string, { variant: NonNullable<BadgeProps['variant']>; label: string }> = {
    critical: { variant: 'critical', label: 'Critical' },
    high: { variant: 'error', label: 'High' },
    medium: { variant: 'warning', label: 'Medium' },
    low: { variant: 'info', label: 'Low' },
  };
  const config = map[priority] ?? map.low;
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${variants[config.variant]}`}
    >
      {config.variant === 'critical' && (
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-1.5 w-1.5 rounded-full bg-red-400"
        />
      )}
      {config.label}
    </motion.span>
  );
}
