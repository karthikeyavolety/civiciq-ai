import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  Droplets,
  Zap,
  Car,
  Trash2,
  Building2,
  Activity,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ComposedChart,
} from 'recharts';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { Badge } from '../../components/ui/Badge';
import { PageSkeleton } from '../../components/ui/Skeleton';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import type { Department } from '../../lib/supabase';

/* ------------------------------------------------------------------ */
/*  Static datasets                                                    */
/* ------------------------------------------------------------------ */

type MonthlyDatum = {
  month: string;
  complaints: number;
  resolved: number;
  budget: number;
};

const monthlyData: MonthlyDatum[] = [
  { month: 'Jan', complaints: 1820, resolved: 1210, budget: 450 },
  { month: 'Feb', complaints: 2100, resolved: 1480, budget: 520 },
  { month: 'Mar', complaints: 1950, resolved: 1390, budget: 480 },
  { month: 'Apr', complaints: 2240, resolved: 1610, budget: 590 },
  { month: 'May', complaints: 2580, resolved: 1820, budget: 680 },
  { month: 'Jun', complaints: 2847, resolved: 1920, budget: 720 },
];

type ResolutionDatum = {
  dept: string;
  hours: number;
  color: string;
};

const resolutionTime: ResolutionDatum[] = [
  { dept: 'Water', hours: 5, color: '#22c55e' },
  { dept: 'Roads', hours: 48, color: '#ef4444' },
  { dept: 'Power', hours: 12, color: '#3b82f6' },
  { dept: 'Sanitation', hours: 8, color: '#22c55e' },
  { dept: 'Traffic', hours: 3, color: '#22c55e' },
  { dept: 'Public', hours: 24, color: '#f59e0b' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const deptIcons: Record<string, LucideIcon> = {
  'Water Works': Droplets,
  'Roads & Transport': Car,
  Electricity: Zap,
  Sanitation: Trash2,
  Traffic: Car,
  'Public Works': Building2,
};

const scoreTone = (score: number): { text: string; bar: string; badge: 'success' | 'warning' | 'error' } => {
  if (score >= 80) {
    return {
      text: 'text-success-400',
      bar: 'from-success-500 to-success-400',
      badge: 'success',
    };
  }
  if (score >= 70) {
    return {
      text: 'text-warning-400',
      bar: 'from-warning-500 to-warning-400',
      badge: 'warning',
    };
  }
  return {
    text: 'text-error-400',
    bar: 'from-error-500 to-error-400',
    badge: 'error',
  };
};

/* ------------------------------------------------------------------ */
/*  Custom chart tooltip                                               */
/* ------------------------------------------------------------------ */

type TooltipEntry = {
  name: string;
  value: number;
  color?: string;
  fill?: string;
  dataKey: string;
  payload: Record<string, unknown>;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
};

function TrendTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry, i) => {
        const color = entry.color || entry.fill || '#cbd5e1';
        return (
          <p key={i} style={{ color }} className="text-[11px]">
            {entry.name}: {entry.value.toLocaleString('en-IN')}
          </p>
        );
      })}
    </div>
  );
}

type ResolutionPayload = {
  dept: string;
  hours: number;
  color: string;
};

function ResolutionTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload as unknown as ResolutionPayload;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{item.dept}</p>
      <p className="text-[11px] text-ink-300">Avg: {item.hours}h</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section heading                                                    */
/* ------------------------------------------------------------------ */

