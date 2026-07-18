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
import { useSupabaseData } from '../../hooks/useSupabaseData';

const categoryIcons: Record<string, typeof Droplets> = {
  roads: Car,
  water: Droplets,
  electricity: Zap,
  garbage: Trash2,
  traffic: Car,
  satisfaction: Users,
};

const categoryLabels: Record<string, string> = {
  roads_score: 'Roads',
  water_score: 'Water',
  electricity_score: 'Electricity',
  garbage_score: 'Garbage',
  traffic_score: 'Traffic',
  satisfaction_score: 'Satisfaction',
};

export function HealthPage() {
  const { wards, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader title="Civic Health Score" subtitle="Loading..." icon={<Shield className="h-5 w-5" />} />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-success-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  const avgHealth = wards.length > 0 ? wards.reduce((sum, w) => sum + w.health_score, 0) / wards.length : 0;
  const bestWard = wards.reduce((max, w) => (w.health_score > max.health_score ? w : max), wards[0]);
  const worstWard = wards.reduce((min, w) => (w.health_score < min.health_score ? w : min), wards[0]);

  const radarData = [
    { category: 'Roads', A: avgHealth },
    { category: 'Water', A: wards.reduce((s, w) => s + w.water_score, 0) / (wards.length || 1) },
    { category: 'Power', A: wards.reduce((s, w) => s + w.electricity_score, 0) / (wards.length || 1) },
    { category: 'Garbage', A: wards.reduce((s, w) => s + w.garbage_score, 0) / (wards.length || 1) },
    { category: 'Traffic', A: wards.reduce((s, w) => s + w.traffic_score, 0) / (wards.length || 1) },
    { category: 'Satisfaction', A: wards.reduce((s, w) => s + w.satisfaction_score, 0) / (wards.length || 1) },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="AI Civic Health Score"
        subtitle="Real-time infrastructure and satisfaction scores across all wards"
        icon={<Shield className="h-5 w-5" />}
      />

      {/* City overview */}
      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-6 flex flex-col items-center justify-center" glow>
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-4">City Civic Health</p>
          <CircularProgress value={avgHealth} label={avgHealth.toFixed(0)} sublabel="Overall Score" color="#22c55e" size={160} strokeWidth={12} />
          <Badge variant="success" className="mt-4">Healthy</Badge>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-success-400" />
            <h3 className="font-display text-lg font-semibold text-white">Best Performing</h3>
          </div>
          {bestWard && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-2xl font-bold text-success-400">{bestWard.health_score}</p>
                  <p className="text-sm text-white">{bestWard.name}</p>
                </div>
                <CircularProgress value={bestWard.health_score} label="" color="#22c55e" size={80} strokeWidth={6} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[{ k: 'roads_score', v: bestWard.roads_score }, { k: 'water_score', v: bestWard.water_score }, { k: 'electricity_score', v: bestWard.electricity_score }].map((s) => {
                  const Icon = categoryIcons[s.k.split('_')[0]] || Activity;
                  return (
                    <div key={s.k} className="rounded-xl glass p-2 text-center">
                      <Icon className="mx-auto h-3.5 w-3.5 text-success-400 mb-1" />
                      <p className="text-sm font-bold text-white">{s.v}</p>
                      <p className="text-[9px] text-ink-500">{categoryLabels[s.k]}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-error-400" />
            <h3 className="font-display text-lg font-semibold text-white">Needs Attention</h3>
          </div>
          {worstWard && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-2xl font-bold text-error-400">{worstWard.health_score}</p>
                  <p className="text-sm text-white">{worstWard.name}</p>
                </div>
                <CircularProgress value={worstWard.health_score} label="" color="#ef4444" size={80} strokeWidth={6} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[{ k: 'roads_score', v: worstWard.roads_score }, { k: 'water_score', v: worstWard.water_score }, { k: 'garbage_score', v: worstWard.garbage_score }].map((s) => {
                  const Icon = categoryIcons[s.k.split('_')[0]] || Activity;
                  return (
                    <div key={s.k} className="rounded-xl glass p-2 text-center">
                      <Icon className="mx-auto h-3.5 w-3.5 text-error-400 mb-1" />
                      <p className="text-sm font-bold text-white">{s.v}</p>
                      <p className="text-[9px] text-ink-500">{categoryLabels[s.k]}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Radar chart */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary-400" />
            <h3 className="font-display text-lg font-semibold text-white">City Infrastructure Radar</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
              <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0', fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-secondary-400" />
            <h3 className="font-display text-lg font-semibold text-white">Ward Comparison</h3>
          </div>
          <div className="space-y-2">
            {wards.map((ward, i) => (
              <motion.div key={ward.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-center gap-3 rounded-2xl glass p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/10">
                    <span className="font-display text-sm font-bold text-primary-300">W{ward.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{ward.name}</p>
                    <p className="text-[10px] text-ink-500">{ward.population.toLocaleString('en-IN')} residents</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24">
                      <div className="h-1.5 rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${ward.health_score}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full rounded-full ${ward.health_score >= 80 ? 'bg-gradient-to-r from-success-500 to-success-400' : ward.health_score >= 65 ? 'bg-gradient-to-r from-warning-500 to-warning-400' : 'bg-gradient-to-r from-error-500 to-error-400'}`}
                        />
                      </div>
                    </div>
                    <span className={`font-display text-lg font-bold ${ward.health_score >= 80 ? 'text-success-400' : ward.health_score >= 65 ? 'text-warning-400' : 'text-error-400'}`}>
                      {ward.health_score}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Ward detail cards */}
      <div className="mt-6">
        <h3 className="mb-4 font-display text-lg font-semibold text-white">Ward Health Breakdown</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {wards.map((ward, i) => (
            <motion.div key={ward.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">Ward {ward.number}</span>
                  <CircularProgress value={ward.health_score} label={ward.health_score.toFixed(0)} color={ward.health_score >= 80 ? '#22c55e' : ward.health_score >= 65 ? '#f59e0b' : '#ef4444'} size={56} strokeWidth={5} />
                </div>
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
                        <Icon className="h-3 w-3 text-ink-500" />
                        <span className="text-[10px] text-ink-400 w-16">{s.label}</span>
                        <div className="flex-1 h-1 rounded-full bg-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.value}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className={`h-full rounded-full ${s.value >= 80 ? 'bg-success-400' : s.value >= 65 ? 'bg-warning-400' : 'bg-error-400'}`}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-white w-6 text-right">{s.value}</span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
