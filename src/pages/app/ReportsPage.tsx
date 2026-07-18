import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Brain,
  Sparkles,
  Download,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { useSupabaseData } from '../../hooks/useSupabaseData';

const typeConfig: Record<string, { label: string; color: string; icon: typeof Calendar }> = {
  daily: { label: 'Daily Executive Brief', color: 'from-primary-500/20 to-primary-600/5 text-primary-300', icon: Calendar },
  weekly: { label: 'Weekly Infrastructure Report', color: 'from-secondary-500/20 to-secondary-600/5 text-secondary-300', icon: TrendingUp },
  monthly: { label: 'Monthly Civic Intelligence Report', color: 'from-accent-500/20 to-accent-600/5 text-accent-300', icon: FileText },
};

export function ReportsPage() {
  const { reports, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader title="AI Reports" subtitle="Loading..." icon={<FileText className="h-5 w-5" />} />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="AI Intelligence Reports"
        subtitle="Auto-generated executive briefs and civic intelligence summaries"
        icon={<FileText className="h-5 w-5" />}
      />

      {/* AI Banner */}
      <GlassCard className="mb-6 p-6" glow>
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500">
            <Sparkles className="h-6 w-6 text-white" />
            <motion.div className="absolute inset-0 rounded-2xl" animate={{ boxShadow: ['0 0 0 0 rgba(245,158,11,0.4)', '0 0 0 10px rgba(245,158,11,0)'] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white">AI-Generated Reports</h2>
            <p className="text-sm text-ink-400">CivicIQ AI automatically generates daily, weekly, and monthly intelligence reports from complaint data.</p>
          </div>
        </div>
      </GlassCard>

      {/* Reports */}
      <div className="grid gap-5 lg:grid-cols-2">
        {reports.map((report, i) => {
          const config = typeConfig[report.type] || typeConfig.daily;
          const Icon = config.icon;
          const content = report.content || {};

          return (
            <motion.div key={report.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-2xl bg-gradient-to-br ${config.color} p-2.5`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <Badge variant="info">{config.label}</Badge>
                      <p className="text-[10px] text-ink-500 mt-1">
                        {new Date(report.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 rounded-xl glass px-3 py-1.5 text-xs text-ink-300 hover:text-white hover:bg-white/10 transition-all">
                    <Download className="h-3.5 w-3.5" /> Export
                  </button>
                </div>

                {/* Title */}
                <h3 className="font-display text-lg font-bold text-white">{report.title}</h3>

                {/* Summary */}
                <div className="mt-3 rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/5 border border-primary-500/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-3.5 w-3.5 text-secondary-400" />
                    <span className="text-xs font-medium text-secondary-300">AI Summary</span>
                  </div>
                  <p className="text-sm text-ink-200 leading-relaxed">{report.summary}</p>
                </div>

                {/* Content metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {Object.entries(content).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="rounded-xl glass p-2.5">
                      <p className="text-[10px] text-ink-500 uppercase tracking-wider">{key.replace(/_/g, ' ')}</p>
                      <p className="text-sm font-semibold text-white mt-0.5">{String(value)}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-ink-500">
                    <CheckCircle2 className="h-3 w-3 text-success-400" />
                    AI Verified · {report.type === 'daily' ? 'Generated 6:00 AM' : 'Generated automatically'}
                  </div>
                  <button className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors">
                    Read Full Report <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Generate new */}
      <div className="mt-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-secondary-500/20 to-primary-500/10 p-2.5">
                <Sparkles className="h-5 w-5 text-secondary-300" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-white">Generate New Report</h3>
                <p className="text-xs text-ink-400">AI will analyze current data and generate a fresh intelligence report</p>
              </div>
            </div>
            <button className="btn-primary text-sm">
              <Sparkles className="h-4 w-4" /> Generate Report
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
