import { type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Brain,
  Bot,
  Users,
  BarChart3,
  Settings,
  Shield,
  Activity,
  FileText,
  Map,
  Home,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/intelligence', label: 'AI Intelligence', icon: Brain },
  { to: '/app/copilot', label: 'Officer Copilot', icon: Bot },
  { to: '/app/executive', label: 'Executive Dashboard', icon: Activity },
  { to: '/app/citizen', label: 'Citizen Portal', icon: Users },
  { to: '/app/health', label: 'Civic Health Score', icon: Shield },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/reports', label: 'AI Reports', icon: FileText },
  { to: '/app/map', label: 'Infrastructure Map', icon: Map },
  { to: '/app/admin', label: 'Admin Panel', icon: Settings },
];

export function Sidebar({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 bg-ink-950/80 backdrop-blur-2xl">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 px-6 py-6">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-glow">
              <Brain className="h-5 w-5 text-white" />
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0.4)', '0 0 0 8px rgba(59,130,246,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <span className="font-display text-lg font-bold text-white">CivicIQ</span>
              <p className="text-[10px] text-ink-500">AI Intelligence Layer</p>
            </div>
          </NavLink>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 no-scrollbar">
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-ink-600">
              Platform
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'text-white'
                        : 'text-ink-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-secondary-500/10 border border-primary-500/30"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon className="relative h-4 w-4 shrink-0" />
                      <span className="relative">{item.label}</span>
                      {isActive && (
                        <ChevronRight className="relative ml-auto h-3.5 w-3.5 text-primary-400" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/5 p-3">
            <NavLink
              to="/"
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-ink-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Home className="h-4 w-4" />
              Back to Landing
            </NavLink>
            <div className="mt-2 flex items-center gap-3 rounded-2xl glass px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-xs font-bold text-white">
                AK
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-white">Ananya Kapoor</p>
                <p className="truncate text-[10px] text-ink-500">Chief Commissioner</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
