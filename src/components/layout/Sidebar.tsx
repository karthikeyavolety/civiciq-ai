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

const navGroups = [
  {
    label: 'Intelligence',
    items: [
      { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
      { to: '/app/intelligence', label: 'AI Intelligence', icon: Brain },
      { to: '/app/copilot', label: 'Officer Copilot', icon: Bot },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/app/executive', label: 'Executive Dashboard', icon: Activity },
      { to: '/app/citizen', label: 'Citizen Portal', icon: Users },
      { to: '/app/health', label: 'Civic Health Score', icon: Shield },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/app/reports', label: 'AI Reports', icon: FileText },
      { to: '/app/map', label: 'Infrastructure Map', icon: Map },
      { to: '/app/admin', label: 'Admin Panel', icon: Settings },
    ],
  },
];

export function Sidebar({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/[0.06] bg-ink-950/70 backdrop-blur-2xl">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 px-5 py-5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-glow">
              <Brain className="h-5 w-5 text-white" />
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0.35)', '0 0 0 10px rgba(59,130,246,0)'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
              />
            </div>
            <div>
              <span className="font-display text-base font-bold tracking-tight text-white">CivicIQ</span>
              <p className="text-2xs text-ink-600 tracking-wide">AI Intelligence Layer</p>
            </div>
          </NavLink>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 no-scrollbar">
            {navGroups.map((group) => (
              <div key={group.label} className="mb-1">
                <p className="px-3 py-2 text-2xs font-semibold uppercase tracking-ultrawide text-ink-600">
                  {group.label}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'text-white'
                            : 'text-ink-400 hover:text-white hover:bg-white/[0.04]'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active"
                              className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/15 to-secondary-500/8 border border-primary-500/20"
                              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                            />
                          )}
                          <Icon className="relative h-4 w-4 shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                          <span className="relative">{item.label}</span>
                          {isActive && <ChevronRight className="relative ml-auto h-3.5 w-3.5 text-primary-400" />}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/[0.06] p-3">
            <NavLink
              to="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
            >
              <Home className="h-4 w-4" strokeWidth={1.8} />
              Back to Landing
            </NavLink>
            <div className="mt-2 flex items-center gap-3 rounded-xl glass px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-xs font-bold text-white shadow-sm">
                AK
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-white">Ananya Kapoor</p>
                <p className="truncate text-2xs text-ink-600">Chief Commissioner</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