function SectionHeading({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/15 to-secondary-500/8 border border-primary-500/15">
          {icon}
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-white text-balance">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-2xs text-ink-500 text-pretty">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Department performance row                                         */
/* ------------------------------------------------------------------ */

function DepartmentRow({ dept, index }: { dept: Department; index: number }) {
  const Icon = deptIcons[dept.name] || Building2;
  const tone = scoreTone(dept.performance_score);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      className="group flex items-center gap-3"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10"
        style={{ background: `linear-gradient(135deg, ${dept.color}26, ${dept.color}0d)` }}
      >
        <Icon className="h-4 w-4" strokeWidth={1.8} style={{ color: dept.color }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-xs font-medium text-ink-200">{dept.name}</span>
            <Badge variant={tone.badge} size="sm">
              {dept.performance_score >= 80 ? 'Excellent' : dept.performance_score >= 70 ? 'Good' : 'Needs work'}
            </Badge>
          </div>
          <span className={`font-display text-sm font-bold ${tone.text}`}>
            <AnimatedNumber value={dept.performance_score} />
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${dept.performance_score}%` }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 + index * 0.06 }}
            className={`h-full rounded-full bg-gradient-to-r ${tone.bar}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function AnalyticsPage() {
  const { departments, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Analytics"
          subtitle="Loading insights…"
          icon={<BarChart3 className="h-5 w-5" strokeWidth={1.8} />}
        />
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Analytics"
        subtitle="Deep insights into complaint patterns and department performance"
        icon={<BarChart3 className="h-5 w-5" strokeWidth={1.8} />}
      />

      {/* Top stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Complaints (6mo)"
          value={<AnimatedNumber value={13537} />}
          icon={<Users className="h-5 w-5" strokeWidth={1.8} />}
          accent="primary"
          trend={{ value: '18%', positive: false }}
          delay={0}
        />
        <StatCard
          label="Resolution Rate"
          value={<AnimatedNumber value={67} suffix="%" />}
          icon={<CheckCircle2 className="h-5 w-5" strokeWidth={1.8} />}
          accent="success"
          trend={{ value: '5%', positive: true }}
          delay={0.06}
        />
        <StatCard
          label="Avg Resolution Time"
          value={<AnimatedNumber value={6.2} decimals={1} suffix="h" />}
          icon={<Clock className="h-5 w-5" strokeWidth={1.8} />}
          accent="secondary"
          trend={{ value: '15%', positive: true }}
          delay={0.12}
        />
        <StatCard
          label="Budget Utilized"
          value={
            <span>
              ₹<AnimatedNumber value={3440} />K
            </span>
          }
          icon={<Wallet className="h-5 w-5" strokeWidth={1.8} />}
          accent="accent"
          trend={{ value: '12%', positive: false }}
          delay={0.18}
        />
      </div>

      {/* Monthly trends — composed chart */}
      <div className="mt-6">
        <GlassCard className="p-6" glow>
          <SectionHeading
            icon={<TrendingUp className="h-4 w-4 text-primary-300" strokeWidth={1.8} />}
            title="Monthly Complaint & Resolution Trends"
            description="Complaints received vs. resolved over the last 6 months, with budget allocation"
            action={
              <div className="hidden items-center gap-4 sm:flex">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-b from-primary-400 to-primary-600/40" />
                  <span className="text-2xs font-medium text-ink-400">Complaints</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-b from-success-400 to-success-600/40" />
                  <span className="text-2xs font-medium text-ink-400">Resolved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded-full bg-accent-400" />
                  <span className="text-2xs font-medium text-ink-400">Budget (₹K)</span>
                </div>
              </div>
            }
          />
          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart data={monthlyData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="barComplaints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.25} />
                </linearGradient>
                <linearGradient id="barResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.25} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="month"
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<TrendTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar
                dataKey="complaints"
                name="Complaints"
                fill="url(#barComplaints)"
                stroke="none"
                fillOpacity={0.8}
                radius={[6, 6, 0, 0]}
                barSize={18}
              />
              <Bar
                dataKey="resolved"
                name="Resolved"
                fill="url(#barResolved)"
                stroke="none"
                fillOpacity={0.8}
                radius={[6, 6, 0, 0]}
                barSize={18}
              />
              <Line
                type="monotone"
                dataKey="budget"
                name="Budget (₹K)"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Resolution time + department performance */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Resolution time by department */}
        <GlassCard className="p-6" tilt>
          <SectionHeading
            icon={<Clock className="h-4 w-4 text-secondary-300" strokeWidth={1.8} />}
            title="Avg Resolution Time by Department"
            description="Hours from complaint filed to resolved, color-coded by SLA"
          />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resolutionTime} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
              <defs>
                {resolutionTime.map((d) => (
                  <linearGradient key={d.dept} id={`res-${d.dept}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={d.color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={d.color} stopOpacity={0.4} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis
                type="number"
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit="h"
              />
              <YAxis
                type="category"
                dataKey="dept"
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={56}
              />
              <Tooltip content={<ResolutionTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="hours" name="Hours" radius={[0, 8, 8, 0]} barSize={16} stroke="none">
                {resolutionTime.map((entry) => (
                  <Cell key={entry.dept} fill={`url(#res-${entry.dept})`} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Department performance scores */}
        <GlassCard className="p-6" tilt>
          <SectionHeading
            icon={<Activity className="h-4 w-4 text-accent-300" strokeWidth={1.8} />}
            title="Department Performance Scores"
            description="Composite score from resolution rate, response time & citizen satisfaction"
            action={
              <Badge variant="info" size="sm">
                {departments.length} departments
              </Badge>
            }
          />
          <div className="space-y-4">
            {departments.map((dept, i) => (
              <DepartmentRow key={dept.id} dept={dept} index={i} />
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
