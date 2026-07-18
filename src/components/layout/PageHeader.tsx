import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Sparkles } from 'lucide-react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, icon, actions }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-30 -mx-6 mb-6 border-b border-white/[0.06] bg-ink-950/60 backdrop-blur-2xl px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/15 to-secondary-500/8 text-primary-300 border border-primary-500/15">
              {icon}
            </div>
          )}
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-xl font-bold tracking-tight text-white"
            >
              {title}
            </motion.h1>
            {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {actions}
          <button className="btn-icon" aria-label="Search">
            <Search className="h-4 w-4 text-ink-400" strokeWidth={1.8} />
          </button>
          <button className="relative btn-icon" aria-label="Notifications">
            <Bell className="h-4 w-4 text-ink-400" strokeWidth={1.8} />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error-500 text-2xs font-bold text-white">
              5
            </span>
          </button>
          <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500/12 to-secondary-500/6 border border-primary-500/20 px-3 py-2">
            <Sparkles className="h-3.5 w-3.5 text-secondary-300" strokeWidth={2} />
            <span className="text-2xs font-semibold text-secondary-200">AI Active</span>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-1.5 w-1.5 rounded-full bg-success-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
