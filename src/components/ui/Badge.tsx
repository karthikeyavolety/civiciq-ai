import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

type BadgeProps = {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'critical';
  className?: string;
  icon?: ReactNode;
  size?: 'sm' | 'md';
};

const variants = {
  default: 'bg-white/8 text-ink-200 border-white/10',
  success: 'bg-success-500/12 text-success-300 border-success-500/20',
  warning: 'bg-warning-500/12 text-warning-300 border-warning-500/20',
  error: 'bg-error-500/12 text-error-300 border-error-500/20',
  info: 'bg-primary-500/12 text-primary-300 border-primary-500/20',
  critical: 'bg-red-500/15 text-red-300 border-red-500/25',
};

const sizes = {
  sm: 'px-2 py-0.5 text-2xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({ children, variant = 'default', className = '', icon, size = 'md' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

type PriorityBadgeProps = { priority: string; size?: 'sm' | 'md' };

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
const map: Record<string, { variant: NonNullable<BadgeProps['variant']>; label: string; dot?: boolean }> = {
    critical: { variant: 'critical', label: 'Critical', dot: true },
    high: { variant: 'error', label: 'High' },
    medium: { variant: 'warning', label: 'Medium' },
    low: { variant: 'info', label: 'Low' },
  };
  const config = map[priority] ?? map.low;
  return (
    <motion.span
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variants[config.variant]} ${sizes[size]}`}
    >
      {config.dot && (
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="h-1.5 w-1.5 rounded-full bg-red-400"
        />
      )}
      {config.label}
    </motion.span>
  );
}
