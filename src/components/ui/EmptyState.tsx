import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl glass-strong">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/10 to-secondary-500/5" />
        <div className="relative text-ink-400">{icon}</div>
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-white">{title}</h3>
      {description && <p className="mt-1.5 max-w-xs text-sm text-ink-500 text-pretty">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
