import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Users,
  Building2,
  Shield,
  Activity,
  Database,
  Server,
  HardDrive,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Droplets,
  Zap,
  Car,
  Trash2,
  UserCog,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { PageSkeleton } from '../../components/ui/Skeleton';
import { useSupabaseData } from '../../hooks/useSupabaseData';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type AdminUser = {
  name: string;
  role: string;
  dept: string;
  status: 'active' | 'inactive';
};

type SystemService = {
  name: string;
  status: 'operational' | 'degraded';
  uptime: string;
  icon: LucideIcon;
};

type PermissionRow = {
  role: string;
  perms: [boolean, boolean, boolean, boolean, boolean];
};

type StatConfig = {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
  tint: string;
  ring: string;
  tone: string;
};

/* ------------------------------------------------------------------ */
/*  Static datasets                                                    */
/* ------------------------------------------------------------------ */

const deptIcons: Record<string, LucideIcon> = {
  'Water Works': Droplets,
  'Roads & Transport': Car,
  Electricity: Zap,
  Sanitation: Trash2,
  Traffic: Car,
  'Public Works': Building2,
};

const systemServices: SystemService[] = [
  { name: 'AI Root Cause Engine', status: 'operational', uptime: '99.98%', icon: Cpu },
  { name: 'NLP Classification Service', status: 'operational', uptime: '99.95%', icon: Activity },
  { name: 'Geospatial Analysis', status: 'operational', uptime: '99.99%', icon: Server },
  { name: 'Report Generator', status: 'operational', uptime: '99.92%', icon: HardDrive },
  { name: 'Notification Service', status: 'degraded', uptime: '98.87%', icon: AlertTriangle },
  { name: 'Database Cluster', status: 'operational', uptime: '99.99%', icon: Database },
];

const adminUsers: AdminUser[] = [
  { name: 'Ananya Kapoor', role: 'Chief Commissioner', dept: 'Administration', status: 'active' },
  { name: 'Rajesh Kumar', role: 'Water Works Head', dept: 'Water Works', status: 'active' },
  { name: 'Sunita Sharma', role: 'Roads Director', dept: 'Roads & Transport', status: 'active' },
  { name: 'Amit Patel', role: 'Electrical Engineer', dept: 'Electricity', status: 'active' },
  { name: 'Priya Singh', role: 'Sanitation Officer', dept: 'Sanitation', status: 'inactive' },
  { name: 'Vikram Reddy', role: 'Traffic Controller', dept: 'Traffic', status: 'active' },
];

const permissionMatrix: PermissionRow[] = [
  { role: 'Chief Commissioner', perms: [true, true, true, true, true] },
  { role: 'Department Head', perms: [true, true, true, false, false] },
  { role: 'Field Officer', perms: [true, true, false, false, false] },
  { role: 'Citizen', perms: [true, true, false, false, false] },
];

const permissionColumns = ['View', 'Create', 'Edit', 'Delete', 'Admin'] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;

const scoreTone = (
  score: number,
): { text: string; bar: string } => {
  if (score >= 80) return { text: 'text-success-400', bar: 'from-success-500 to-success-400' };
  if (score >= 70) return { text: 'text-warning-400', bar: 'from-warning-500 to-warning-400' };
  return { text: 'text-error-400', bar: 'from-error-500 to-error-400' };
};

