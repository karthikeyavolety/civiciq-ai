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
  Plus,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import type { Report } from '../../lib/supabase';

// ─── Report type configuration ──────────────────────────────────────────────

type ReportType = 'daily' | 'weekly' | 'monthly';

type TypeConfig = {
  label: string;
  badgeLabel: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  icon: typeof Calendar;
  badgeVariant: 'info' | 'success' | 'warning';
  verifiedNote: string;
};

const typeConfig: Record<ReportType, TypeConfig> = {
  daily: {
    label: 'Daily Executive Brief',
    badgeLabel: 'Daily',
    gradient: 'from-primary-500/12 to-primary-600/[0.03]',
    iconBg: 'from-primary-500/20 to-primary-600/5',
    iconColor: 'text-primary-300',
    icon: Calendar,
    badgeVariant: 'info',
    verifiedNote: 'Generated 6:00 AM IST',
  },
  weekly: {
    label: 'Weekly Infrastructure Report',
    badgeLabel: 'Weekly',
    gradient: 'from-secondary-500/12 to-secondary-600/[0.03]',
    iconBg: 'from-secondary-500/20 to-secondary-600/5',
    iconColor: 'text-secondary-300',
    icon: TrendingUp,
    badgeVariant: 'success',
    verifiedNote: 'Generated every Monday',
  },
  monthly: {
    label: 'Monthly Civic Intelligence Report',
    badgeLabel: 'Monthly',
    gradient: 'from-accent-500/12 to-accent-600/[0.03]',
    iconBg: 'from-accent-500/20 to-accent-600/5',
    iconColor: 'text-accent-300',
    icon: FileText,
    badgeVariant: 'warning',
    verifiedNote: 'Generated on 1st of month',
  },
};

const fallbackConfig: TypeConfig = {
  label: 'Intelligence Report',
  badgeLabel: 'Report',
  gradient: 'from-primary-500/12 to-primary-600/[0.03]',
  iconBg: 'from-primary-500/20 to-primary-600/5',
  iconColor: 'text-primary-300',
  icon: FileText,
  badgeVariant: 'info',
  verifiedNote: 'Generated automatically',
};

