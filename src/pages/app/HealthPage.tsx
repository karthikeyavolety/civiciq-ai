import { motion } from 'framer-motion';
import {
  Shield,
  Activity,
  Droplets,
  Car,
  Zap,
  Trash2,
  Users,
  TrendingUp,
  TrendingDown,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { Badge } from '../../components/ui/Badge';
import { PageSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useSupabaseData } from '../../hooks/useSupabaseData';

/* ────────────────────────────────────────────────────────────
 *  Static config
 * ──────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

/** Score → color helpers */
function scoreColor(v: number) {
  return v >= 80 ? '#22c55e' : v >= 65 ? '#f59e0b' : '#ef4444';
}
function scoreTextClass(v: number) {
  return v >= 80 ? 'text-success-400' : v >= 65 ? 'text-warning-400' : 'text-error-400';
}
function scoreBarClass(v: number) {
  return v >= 80
    ? 'bg-gradient-to-r from-success-500 to-success-400'
    : v >= 65
    ? 'bg-gradient-to-r from-warning-500 to-warning-400'
    : 'bg-gradient-to-r from-error-500 to-error-400';
}

/* ────────────────────────────────────────────────────────────
 *  Small reusable bits
 * ──────────────────────────────────────────────────────────── */

function SectionLabel({ icon: Icon, children }: { icon: typeof Shield; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.06]">
        <Icon className="h-4 w-4 text-ink-300" strokeWidth={1.8} />
      </div>
      <h3 className="font-display text-base font-semibold tracking-tight text-white">{children}</h3>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Shield;
  label: string;
  value: number;
  tone: 'success' | 'error';
}) {
  return (
    <div className="rounded-2xl glass p-2.5 text-center">
      <Icon
        className={`mx-auto h-3.5 w-3.5 mb-1 ${tone === 'success' ? 'text-success-400' : 'text-error-400'}`}
        strokeWidth={1.8}
      />
      <p className="font-display text-sm font-bold text-white">{value}</p>
      <p className="text-2xs text-ink-500 mt-0.5">{label}</p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 *  Page
 * ──────────────────────────────────────────────────────────── */

export function HealthPage() {
  const { wards, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="AI Civic Health Score"
          subtitle="Real-time infrastructure and satisfaction scores across all wards"
          icon={<Shield className="h-5 w-5" strokeWidth={1.8} />}
        />
        <PageSkeleton />
      </div>
    );
  }

  if (wards.length === 0) {
    return (
      <div className="p-6">
        <PageHeader
          title="AI Civic Health Score"
          subtitle="Real-time infrastructure and satisfaction scores across all wards"
          icon={<Shield className="h-5 w-5" strokeWidth={1.8} />}
        />
        <GlassCard className="p-6" hover={false}>
          <EmptyState
            icon={<Shield className="h-7 w-7" strokeWidth={1.8} />}
            title="No ward data available"
            description="Once ward infrastructure scores are synced, the city health overview will appear here."
          />
        </GlassCard>
      </div>
    );
  }

  const avgHealth = wards.reduce((sum, w) => sum + w.health_score, 0) / wards.length;
  const bestWard = wards.reduce((max, w) => (w.health_score > max.health_score ? w : max), wards[0]);
  const worstWard = wards.reduce((min, w) => (w.health_score < min.health_score ? w : min), wards[0]);
  const totalPopulation = wards.reduce((s, w) => s + w.population, 0);

  const avg = (key: 'roads_score' | 'water_score' | 'electricity_score' | 'garbage_score' | 'traffic_score' | 'satisfaction_score') =>
    wards.reduce((s, w) => s + (w[key] as number), 0) / wards.length;

  const radarData = [
    { category: 'Roads', A: avg('roads_score') },
    { category: 'Water', A: avg('water_score') },
    { category: 'Power', A: avg('electricity_score') },
    { category: 'Garbage', A: avg('garbage_score') },
    { category: 'Traffic', A: avg('traffic_score') },
    { category: 'Satisfaction', A: avg('satisfaction_score') },
  ];

  const healthVariant: 'success' | 'warning' | 'error' =
    avgHealth >= 80 ? 'success' : avgHealth >= 65 ? 'warning' : 'error';
  const healthLabel = avgHealth >= 80 ? 'Healthy' : avgHealth >= 65 ? 'Moderate' : 'At Risk';

  return (
    <div className="p-6">
      <PageHeader
        title="AI Civic Health Score"
        subtitle="Real-time infrastructure and satisfaction scores across all wards"
        icon={<Shield className="h-5 w-5" strokeWidth={1.8} />}
      />

      {/* ════════════════════════════════════════════════════════
          1 · City overview + best / worst wards
          ════════════════════════════════════════════════════════ */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* City overview */}
        <GlassCard className="relative overflow-hidden p-6 flex flex-col items-center justify-center" glow tilt delay={0}>
          {/* ambient gradient */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-success-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-primary-500/10 blur-3xl" />

          <p className="text-2xs font-medium text-ink-400 uppercase tracking-ultrawide mb-5">City Civic Health</p>
          <CircularProgress
            value={avgHealth}
            label={avgHealth.toFixed(0)}
            sublabel="Overall Score"
            color={scoreColor(avgHealth)}
            size={160}
            strokeWidth={12}
          />
          <Badge variant={healthVariant} className="mt-5" icon={<Activity className="h-3 w-3" strokeWidth={1.8} />}>
            {healthLabel}
          </Badge>
          <div className="mt-5 flex items-center gap-4 text-2xs text-ink-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" strokeWidth={1.8} />
              {wards.length} wards
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span>{totalPopulation.toLocaleString('en-IN')} residents</span>
          </div>
        </GlassCard>

        {/* Best performing ward */}
        <GlassCard className="p-6" tilt delay={0.05}>
          <div className="flex items-center justify-between mb-5">
            <SectionLabel icon={TrendingUp}>Best Performing</SectionLabel>
            <Badge variant="success" size="sm">Top Ward</Badge>
          </div>
          {bestWard && (
            <div>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-display text-3xl font-bold tracking-tight text-success-400">
                    {bestWard.health_score}
                  </p>
                  <p className="text-sm font-medium text-white truncate mt-0.5">{bestWard.name}</p>
                  <p className="text-2xs text-ink-500 mt-0.5">
                    Ward {bestWard.number} · {bestWard.population.toLocaleString('en-IN')} residents
                  </p>
                </div>
                <CircularProgress
                  value={bestWard.health_score}
                  label=""
                  color="#22c55e"
                  size={80}
                  strokeWidth={6}
                />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <MiniStat icon={Car} label="Roads" value={bestWard.roads_score} tone="success" />
                <MiniStat icon={Droplets} label="Water" value={bestWard.water_score} tone="success" />
                <MiniStat icon={Zap} label="Power" value={bestWard.electricity_score} tone="success" />
              </div>
            </div>
          )}
        </GlassCard>

        {/* Worst performing ward */}
        <GlassCard className="p-6" tilt delay={0.1}>
          <div className="flex items-center justify-between mb-5">
            <SectionLabel icon={TrendingDown}>Needs Attention</SectionLabel>
            <Badge variant="error" size="sm">Priority</Badge>
          </div>
          {worstWard && (
            <div>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-display text-3xl font-bold tracking-tight text-error-400">
                    {worstWard.health_score}
                  </p>
                  <p className="text-sm font-medium text-white truncate mt-0.5">{worstWard.name}</p>
                  <p className="text-2xs text-ink-500 mt-0.5">
                    Ward {worstWard.number} · {worstWard.population.toLocaleString('en-IN')} residents
                  </p>
                </div>
                <CircularProgress
                  value={worstWard.health_score}
                  label=""
                  color="#ef4444"
                  size={80}
                  strokeWidth={6}
                />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <MiniStat icon={Car} label="Roads" value={worstWard.roads_score} tone="error" />
                <MiniStat icon={Droplets} label="Water" value={worstWard.water_score} tone="error" />
                <MiniStat icon={Trash2} label="Garbage" value={worstWard.garbage_score} tone="error" />
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* ════════════════════════════════════════════════════════
          2 · Radar chart + ward comparison list
          ════════════════════════════════════════════════════════ */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Radar */}
        <GlassCard className="p-6" tilt delay={0.05}>
          <div className="flex items-center justify-between mb-5">
            <SectionLabel icon={Activity}>City Infrastructure Radar</SectionLabel>
            <Badge variant="info" size="sm">6 metrics</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke="rgba(255,255,255,0.04)" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#475569', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Radar
                name="Score"
                dataKey="A"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,23,42,0.92)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 12,
                  color: '#e2e8f0',
                  fontSize: 11,
                  boxShadow: '0 8px 24px -4px rgba(0,0,0,0.4)',
                  padding: '8px 12px',
                }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  return (
                    <div className="chart-tooltip">
                      <p className="chart-tooltip-label">{payload[0].payload.category}</p>
                      <p className="text-ink-300">Score: {Number(payload[0].value).toFixed(1)}</p>
                    </div>
                  );
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Ward comparison list */}
        <GlassCard className="p-6" tilt delay={0.1}>
          <div className="flex items-center justify-between mb-5">
            <SectionLabel icon={Shield}>Ward Comparison</SectionLabel>
            <span className="text-2xs text-ink-500 uppercase tracking-ultrawide">Health score</span>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
            {wards.map((ward, i) => (
              <motion.div
                key={ward.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
              >
                <div className="group flex items-center gap-3 rounded-2xl glass p-3 transition-colors hover:bg-white/[0.06]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/10 border border-white/[0.06]">
                    <span className="font-display text-sm font-bold text-primary-300">W{ward.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{ward.name}</p>
                    <p className="text-2xs text-ink-500">{ward.population.toLocaleString('en-IN')} residents</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24">
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${ward.health_score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.04 }}
                          className={`h-full rounded-full ${scoreBarClass(ward.health_score)}`}
                        />
                      </div>
                    </div>
                    <span className={`font-display text-lg font-bold tabular-nums w-7 text-right ${scoreTextClass(ward.health_score)}`}>
                      {ward.health_score}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-ink-600 group-hover:text-ink-400 transition-colors" strokeWidth={1.8} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ════════════════════════════════════════════════════════
          3 · Ward detail grid
          ════════════════════════════════════════════════════════ */}
      <div className="mt-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold tracking-tight text-white">Ward Health Breakdown</h3>
          <span className="text-2xs text-ink-500 uppercase tracking-ultrawide">{wards.length} wards</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {wards.map((ward, i) => (
            <GlassCard key={ward.id} className="p-5" tilt delay={i * 0.04}>
              {/* header */}
              <div className="flex items-start justify-between mb-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{ward.name}</p>
                  <p className="text-2xs text-ink-500 mt-0.5">
                    Ward {ward.number} · {ward.population.toLocaleString('en-IN')}
                  </p>
                </div>
                <CircularProgress
                  value={ward.health_score}
                  label={ward.health_score.toFixed(0)}
                  color={scoreColor(ward.health_score)}
                  size={56}
                  strokeWidth={5}
                />
              </div>

              {/* category breakdown */}
              <div className="space-y-2">
                {[
                  { label: 'Roads', value: ward.roads_score, icon: Car },
                  { label: 'Water', value: ward.water_score, icon: Droplets },
                  { label: 'Power', value: ward.electricity_score, icon: Zap },
                  { label: 'Garbage', value: ward.garbage_score, icon: Trash2 },
                  { label: 'Traffic', value: ward.traffic_score, icon: Car },
                  { label: 'Satisfaction', value: ward.satisfaction_score, icon: Users },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex items-center gap-2">
                      <Icon className="h-3 w-3 shrink-0 text-ink-500" strokeWidth={1.8} />
                      <span className="text-2xs text-ink-400 w-16 shrink-0">{s.label}</span>
                      <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: EASE, delay: 0.3 + i * 0.04 }}
                          className={`h-full rounded-full ${scoreBarClass(s.value)}`}
                        />
                      </div>
                      <span className="text-2xs font-medium text-white w-6 text-right tabular-nums">{s.value}</span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
