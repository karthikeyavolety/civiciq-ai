import { motion } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  Users,
  AlertTriangle,
  Brain,
  Sparkles,
  CheckCircle2,
  Clock,
  Droplets,
  Zap,
  Car,
  Trash2,
  Building2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { Badge, PriorityBadge } from '../../components/ui/Badge';
import { useSupabaseData } from '../../hooks/useSupabaseData';

const trendData = [
  { day: 'Mon', complaints: 42, resolved: 28 },
  { day: 'Tue', complaints: 55, resolved: 35 },
  { day: 'Wed', complaints: 48, resolved: 40 },
  { day: 'Thu', complaints: 67, resolved: 45 },
  { day: 'Fri', complaints: 52, resolved: 48 },
  { day: 'Sat', complaints: 38, resolved: 30 },
  { day: 'Sun', complaints: 31, resolved: 25 },
];

const rootCauseDist = [
  { name: 'Water Works', value: 125, color: '#06b6d4' },
  { name: 'Roads & Transport', value: 89, color: '#3b82f6' },
  { name: 'Electricity', value: 78, color: '#f59e0b' },
  { name: 'Sanitation', value: 142, color: '#22c55e' },
  { name: 'Traffic', value: 67, color: '#ef4444' },
];

const infraHealth = [
  { name: 'Roads', score: 74, fill: '#3b82f6' },
  { name: 'Water', score: 82, fill: '#06b6d4' },
  { name: 'Electricity', score: 86, fill: '#f59e0b' },
  { name: 'Garbage', score: 70, fill: '#22c55e' },
  { name: 'Traffic', score: 68, fill: '#ef4444' },
];

const satisfactionData = [
  { ward: 'W1', score: 90 },
  { ward: 'W2', score: 60 },
  { ward: 'W3', score: 93 },
  { ward: 'W4', score: 68 },
  { ward: 'W5', score: 87 },
  { ward: 'W6', score: 55 },
  { ward: 'W7', score: 80 },
  { ward: 'W8', score: 83 },
];

const heatmapData = [
  { ward: 'W1', water: 92, roads: 85, power: 88, garbage: 84, traffic: 86 },
  { ward: 'W2', water: 62, roads: 58, power: 70, garbage: 55, traffic: 68 },
  { ward: 'W3', water: 94, roads: 90, power: 95, garbage: 91, traffic: 88 },
  { ward: 'W4', water: 74, roads: 66, power: 78, garbage: 70, traffic: 72 },
  { ward: 'W5', water: 88, roads: 82, power: 90, garbage: 84, traffic: 80 },
  { ward: 'W6', water: 60, roads: 50, power: 65, garbage: 52, traffic: 56 },
  { ward: 'W7', water: 80, roads: 74, power: 82, garbage: 76, traffic: 74 },
  { ward: 'W8', water: 85, roads: 78, power: 84, garbage: 80, traffic: 82 },
];