const initials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function AdminPage() {
  const { departments, complaints, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Admin Panel"
          subtitle="Manage users, departments, system health, and permissions"
          icon={<Settings className="h-5 w-5" strokeWidth={1.8} />}
        />
        <PageSkeleton />
      </div>
    );
  }

  const operationalCount = systemServices.filter(
    (s) => s.status === 'operational',
  ).length;
  const allOperational = operationalCount === systemServices.length;
  const avgUptime = 99.97;

  const stats: StatConfig[] = [
    {
      label: 'Total Users',
      value: adminUsers.length,
      icon: Users,
      tint: 'from-primary-500/20 to-primary-600/5',
      ring: 'border-primary-500/20',
      tone: 'text-primary-300',
    },
    {
      label: 'Departments',
      value: departments.length,
      icon: Building2,
      tint: 'from-secondary-500/20 to-secondary-600/5',
      ring: 'border-secondary-500/20',
      tone: 'text-secondary-300',
    },
    {
      label: 'Total Complaints',
      value: complaints.length,
      icon: AlertTriangle,
      tint: 'from-accent-500/20 to-accent-600/5',
      ring: 'border-accent-500/20',
      tone: 'text-accent-300',
    },
    {
      label: 'System Uptime',
      value: avgUptime,
      suffix: '%',
      decimals: 2,
      icon: CheckCircle2,
      tint: 'from-success-500/20 to-success-600/5',
      ring: 'border-success-500/20',
      tone: 'text-success-300',
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Admin Panel"
        subtitle="Manage users, departments, system health, and permissions"
        icon={<Settings className="h-5 w-5" strokeWidth={1.8} />}
      />

      {/* ─── Overview stat cards ─── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.label} className="glass-premium p-5" delay={i * 0.06}>
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-2xs font-medium uppercase tracking-ultrawide text-ink-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
                    <AnimatedNumber
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br ${stat.tint} ${stat.ring}`}
                >
                  <Icon className={`h-5 w-5 ${stat.tone}`} strokeWidth={1.8} />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* ─── User management + Departments ─── */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* User management */}
        <GlassCard className="p-6" delay={0.05}>
          <SectionHeader
            icon={<UserCog className="h-5 w-5 text-primary-300" strokeWidth={1.8} />}
            title="User Management"
            subtitle="Admin accounts & access"
            action={
              <AddButton label="Add User" tint="primary" />
            }
          />
          <div className="space-y-2">
            {adminUsers.map((user, i) => (
              <motion.div
                key={user.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}
                className="flex items-center justify-between rounded-2xl glass p-3 transition-colors hover:bg-white/[0.07]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-2xs font-bold text-white shadow-glow">
                    {initials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{user.name}</p>
                    <p className="truncate text-2xs text-ink-500">
                      {user.role} · {user.dept}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={user.status === 'active' ? 'success' : 'default'}
                  size="sm"
                  icon={
                    user.status === 'active' ? (
                      <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-1.5 w-1.5 rounded-full bg-success-400"
                      />
                    ) : undefined
                  }
                >
                  {user.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Departments */}
        <GlassCard className="p-6" delay={0.1}>
          <SectionHeader
            icon={<Building2 className="h-5 w-5 text-secondary-300" strokeWidth={1.8} />}
            title="Departments"
            subtitle="Civic units & performance"
            action={<AddButton label="Add Department" tint="secondary" />}
          />
          <div className="space-y-2">
            {departments.map((dept, i) => {
              const Icon = deptIcons[dept.name] ?? Building2;
              const tone = scoreTone(dept.performance_score);
              return (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}
                  className="flex items-center justify-between rounded-2xl glass p-3 transition-colors hover:bg-white/[0.07]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/10">
                      <Icon className="h-4 w-4 text-primary-300" strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{dept.name}</p>
                      <p className="truncate text-2xs text-ink-500">
                        {dept.head_officer} · {dept.active_complaints} active
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${dept.performance_score}%` }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 }}
                        className={`h-full rounded-full bg-gradient-to-r ${tone.bar}`}
                      />
                    </div>
                    <span className={`w-7 text-right font-display text-sm font-bold ${tone.text}`}>
                      {dept.performance_score}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* ─── System health ─── */}
      <div className="mt-6">
        <GlassCard className="p-6" glow delay={0.05}>
          <SectionHeader
            icon={<Shield className="h-5 w-5 text-success-300" strokeWidth={1.8} />}
            title="System Health"
            subtitle="Real-time service status"
            action={
              <Badge
                variant={allOperational ? 'success' : 'warning'}
                icon={
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className={`h-1.5 w-1.5 rounded-full ${
                      allOperational ? 'bg-success-400' : 'bg-warning-400'
                    }`}
                  />
                }
              >
                {allOperational
                  ? 'All Systems Operational'
                  : `${operationalCount}/${systemServices.length} Operational`}
              </Badge>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {systemServices.map((service, i) => {
              const Icon = service.icon;
              const isOperational = service.status === 'operational';
              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}
                  className="rounded-2xl glass p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                          isOperational
                            ? 'border-success-500/20 bg-success-500/10'
                            : 'border-warning-500/20 bg-warning-500/10'
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${isOperational ? 'text-success-400' : 'text-warning-400'}`}
                          strokeWidth={1.8}
                        />
                      </div>
                      <span className="truncate text-xs font-medium text-white">
                        {service.name}
                      </span>
                    </div>
                    <span className="relative flex h-2 w-2 shrink-0">
                      {isOperational && (
                        <motion.span
                          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute inline-flex h-full w-full rounded-full bg-success-400"
                        />
                      )}
                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full ${
                          isOperational ? 'bg-success-400' : 'bg-warning-400'
                        }`}
                      />
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-2xs">
                    <span
                      className={`font-medium uppercase tracking-ultrawide ${
                        isOperational ? 'text-success-300' : 'text-warning-300'
                      }`}
                    >
                      {isOperational ? 'Operational' : 'Degraded'}
                    </span>
                    <span className="text-ink-500">Uptime {service.uptime}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* ─── Role permissions matrix ─── */}
      <div className="mt-6">
        <GlassCard className="p-6" delay={0.05}>
          <SectionHeader
            icon={<Shield className="h-5 w-5 text-accent-300" strokeWidth={1.8} />}
            title="Role Permissions"
            subtitle="Access control matrix"
          />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="pb-3 pr-4 text-left text-2xs font-medium uppercase tracking-ultrawide text-ink-500">
                    Role
                  </th>
                  {permissionColumns.map((col) => (
                    <th
                      key={col}
                      className="px-3 pb-3 text-center text-2xs font-medium uppercase tracking-ultrawide text-ink-500"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionMatrix.map((row, i) => (
                  <motion.tr
                    key={row.role}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.35, ease: EASE, delay: i * 0.05 }}
                    className="border-b border-white/[0.04] transition-colors last:border-b-0 hover:bg-white/[0.02]"
                  >
                    <td className="py-3.5 pr-4 text-sm font-medium text-white">{row.role}</td>
                    {row.perms.map((perm, j) => (
                      <td key={j} className="px-3 py-3.5 text-center">
                        {perm ? (
                          <CheckCircle2
                            className="mx-auto h-4 w-4 text-success-400"
                            strokeWidth={1.8}
                          />
                        ) : (
                          <span className="mx-auto block h-4 w-4 rounded-full border border-white/[0.08] bg-white/[0.02]" />
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Local presentational components                                    */
/* ------------------------------------------------------------------ */

function SectionHeader({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl glass">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold tracking-tight text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="truncate text-2xs text-ink-500">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

function AddButton({ label, tint }: { label: string; tint: 'primary' | 'secondary' }) {
  const styles =
    tint === 'primary'
      ? 'from-primary-500/20 to-secondary-500/10 border-primary-500/25 text-primary-200 hover:from-primary-500/30 hover:to-secondary-500/20'
      : 'from-secondary-500/20 to-primary-500/10 border-secondary-500/25 text-secondary-200 hover:from-secondary-500/30 hover:to-primary-500/20';
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-xl border bg-gradient-to-r px-3 py-1.5 text-2xs font-semibold transition-all ${styles}`}
    >
      <Plus className="h-3.5 w-3.5" strokeWidth={2} />
      {label}
    </button>
  );
}
