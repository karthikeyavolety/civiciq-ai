import { motion } from 'framer-motion';
import {
  Brain,
  Clock,
  Wrench,
  MapPin,
  Sparkles,
  Droplets,
  Zap,
  Car,
  Trash2,
  Building2,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge, PriorityBadge } from '../../components/ui/Badge';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { PageSkeleton } from '../../components/ui/Skeleton';
import { useSupabaseData } from '../../hooks/useSupabaseData';

const deptIcons: Record<string, typeof Droplets> = {
  'Water Works': Droplets,
  'Roads & Transport': Car,
  Electricity: Zap,
  Sanitation: Trash2,
  Traffic: Car,
  'Public Works': Building2,
};

const severityConfig: Record<string, { border: string; glow: string; badge: string }> = {
  critical: { border: 'border-red-500/20', glow: 'shadow-[0_0_32px_-8px_rgba(239,68,68,0.20)]', badge: 'from-red-500/10 to-red-600/3' },
  high: { border: 'border-orange-500/15', glow: 'shadow-[0_0_32px_-8px_rgba(249,115,22,0.15)]', badge: 'from-orange-500/10 to-orange-600/3' },
  medium: { border: 'border-amber-500/15', glow: 'shadow-[0_0_32px_-8px_rgba(245,158,11,0.12)]', badge: 'from-amber-500/10 to-amber-600/3' },
  low: { border: 'border-primary-500/15', glow: 'shadow-[0_0_32px_-8px_rgba(59,130,246,0.12)]', badge: 'from-primary-500/10 to-primary-600/3' },
};

export function IntelligencePage() {
  const { rootCauses, loading } = useSupabaseData();

  if (loading) {
    return (
      <div>
        <PageHeader title="AI Intelligence Center" subtitle="Root Cause Engine — turning thousands of complaints into actionable intelligence" icon={<Brain className="h-5 w-5" />} />
        <PageSkeleton />
      </div>
    );
  }

  const totalComplaints = rootCauses.reduce((sum, rc) => sum + rc.complaint_count, 0);
  const totalCitizens = rootCauses.reduce((sum, rc) => sum + rc.affected_citizens, 0);
  const avgConfidence = rootCauses.length > 0 ? rootCauses.reduce((sum, rc) => sum + rc.confidence, 0) / rootCauses.length : 0;

  return (
    <div className="p-6">
      <PageHeader
        title="AI Intelligence Center"
        subtitle="Root Cause Engine — turning thousands of complaints into actionable intelligence"
        icon={<Brain className="h-5 w-5" strokeWidth={1.8} />}
      />

      {/* Summary banner */}
      <GlassCard className="mb-6 p-6" glow delay={0.05}>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-glow">
              <Brain className="h-7 w-7 text-white" strokeWidth={1.8} />
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0.35)', '0 0 0 12px rgba(59,130,246,0)'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
              />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-white">Root Cause Engine</h2>
              <p className="text-sm text-ink-400">
                AI has clustered <span className="text-primary-300 font-semibold">{totalComplaints} complaints</span> into{' '}
                <span className="text-secondary-300 font-semibold">{rootCauses.length} root causes</span> affecting{' '}
                <span className="text-accent-300 font-semibold">{totalCitizens.toLocaleString('en-IN')} citizens</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-display text-2xl font-bold tracking-tight text-white"><AnimatedNumber value={avgConfidence} decimals={1} />%</p>
              <p className="text-2xs text-ink-600 uppercase tracking-ultrawide">Avg Confidence</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold tracking-tight text-white"><AnimatedNumber value={rootCauses.length} /></p>
              <p className="text-2xs text-ink-600 uppercase tracking-ultrawide">Root Causes</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Root cause cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {rootCauses.map((rc, i) => {
          const Icon = deptIcons[rc.department || ''] || Building2;
          const sev = severityConfig[rc.severity] || severityConfig.low;
          return (
            <motion.div
              key={rc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard className={`overflow-hidden p-6 border ${sev.border} ${sev.glow}`} tilt>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-gradient-to-br from-primary-500/15 to-secondary-500/8 p-2.5">
                      <Icon className="h-5 w-5 text-primary-300" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-tight text-white">{rc.title}</h3>
                      <p className="text-2xs text-ink-600">{rc.department}</p>
                    </div>
                  </div>
                  <PriorityBadge priority={rc.severity} size="sm" />
                </div>

                {/* Description */}
                <p className="mt-3 text-sm text-ink-400 leading-relaxed text-pretty">{rc.description}</p>

                {/* Stats grid */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl glass p-3 text-center">
                    <p className="font-display text-xl font-bold tracking-tight text-white">{rc.confidence}%</p>
                    <p className="text-2xs text-ink-600 mt-0.5">Confidence</p>
                  </div>
                  <div className="rounded-xl glass p-3 text-center">
                    <p className="font-display text-xl font-bold tracking-tight text-white">{rc.affected_citizens.toLocaleString('en-IN')}</p>
                    <p className="text-2xs text-ink-600 mt-0.5">Citizens</p>
                  </div>
                  <div className="rounded-xl glass p-3 text-center">
                    <p className="font-display text-xl font-bold tracking-tight text-white">{rc.complaint_count}</p>
                    <p className="text-2xs text-ink-600 mt-0.5">Complaints</p>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-2xs text-ink-600 mb-1">
                    <span>AI Confidence</span>
                    <span>{rc.confidence}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.04]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rc.confidence}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    />
                  </div>
                </div>

                {/* Affected wards */}
                {rc.affected_wards && rc.affected_wards.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-2xs text-ink-600 uppercase tracking-ultrawide">Affected:</span>
                    {rc.affected_wards.map((ward) => (
                      <span key={ward} className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-2xs text-ink-300">
                        <MapPin className="h-2.5 w-2.5" strokeWidth={2} /> {ward}
                      </span>
                    ))}
                  </div>
                )}

                {/* Recommended action */}
                <div className={`mt-4 rounded-2xl bg-gradient-to-br ${sev.badge} border border-primary-500/15 p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-secondary-400" strokeWidth={2} />
                    <span className="text-2xs font-semibold uppercase tracking-ultrawide text-secondary-300">AI Recommended Action</span>
                  </div>
                  <p className="text-sm text-ink-200 leading-relaxed">{rc.recommended_action}</p>
                </div>

                {/* Footer stats */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-ink-400">
                      <Wrench className="h-3.5 w-3.5 text-accent-400" strokeWidth={2} />
                      {rc.estimated_budget}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink-400">
                      <Clock className="h-3.5 w-3.5 text-primary-400" strokeWidth={2} />
                      {rc.estimated_resolution_hours}h
                    </div>
                  </div>
                  <Badge variant={rc.status === 'active' ? 'error' : 'success'} size="sm">
                    {rc.status === 'active' ? 'Active' : 'Resolved'}
                  </Badge>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