function getConfig(type: string): TypeConfig {
  return typeConfig[type as ReportType] ?? fallbackConfig;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function MetricTile({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="rounded-xl glass p-2.5">
      <p className="text-2xs text-ink-500 uppercase tracking-ultrawide">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-white">{String(value)}</p>
    </div>
  );
}

function ReportCard({ report, index }: { report: Report; index: number }) {
  const config = getConfig(report.type);
  const Icon = config.icon;
  const content = report.content ?? {};
  const metrics = Object.entries(content).slice(0, 6);

  return (
    <GlassCard
      className={`overflow-hidden p-6 bg-gradient-to-br ${config.gradient}`}
      tilt
      glow
      delay={0.1 + index * 0.08}
    >
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-2xl bg-gradient-to-br ${config.iconBg} p-2.5`}>
            <Icon className={`h-5 w-5 ${config.iconColor}`} strokeWidth={1.8} />
          </div>
          <div>
            <Badge variant={config.badgeVariant} size="sm">
              {config.badgeLabel}
            </Badge>
            <p className="mt-1 text-2xs text-ink-500">
              {formatDate(report.created_at)} · {formatTime(report.created_at)}
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-1.5 rounded-xl glass px-3 py-1.5 text-xs text-ink-300 transition-all hover:bg-white/10 hover:text-white"
          aria-label="Export report"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={1.8} />
          Export
        </button>
      </div>

      {/* Title */}
      <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-white text-balance">
        {report.title}
      </h3>

      {/* AI Summary box */}
      <div className="mt-3 rounded-2xl border border-primary-500/15 bg-gradient-to-br from-primary-500/[0.08] to-secondary-500/[0.04] p-4">
        <div className="mb-2 flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-secondary-400" strokeWidth={1.8} />
          <span className="text-2xs font-semibold uppercase tracking-ultrawide text-secondary-300">
            AI Summary
          </span>
        </div>
        <p className="text-sm leading-relaxed text-ink-200 text-pretty">
          {report.summary ?? 'No summary available for this report.'}
        </p>
      </div>

      {/* Content metrics grid */}
      {metrics.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {metrics.map(([key, value]) => (
            <MetricTile key={key} label={formatLabel(key)} value={value} />
          ))}
        </div>
      )}

      {/* Footer — AI verification status */}
      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-2">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-1.5 rounded-full bg-success-500/10 border border-success-500/20 px-2 py-0.5"
          >
            <CheckCircle2 className="h-3 w-3 text-success-400" strokeWidth={2} />
            <span className="text-2xs font-medium text-success-300">AI Verified</span>
          </motion.span>
          <span className="hidden items-center gap-1 text-2xs text-ink-500 sm:flex">
            <Clock className="h-3 w-3" strokeWidth={1.8} />
            {config.verifiedNote}
          </span>
        </div>
        <button className="flex items-center gap-1 text-xs text-primary-400 transition-colors hover:text-primary-300">
          Read Full Report
          <ArrowRight className="h-3 w-3" strokeWidth={1.8} />
        </button>
      </div>
    </GlassCard>
  );
}

function GenerateReportCard() {
  return (
    <GlassCard className="p-6" glow delay={0.35}>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-secondary-500/20 to-primary-500/10 p-2.5">
            <Sparkles className="h-5 w-5 text-secondary-300" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold tracking-tight text-white">
              Generate New Report
            </h3>
            <p className="text-xs text-ink-400 text-pretty">
              AI will analyze current data and generate a fresh intelligence report
            </p>
          </div>
        </div>
        <button className="btn-primary text-sm">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Generate Report
        </button>
      </div>
    </GlassCard>
  );
}

// ─── Reports skeleton (page-specific) ────────────────────────────────────────

function ReportsSkeleton() {
  return (
    <div className="p-6">
      <PageHeader
        title="AI Intelligence Reports"
        subtitle="Auto-generated executive briefs and civic intelligence summaries"
        icon={<FileText className="h-5 w-5" strokeWidth={1.8} />}
      />
      {/* Banner skeleton */}
      <SkeletonCard className="mb-6" />
      {/* Report cards skeleton */}
      <div className="grid gap-5 lg:grid-cols-2">
        {[0, 1, 2].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      {/* Generate card skeleton */}
      <SkeletonCard className="mt-6" />
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export function ReportsPage() {
  const { reports, loading } = useSupabaseData();

  if (loading) {
    return <ReportsSkeleton />;
  }

  const dailyCount = reports.filter((r) => r.type === 'daily').length;
  const weeklyCount = reports.filter((r) => r.type === 'weekly').length;
  const monthlyCount = reports.filter((r) => r.type === 'monthly').length;

  return (
    <div className="p-6">
      <PageHeader
        title="AI Intelligence Reports"
        subtitle="Auto-generated executive briefs and civic intelligence summaries"
        icon={<FileText className="h-5 w-5" strokeWidth={1.8} />}
      />

      {/* ─── AI Banner Card ─────────────────────────────────────────────── */}
      <GlassCard className="mb-6 overflow-hidden p-6" glow delay={0.05}>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 shadow-glow-amber">
              <Sparkles className="h-6 w-6 text-white" strokeWidth={1.8} />
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(245,158,11,0.35)',
                    '0 0 0 12px rgba(245,158,11,0)',
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
              />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-white">
                AI-Generated Reports
              </h2>
              <p className="mt-0.5 max-w-xl text-sm text-ink-400 text-pretty">
                CivicIQ AI automatically generates daily, weekly, and monthly
                intelligence reports from complaint data, root cause analysis, and
                ward-level civic metrics.
              </p>
            </div>
          </div>

          {/* Report counts */}
          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className="font-display text-2xl font-bold tracking-tight text-white">
                {dailyCount}
              </p>
              <p className="text-2xs uppercase tracking-ultrawide text-ink-500">
                Daily
              </p>
            </div>
            <div className="h-8 w-px bg-white/[0.08]" />
            <div className="text-center">
              <p className="font-display text-2xl font-bold tracking-tight text-white">
                {weeklyCount}
              </p>
              <p className="text-2xs uppercase tracking-ultrawide text-ink-500">
                Weekly
              </p>
            </div>
            <div className="h-8 w-px bg-white/[0.08]" />
            <div className="text-center">
              <p className="font-display text-2xl font-bold tracking-tight text-white">
                {monthlyCount}
              </p>
              <p className="text-2xs uppercase tracking-ultrawide text-ink-500">
                Monthly
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ─── Reports Grid ──────────────────────────────────────────────── */}
      {reports.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {reports.map((report, i) => (
            <ReportCard key={report.id} report={report} index={i} />
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 text-center" delay={0.1}>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl glass">
            <FileText className="h-6 w-6 text-ink-400" strokeWidth={1.8} />
          </div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-white">
            No reports yet
          </h3>
          <p className="mt-1 text-sm text-ink-400 text-pretty">
            Generate your first AI intelligence report to get started.
          </p>
        </GlassCard>
      )}

      {/* ─── Generate New Report ──────────────────────────────────────── */}
      <div className="mt-6">
        <GenerateReportCard />
      </div>

      {/* ─── Footer note ──────────────────────────────────────────────── */}
      <div className="mt-6 flex items-center justify-center gap-2 text-2xs text-ink-600">
        <ShieldCheck className="h-3 w-3" strokeWidth={1.8} />
        All reports are AI-verified and cross-checked against live civic data sources
      </div>
    </div>
  );
}
