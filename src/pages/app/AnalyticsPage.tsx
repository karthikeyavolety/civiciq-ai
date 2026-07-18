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
import { useSupabaseData } from '../../hooks/useSupabaseData';

const deptIcons: Record<string, typeof Droplets> = {
  'Water Works': Droplets,
  'Roads & Transport': Car,
  Electricity: Zap,
  Sanitation: Trash2,
  Traffic: Car,
  'Public Works': Building2,
};

const monthlyData = [
  { month: 'Jan', complaints: 1820, resolved: 1210, budget: 450 },
  { month: 'Feb', complaints: 2100, resolved: 1480, budget: 520 },
  { month: 'Mar', complaints: 1950, resolved: 1390, budget: 480 },
  { month: 'Apr', complaints: 2240, resolved: 1610, budget: 590 },
  { month: 'May', complaints: 2580, resolved: 1820, budget: 680 },
  { month: 'Jun', complaints: 2847, resolved: 1920, budget: 720 },
];

const resolutionTime = [
  { dept: 'Water', hours: 5 },
  { dept: 'Roads', hours: 48 },
  { dept: 'Power', hours: 12 },
  { dept: 'Sanitation', hours: 8 },
  { dept: 'Traffic', hours: 3 },
  { dept: 'Public', hours: 24 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl glass-strong p-3 text-xs">
        <p className="font-medium text-white mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color || entry.fill }} className="text-[11px]">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function AnalyticsPage() {
  const { departments, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader title="Analytics" subtitle="Loading..." icon={<BarChart3 className="h-5 w-5" />} />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Analytics"
        subtitle="Deep insights into complaint patterns and department performance"
        icon={<BarChart3 className="h-5 w-5" />}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Complaints (6mo)" value={<AnimatedNumber value={13537} />} icon={<Users className="h-5 w-5" />} accent="primary" trend={{ value: '18%', positive: false }} />
        <StatCard label="Resolution Rate" value={<AnimatedNumber value={67} suffix="%" />} icon={<CheckCircle2 className="h-5 w-5" />} accent="success" trend={{ value: '5%', positive: true }} />
        <StatCard label="Avg Resolution Time" value="6.2h" icon={<Clock className="h-5 w-5" />} accent="secondary" trend={{ value: '15%', positive: true }} />
        <StatCard label="Budget Utilized (₹K)" value={<AnimatedNumber value={3440} />} icon={<TrendingUp className="h-5 w-5" />} accent="accent" trend={{ value: '12%', positive: false }} />
      </div>

      {/* Monthly trends */}
      <div className="mt-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-400" />
              <h3 className="font-display text-lg font-semibold text-white">Monthly Complaint & Resolution Trends</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={monthlyData}>
              <defs>
                <linearGradient id="barComplaints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="barResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="complaints" name="Complaints" fill="url(#barComplaints)" radius={[6, 6, 0, 0]} barSize={20} />
              <Bar dataKey="resolved" name="Resolved" fill="url(#barResolved)" radius={[6, 6, 0, 0]} barSize={20} />
              <Line type="monotone" dataKey="budget" name="Budget (₹K)" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Resolution time + department performance */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-secondary-400" />
            <h3 className="font-display text-lg font-semibold text-white">Avg Resolution Time by Department</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={resolutionTime} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="#64748b" fontSize={11} unit="h" />
              <YAxis type="category" dataKey="dept" stroke="#64748b" fontSize={11} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" name="Hours" radius={[0, 8, 8, 0]} barSize={18}>
                {resolutionTime.map((entry, i) => (
                  <Cell key={i} fill={entry.hours <= 5 ? '#22c55e' : entry.hours <= 12 ? '#3b82f6' : entry.hours <= 24 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-accent-400" />
            <h3 className="font-display text-lg font-semibold text-white">Department Performance Scores</h3>
          </div>
          <div className="space-y-3">
            {departments.map((dept, i) => {
              const Icon = deptIcons[dept.name] || Building2;
              return (
                <motion.div key={dept.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/10">
                      <Icon className="h-4 w-4 text-primary-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-ink-300">{dept.name}</span>
                        <span className={`text-sm font-bold ${dept.performance_score >= 80 ? 'text-success-400' : dept.performance_score >= 70 ? 'text-warning-400' : 'text-error-400'}`}>{dept.performance_score}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${dept.performance_score}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full rounded-full ${dept.performance_score >= 80 ? 'bg-gradient-to-r from-success-500 to-success-400' : dept.performance_score >= 70 ? 'bg-gradient-to-r from-warning-500 to-warning-400' : 'bg-gradient-to-r from-error-500 to-error-400'}`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
