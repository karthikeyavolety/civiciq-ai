import { motion } from 'framer-motion';
import {
  Bot,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Target,
  Calendar,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge, PriorityBadge } from '../../components/ui/Badge';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function CopilotPage() {
  const { actionPlans, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader title="Officer Copilot" subtitle="Loading..." icon={<Bot className="h-5 w-5" />} />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-secondary-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  const topPlan = actionPlans[0];
  const totalAffected = actionPlans.reduce((sum, ap) => sum + ap.affected_population, 0);
  const avgPriority = actionPlans.length > 0 ? actionPlans.reduce((sum, ap) => sum + ap.priority_score, 0) / actionPlans.length : 0;

  return (
    <div className="p-6">
      <PageHeader
        title="Officer Copilot"
        subtitle="AI-generated executive action plan for today"
        icon={<Bot className="h-5 w-5" />}
      />

      {/* AI Banner */}
      <GlassCard className="mb-6 p-6" glow>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-500">
              <Bot className="h-7 w-7 text-white" />
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{ boxShadow: ['0 0 0 0 rgba(6,182,212,0.4)', '0 0 0 12px rgba(6,182,212,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white">Executive Action Plan</h2>
              <p className="text-sm text-ink-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Generated for {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-white"><AnimatedNumber value={totalAffected} /></p>
              <p className="text-[10px] text-ink-500 uppercase tracking-wider">Total Affected</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-white"><AnimatedNumber value={avgPriority} decimals={0} /></p>
              <p className="text-[10px] text-ink-500 uppercase tracking-wider">Avg Priority</p>
            </div>
            <Badge variant="info" icon={<motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-success-400" />}>
              AI Generated
            </Badge>
          </div>
        </div>
      </GlassCard>

      {/* Top priority spotlight */}
      {topPlan && (
        <GlassCard className="mb-6 overflow-hidden p-0" glow>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent" />
            <div className="relative p-6">
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </motion.div>
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Today's Critical Issue</span>
                <Badge variant="critical">Priority {topPlan.priority_score}</Badge>
              </div>

              <h2 className="font-display text-2xl font-bold text-white">{topPlan.critical_issue}</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <CopilotStat icon={Users} label="Affected" value={topPlan.affected_population.toLocaleString('en-IN')} color="text-primary-300" />
                <CopilotStat icon={Building2} label="Department" value={topPlan.recommended_department || '—'} color="text-secondary-300" />
                <CopilotStat icon={TrendingUp} label="Budget" value={topPlan.estimated_budget || '—'} color="text-accent-300" />
                <CopilotStat icon={Users} label="Team" value={topPlan.suggested_team || '—'} color="text-success-300" />
                <CopilotStat icon={Clock} label="Time" value={topPlan.completion_time || '—'} color="text-warning-300" />
                <CopilotStat icon={Target} label="Priority" value={`P${topPlan.priority_score}`} color="text-red-300" />
              </div>

              {/* Confidence & Priority scores */}
              <div className="mt-6 flex items-center gap-8">
                <div className="flex flex-col items-center">
                  <CircularProgress value={topPlan.confidence_score} label={topPlan.confidence_score.toFixed(0)} sublabel="Confidence" color="#3b82f6" size={100} />
                </div>
                <div className="flex flex-col items-center">
                  <CircularProgress value={topPlan.priority_score} label={topPlan.priority_score.toFixed(0)} sublabel="Priority" color="#ef4444" size={100} />
                </div>
                <div className="flex-1 rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/5 border border-primary-500/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-secondary-400" />
                    <span className="text-xs font-medium text-secondary-300">AI Analysis</span>
                  </div>
                  <p className="text-sm text-ink-200">
                    This issue requires immediate attention. AI has identified {topPlan.affected_population.toLocaleString('en-IN')} citizens
                    affected. Deploy {topPlan.suggested_team} with an estimated budget of {topPlan.estimated_budget}.
                    Expected completion: {topPlan.completion_time}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* All action plans */}
      <div>
        <h3 className="mb-4 font-display text-lg font-semibold text-white">All Action Items</h3>
        <div className="space-y-3">
          {actionPlans.map((ap, i) => (
            <motion.div
              key={ap.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/10">
                      <span className="font-display text-sm font-bold text-primary-300">#{i + 1}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{ap.critical_issue}</p>
                      <div className="mt-1 flex items-center gap-3 text-[10px] text-ink-500">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {ap.affected_population.toLocaleString('en-IN')}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ap.completion_time}</span>
                        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {ap.estimated_budget}</span>
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {ap.recommended_department}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs font-bold text-primary-300">{ap.confidence_score.toFixed(0)}%</p>
                        <p className="text-[9px] text-ink-500">Confidence</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-red-300">P{ap.priority_score}</p>
                        <p className="text-[9px] text-ink-500">Priority</p>
                      </div>
                    </div>
                    <PriorityBadge priority={ap.priority_score >= 90 ? 'critical' : ap.priority_score >= 80 ? 'high' : 'medium'} />
                    <ChevronRight className="h-4 w-4 text-ink-600" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CopilotStat({ icon: Icon, label, value, color }: { icon: typeof Users; label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl glass p-3">
      <Icon className={`h-4 w-4 ${color} mb-2`} />
      <p className="text-xs text-ink-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-white mt-0.5">{value}</p>
    </div>
  );
}
