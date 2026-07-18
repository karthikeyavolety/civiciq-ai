import { motion } from 'framer-motion';
import {
  Brain,
  Clock,
  Sparkles,
  Droplets,
  Zap,
  Car,
  Trash2,
  Building2,
  MapPin,
  Wrench,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge, PriorityBadge } from '../../components/ui/Badge';
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

const severityColors: Record<string, string> = {
  critical: 'from-red-500/20 to-red-600/5 border-red-500/30',
  high: 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
  medium: 'from-amber-500/20 to-amber-600/5 border-amber-500/30',
  low: 'from-primary-500/20 to-primary-600/5 border-primary-500/30',
};

export function IntelligencePage() {
  const { rootCauses, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader title="AI Intelligence Center" subtitle="Loading..." icon={<Brain className="h-5 w-5" />} />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
        </div>
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
        icon={<Brain className="h-5 w-5" />}
      />

      {/* Summary banner */}
      <GlassCard className="mb-6 p-6" glow>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500">
              <Brain className="h-7 w-7 text-white" />
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0.4)', '0 0 0 12px rgba(59,130,246,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white">Root Cause Engine</h2>
              <p className="text-sm text-ink-400">
                AI has clustered <span className="text-primary-300 font-semibold">{totalComplaints} complaints</span> into{' '}
                <span className="text-secondary-300 font-semibold">{rootCauses.length} root causes</span> affecting{' '}
                <span className="text-accent-300 font-semibold">{totalCitizens.toLocaleString('en-IN')} citizens</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-white"><AnimatedNumber value={avgConfidence} decimals={1} />%</p>
              <p className="text-[10px] text-ink-500 uppercase tracking-wider">Avg Confidence</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-white"><AnimatedNumber value={rootCauses.length} /></p>
              <p className="text-[10px] text-ink-500 uppercase tracking-wider">Root Causes</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Root cause cards */}
      <div className="grid gap-5 lg:grid-cols-2">
        {rootCauses.map((rc, i) => {
          const Icon = deptIcons[rc.department || ''] || Building2;
          return (
            <motion.div
              key={rc.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <GlassCard className={`overflow-hidden p-6 border-2 ${severityColors[rc.severity] || severityColors.low}`}>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/10 p-2.5">
                      <Icon className="h-5 w-5 text-primary-300" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">{rc.title}</h3>
                      <p className="text-xs text-ink-500">{rc.department}</p>
                    </div>
                  </div>
                  <PriorityBadge priority={rc.severity} />
                </div>

                {/* Description */}
                <p className="mt-3 text-sm text-ink-400 leading-relaxed">{rc.description}</p>

                {/* Stats grid */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl glass p-3 text-center">
                    <p className="font-display text-xl font-bold text-white">{rc.confidence}%</p>
                    <p className="text-[10px] text-ink-500 mt-0.5">Confidence</p>
                  </div>
                  <div className="rounded-xl glass p-3 text-center">
                    <p className="font-display text-xl font-bold text-white">{rc.affected_citizens.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-ink-500 mt-0.5">Citizens</p>
                  </div>
                  <div className="rounded-xl glass p-3 text-center">
                    <p className="font-display text-xl font-bold text-white">{rc.complaint_count}</p>
                    <p className="text-[10px] text-ink-500 mt-0.5">Complaints</p>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-ink-500 mb-1">
                    <span>AI Confidence</span>
                    <span>{rc.confidence}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rc.confidence}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    />
                  </div>
                </div>

                {/* Affected wards */}
                {rc.affected_wards && rc.affected_wards.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-ink-500 uppercase tracking-wider">Affected Wards:</span>
                    {rc.affected_wards.map((ward) => (
                      <span key={ward} className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-ink-300">
                        <MapPin className="h-2.5 w-2.5" /> {ward}
                      </span>
                    ))}
                  </div>
                )}

                {/* Recommended action */}
                <div className="mt-4 rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/5 border border-primary-500/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-secondary-400" />
                    <span className="text-xs font-medium text-secondary-300">AI Recommended Action</span>
                  </div>
                  <p className="text-sm text-ink-200">{rc.recommended_action}</p>
                </div>

                {/* Footer stats */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-ink-400">
                      <Wrench className="h-3.5 w-3.5 text-accent-400" />
                      {rc.estimated_budget}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink-400">
                      <Clock className="h-3.5 w-3.5 text-primary-400" />
                      {rc.estimated_resolution_hours}h
                    </div>
                  </div>
                  <Badge variant={rc.status === 'active' ? 'error' : 'success'}>
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