const recommendations = [
  { text: 'Deploy emergency water tankers to Ward 2 & 6 immediately', priority: 'critical', icon: Droplets },
  { text: 'Schedule transformer replacement in Industrial Zone within 12 hours', priority: 'high', icon: Zap },
  { text: 'Re-optimize garbage collection routes for 3 underserved wards', priority: 'medium', icon: Trash2 },
  { text: 'Re-calibrate traffic signals at main junction — firmware rollback needed', priority: 'medium', icon: Car },
  { text: 'Begin road resurfacing in Sector 4 after drainage repair completes', priority: 'high', icon: Building2 },
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

function heatColor(value: number) {
  if (value >= 85) return 'bg-success-500/60';
  if (value >= 75) return 'bg-success-500/30';
  if (value >= 65) return 'bg-warning-500/40';
  if (value >= 55) return 'bg-warning-500/25';
  return 'bg-error-500/40';
}

export function ExecutivePage() {
  const { rootCauses, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader title="Executive Dashboard" subtitle="Loading..." icon={<Activity className="h-5 w-5" />} />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle="City-wide civic intelligence and infrastructure health"
        icon={<Activity className="h-5 w-5" />}
      />

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Citizens Affected" value={<AnimatedNumber value={rootCauses.reduce((s, r) => s + r.affected_citizens, 0)} />} icon={<Users className="h-5 w-5" />} accent="primary" />
        <StatCard label="Critical Issues" value={<AnimatedNumber value={rootCauses.filter((r) => r.severity === 'critical').length} />} icon={<AlertTriangle className="h-5 w-5" />} accent="error" />
        <StatCard label="Avg Resolution" value="6.2h" icon={<Clock className="h-5 w-5" />} accent="secondary" trend={{ value: '15%', positive: true }} />
        <StatCard label="Citizen Satisfaction" value={<AnimatedNumber value={74} suffix="%" />} icon={<CheckCircle2 className="h-5 w-5" />} accent="success" trend={{ value: '4%', positive: true }} />
      </div>

      {/* Charts row 1 */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Complaint trends */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-400" />
              <h3 className="font-display text-lg font-semibold text-white">Complaint Trends</h3>
            </div>
            <Badge variant="info">Last 7 days</Badge>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="complaints" name="Complaints" stroke="#3b82f6" strokeWidth={2} fill="url(#colorComplaints)" />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={2} fill="url(#colorResolved)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Root cause distribution */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-secondary-400" />
            <h3 className="font-display text-lg font-semibold text-white">Root Cause Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={rootCauseDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {rootCauseDist.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {rootCauseDist.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-ink-400">{d.name}</span>
                </div>
                <span className="text-ink-300 font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Charts row 2 */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Infrastructure health radial */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-accent-400" />
            <h3 className="font-display text-lg font-semibold text-white">Infrastructure Health</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadialBarChart data={infraHealth} innerRadius="20%" outerRadius="90%" startAngle={90} endAngle={-270}>
              <RadialBar dataKey="score" cornerRadius={8} background={{ fill: 'rgba(255,255,255,0.05)' }}>
                {infraHealth.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </RadialBar>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Citizen satisfaction */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-success-400" />
              <h3 className="font-display text-lg font-semibold text-white">Citizen Satisfaction by Ward</h3>
            </div>
            <Badge variant="success">Avg 74%</Badge>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={satisfactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="ward" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" name="Satisfaction" radius={[8, 8, 0, 0]}>
                {satisfactionData.map((entry, i) => (
                  <Cell key={i} fill={entry.score >= 80 ? '#22c55e' : entry.score >= 65 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Heatmap */}
      <div className="mt-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-400" />
              <h3 className="font-display text-lg font-semibold text-white">Infrastructure Heatmap</h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-ink-500">
              <span>Low</span>
              <div className="flex gap-1">
                <div className="h-3 w-6 rounded bg-error-500/40" />
                <div className="h-3 w-6 rounded bg-warning-500/25" />
                <div className="h-3 w-6 rounded bg-warning-500/40" />
                <div className="h-3 w-6 rounded bg-success-500/30" />
                <div className="h-3 w-6 rounded bg-success-500/60" />
              </div>
              <span>High</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="pb-2 text-left text-[10px] font-medium uppercase tracking-wider text-ink-500">Ward</th>
                  <th className="pb-2 text-center text-[10px] font-medium uppercase tracking-wider text-ink-500">Water</th>
                  <th className="pb-2 text-center text-[10px] font-medium uppercase tracking-wider text-ink-500">Roads</th>
                  <th className="pb-2 text-center text-[10px] font-medium uppercase tracking-wider text-ink-500">Power</th>
                  <th className="pb-2 text-center text-[10px] font-medium uppercase tracking-wider text-ink-500">Garbage</th>
                  <th className="pb-2 text-center text-[10px] font-medium uppercase tracking-wider text-ink-500">Traffic</th>
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row) => (
                  <tr key={row.ward}>
                    <td className="py-1.5 text-sm font-medium text-white">{row.ward}</td>
                    <td className="p-1"><div className={`mx-auto h-10 w-16 rounded-lg ${heatColor(row.water)} flex items-center justify-center text-xs font-bold text-white`}>{row.water}</div></td>
                    <td className="p-1"><div className={`mx-auto h-10 w-16 rounded-lg ${heatColor(row.roads)} flex items-center justify-center text-xs font-bold text-white`}>{row.roads}</div></td>
                    <td className="p-1"><div className={`mx-auto h-10 w-16 rounded-lg ${heatColor(row.power)} flex items-center justify-center text-xs font-bold text-white`}>{row.power}</div></td>
                    <td className="p-1"><div className={`mx-auto h-10 w-16 rounded-lg ${heatColor(row.garbage)} flex items-center justify-center text-xs font-bold text-white`}>{row.garbage}</div></td>
                    <td className="p-1"><div className={`mx-auto h-10 w-16 rounded-lg ${heatColor(row.traffic)} flex items-center justify-center text-xs font-bold text-white`}>{row.traffic}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* AI Recommendations */}
      <div className="mt-6">
        <GlassCard className="p-6" glow>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-secondary-400" />
            <h3 className="font-display text-lg font-semibold text-white">AI Recommendations</h3>
            <Badge variant="info" icon={<motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-success-400" />}>
              Live
            </Badge>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, i) => {
              const Icon = rec.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 rounded-2xl glass p-3 hover:bg-white/10 transition-all"
                >
                  <div className="rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/10 p-2">
                    <Icon className="h-4 w-4 text-primary-300" />
                  </div>
                  <p className="flex-1 text-sm text-ink-200">{rec.text}</p>
                  <PriorityBadge priority={rec.priority} />
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
