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
    <div className="sticky top-0 z-30 -mx-6 mb-6 border-b border-white/5 bg-ink-950/70 backdrop-blur-2xl px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/10 text-primary-300 border border-primary-500/20">
              {icon}
            </div>
          )}
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-display text-xl font-bold text-white"
            >
              {title}
            </motion.h1>
            {subtitle && <p className="text-sm text-ink-400">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <button className="flex items-center gap-2 rounded-2xl glass px-4 py-2 text-sm text-ink-300 hover:text-white hover:bg-white/10 transition-all">
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search</span>
          </button>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl glass text-ink-300 hover:text-white hover:bg-white/10 transition-all">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error-500 text-[9px] font-bold text-white">
              5
            </span>
          </button>
          <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500/20 to-secondary-500/10 border border-primary-500/30 px-3 py-2">
            <Sparkles className="h-4 w-4 text-secondary-300" />
            <span className="text-xs font-medium text-secondary-200">AI Active</span>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-success-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
