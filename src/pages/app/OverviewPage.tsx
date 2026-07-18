import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Brain,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity,
  Droplets,
  Zap,
  Car,
  Trash2,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { Badge, PriorityBadge } from '../../components/ui/Badge';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { useSupabaseData } from '../../hooks/useSupabaseData';

const deptIcons: Record<string, typeof Droplets> = {
  'Water Works': Droplets,
  'Roads & Transport': Car,
  Electricity: Zap,
  Sanitation: Trash2,
  Traffic: Car,
  'Public Works': Building2,
};

export function OverviewPage() {
  const { departments, wards, complaints, rootCauses, actionPlans, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader title="Government Dashboard" subtitle="Loading AI intelligence..." icon={<LayoutDashboard className="h-5 w-5" />} />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  const totalComplaints = complaints.length;
  const activeComplaints = complaints.filter((c) => c.status === 'active').length;
  const criticalRootCauses = rootCauses.filter((r) => r.severity === 'critical').length;
  const avgHealth = wards.length > 0 ? wards.reduce((sum, w) => sum + w.health_score, 0) / wards.length : 0;

  return (
    <div className="p-6">
      <PageHeader
        title="Government Dashboard"
        subtitle="Real-time civic intelligence overview"
        icon={<LayoutDashboard className="h-5 w-5" />}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Complaints" value={<AnimatedNumber value={totalComplaints} />} icon={<Users className="h-5 w-5" />} accent="primary" trend={{ value: '12%', positive: false }} />
        <StatCard label="Active Issues" value={<AnimatedNumber value={activeComplaints} />} icon={<AlertTriangle className="h-5 w-5" />} accent="error" trend={{ value: '8%', positive: false }} />
        <StatCard label="Root Causes Found" value={<AnimatedNumber value={rootCauses.length} />} icon={<Brain className="h-5 w-5" />} accent="secondary" trend={{ value: '3 new', positive: true }} />
        <StatCard label="Avg Civic Health" value={<AnimatedNumber value={avgHealth} decimals={1} />} icon={<Activity className="h-5 w-5" />} accent="success" trend={{ value: '4%', positive: true }} />
      </div>

      {/* Main grid */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* AI Summary card */}
        <GlassCard className="lg:col-span-2 p-6" glow>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary-400" />
              <h2 className="font-display text-lg font-semibold text-white">AI Intelligence Summary</h2>
            </div>
            <Badge variant="info" icon={<motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-success-400" />}>
              Live Analysis
            </Badge>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/5 border border-primary-500/20 p-4">
            <p className="text-sm text-ink-200 leading-relaxed">
              <span className="text-primary-300 font-medium">CivicIQ AI</span> has identified{' '}
              <span className="text-white font-semibold">{rootCauses.length} root causes</span> from{' '}
              <span className="text-white font-semibold">{totalComplaints} complaints</span> across{' '}
              <span className="text-white font-semibold">{wards.length} wards</span>.{' '}
              {criticalRootCauses > 0 && (
                <><span className="text-error-300 font-semibold">{criticalRootCauses} critical issue{criticalRootCauses > 1 ? 's' : ''}</span> require immediate attention.</>
              )}
            </p>
          </div>

          {/* Top root causes */}
          <div className="mt-4 space-y-3">
            <p className="text-xs font-medium text-ink-400 uppercase tracking-wider">Top Root Causes</p>
            {rootCauses.slice(0, 3).map((rc, i) => (
              <motion.div
                key={rc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between rounded-2xl glass p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/10">
                    <Brain className="h-4 w-4 text-primary-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{rc.title}</p>
                    <p className="text-xs text-ink-500">{rc.complaint_count} complaints · {rc.affected_citizens} citizens</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{rc.confidence}%</p>
                    <p className="text-[10px] text-ink-500">confidence</p>
                  </div>
                  <PriorityBadge priority={rc.severity} />
                </div>
              </motion.div>
            ))}
          </div>

          <Link to="/app/intelligence" className="mt-4 flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors">
            View all root causes <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </GlassCard>

        {/* Civic Health */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-success-400" />
            <h2 className="font-display text-lg font-semibold text-white">Civic Health</h2>
          </div>
          <div className="flex flex-col items-center">
            <CircularProgress value={avgHealth} label={avgHealth.toFixed(0)} sublabel="City Score" color="#22c55e" size={140} />
            <div className="mt-4 grid w-full grid-cols-2 gap-2">
              {wards.slice(0, 4).map((w) => (
                <div key={w.id} className="flex items-center justify-between rounded-xl glass px-3 py-2">
                  <span className="text-xs text-ink-400">Ward {w.number}</span>
                  <span className={`text-sm font-bold ${w.health_score >= 80 ? 'text-success-400' : w.health_score >= 65 ? 'text-warning-400' : 'text-error-400'}`}>
                    {w.health_score}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/app/health" className="mt-4 flex items-center gap-1 text-sm text-success-400 hover:text-success-300 transition-colors">
              All wards <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </GlassCard>
      </div>

      {/* Department performance */}
      <div className="mt-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent-400" />
              <h2 className="font-display text-lg font-semibold text-white">Department Performance</h2>
            </div>
            <Link to="/app/analytics" className="text-sm text-accent-400 hover:text-accent-300 transition-colors">
              View Analytics
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept, i) => {
              const Icon = deptIcons[dept.name] || Building2;
              return (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl glass p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/10 p-2">
                        <Icon className="h-4 w-4 text-primary-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{dept.name}</p>
                        <p className="text-[10px] text-ink-500">{dept.head_officer}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${dept.performance_score >= 80 ? 'text-success-400' : dept.performance_score >= 70 ? 'text-warning-400' : 'text-error-400'}`}>
                      {dept.performance_score}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.performance_score}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-full rounded-full ${dept.performance_score >= 80 ? 'bg-gradient-to-r from-success-500 to-success-400' : dept.performance_score >= 70 ? 'bg-gradient-to-r from-warning-500 to-warning-400' : 'bg-gradient-to-r from-error-500 to-error-400'}`}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-ink-500">
                    <span>{dept.active_complaints} active</span>
                    <span>{dept.resolved_complaints} resolved</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Recent complaints + action plans */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-400" />
              <h2 className="font-display text-lg font-semibold text-white">Recent Complaints</h2>
            </div>
            <Link to="/app/citizen" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {complaints.slice(0, 5).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-2xl glass p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  {c.status === 'active' ? <AlertTriangle className="h-4 w-4 text-warning-400" /> : <CheckCircle2 className="h-4 w-4 text-success-400" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{c.title}</p>
                  <p className="truncate text-xs text-ink-500">{c.department} · {c.category}</p>
                </div>
                <PriorityBadge priority={c.priority} />
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-secondary-400" />
              <h2 className="font-display text-lg font-semibold text-white">Today's Action Plan</h2>
            </div>
            <Link to="/app/copilot" className="text-sm text-secondary-400 hover:text-secondary-300 transition-colors">
              Open Copilot
            </Link>
          </div>
          <div className="space-y-3">
            {actionPlans.slice(0, 4).map((ap, i) => (
              <motion.div
                key={ap.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl glass p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-white">{ap.critical_issue}</p>
                  <span className="shrink-0 rounded-full bg-primary-500/15 px-2 py-0.5 text-[10px] font-medium text-primary-300">
                    P{ap.priority_score}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-ink-500">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {ap.affected_population}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ap.completion_time}</span>
                  <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {ap.estimated_budget}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
