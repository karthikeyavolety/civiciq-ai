import { motion } from 'framer-motion';
import {
  Map as MapIcon,
  AlertTriangle,
  Activity,
  MapPin,
  Users,
  Layers,
  CircleDot,
  Navigation,
  TrendingDown,
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { PriorityBadge } from '../../components/ui/Badge';
import { PageSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useSupabaseData } from '../../hooks/useSupabaseData';

// Fix default Leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const EASE = [0.22, 1, 0.36, 1] as const;

/* ────────────────────────────────────────────────────────────
 *  Color helpers
 * ──────────────────────────────────────────────────────────── */

/** Hex colors used for Leaflet path options (Leaflet can't read Tailwind tokens). */
const PRIORITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#3b82f6',
};

function wardColor(score: number): string {
  return score >= 80 ? '#22c55e' : score >= 65 ? '#f59e0b' : '#ef4444';
}

function wardTone(score: number): 'success' | 'warning' | 'error' {
  return score >= 80 ? 'success' : score >= 65 ? 'warning' : 'error';
}

/* ────────────────────────────────────────────────────────────
 *  Small reusable bits
 * ──────────────────────────────────────────────────────────── */

function SectionLabel({
  icon: Icon,
  children,
  accent = 'text-ink-300',
}: {
  icon: typeof MapIcon;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.06]">
        <Icon className={`h-4 w-4 ${accent}`} strokeWidth={1.8} />
      </div>
      <h3 className="font-display text-base font-semibold tracking-tight text-white">{children}</h3>
    </div>
  );
}

function LegendRow({
  swatch,
  ring,
  label,
  sublabel,
}: {
  swatch: string;
  ring?: boolean;
  label: string;
  sublabel?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`shrink-0 ${ring ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'} rounded-full`}
        style={{
          backgroundColor: ring ? `${swatch}26` : swatch,
          border: ring ? `1.5px solid ${swatch}` : 'none',
        }}
      />
      <span className="text-xs text-ink-300">{label}</span>
      {sublabel && <span className="ml-auto text-2xs text-ink-600">{sublabel}</span>}
    </div>
  );
}

function MapStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof MapIcon;
  label: string;
  value: number;
  tone: 'primary' | 'success' | 'error' | 'warning';
}) {
  const toneClass = {
    primary: 'text-primary-300',
    success: 'text-success-300',
    error: 'text-error-300',
    warning: 'text-warning-300',
  }[tone];
  return (
    <div className="rounded-2xl glass p-3 text-center">
      <Icon className={`mx-auto mb-1 h-3.5 w-3.5 ${toneClass}`} strokeWidth={1.8} />
      <p className="font-display text-lg font-bold tabular-nums text-white">{value}</p>
      <p className="text-2xs text-ink-500 mt-0.5">{label}</p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 *  Page
 * ──────────────────────────────────────────────────────────── */

export function MapPage() {
  const { wards, complaints, rootCauses, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Infrastructure Intelligence Map"
          subtitle="Geospatial view of complaints, root causes, and ward health"
          icon={<MapIcon className="h-5 w-5" strokeWidth={1.8} />}
        />
        <PageSkeleton />
      </div>
    );
  }

  if (wards.length === 0) {
    return (
      <div className="p-6">
        <PageHeader
          title="Infrastructure Intelligence Map"
          subtitle="Geospatial view of complaints, root causes, and ward health"
          icon={<MapIcon className="h-5 w-5" strokeWidth={1.8} />}
        />
        <GlassCard className="p-6" hover={false}>
          <EmptyState
            icon={<MapIcon className="h-7 w-7" strokeWidth={1.8} />}
            title="No ward data available"
            description="Once ward geospatial data is synced, the infrastructure intelligence map will render here."
          />
        </GlassCard>
      </div>
    );
  }

  const centerLat = wards.reduce((s, w) => s + w.lat, 0) / wards.length;
  const centerLng = wards.reduce((s, w) => s + w.lng, 0) / wards.length;

  const geoComplaints = complaints.filter((c) => c.lat != null && c.lng != null);
  const criticalCount = complaints.filter((c) => c.priority === 'critical').length;
  const activeRootCauses = rootCauses.filter((r) => r.status !== 'resolved');
  const criticalRootCauses = rootCauses.filter((r) => r.severity === 'critical');
  const avgHealth = wards.reduce((s, w) => s + w.health_score, 0) / wards.length;

  return (
    <div className="p-6">
      <PageHeader
        title="Infrastructure Intelligence Map"
        subtitle="Geospatial view of complaints, root causes, and ward health"
        icon={<MapIcon className="h-5 w-5" strokeWidth={1.8} />}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {/* ════════════════════════════════════════════════════════
            1 · Large interactive map
            ════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-3">
          <GlassCard className="overflow-hidden p-0" glow delay={0}>
            {/* Map header strip */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/15 to-secondary-500/8 border border-primary-500/15">
                  <Navigation className="h-4 w-4 text-primary-300" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-base font-semibold tracking-tight text-white truncate">
                    Live Infrastructure View
                  </h2>
                  <p className="text-2xs text-ink-500 mt-0.5">
                    {wards.length} wards · {geoComplaints.length} geo-located complaints
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-success-500/10 border border-success-500/20 px-2.5 py-1 text-2xs font-medium text-success-300">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-1.5 w-1.5 rounded-full bg-success-400"
                  />
                  Real-time
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 text-2xs font-medium text-ink-300">
                  <Layers className="h-3 w-3" strokeWidth={1.8} />
                  Dark
                </span>
              </div>
            </div>

            {/* Map surface */}
            <div className="relative h-[600px] w-full">
              <MapContainer
                center={[centerLat, centerLng]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom
                zoomControl={false}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Ward circles — colored by health score */}
                {wards.map((ward) => {
                  const color = wardColor(ward.health_score);
                  return (
                    <CircleMarker
                      key={ward.id}
                      center={[ward.lat, ward.lng]}
                      radius={22}
                      pathOptions={{
                        color,
                        fillColor: color,
                        fillOpacity: 0.12,
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <div className="min-w-[180px] space-y-1.5">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-display text-sm font-semibold text-white">{ward.name}</p>
                            <span className="font-display text-sm font-bold tabular-nums" style={{ color }}>
                              {ward.health_score}
                            </span>
                          </div>
                          <p className="text-2xs text-ink-400">
                            Ward {ward.number} · {ward.population.toLocaleString('en-IN')} residents
                          </p>
                          <div className="h-px bg-white/10" />
                          <p className="text-xs text-ink-300">
                            Health:{' '}
                            <span className="font-medium" style={{ color }}>
                              {wardTone(ward.health_score) === 'success'
                                ? 'Healthy'
                                : wardTone(ward.health_score) === 'warning'
                                ? 'Moderate'
                                : 'At Risk'}
                            </span>
                          </p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}

                {/* Complaint markers — colored by priority */}
                {geoComplaints.map((c) => {
                  const color = PRIORITY_COLORS[c.priority] ?? PRIORITY_COLORS.low;
                  return (
                    <CircleMarker
                      key={c.id}
                      center={[c.lat!, c.lng!]}
                      radius={7}
                      pathOptions={{
                        color,
                        fillColor: color,
                        fillOpacity: 0.7,
                        weight: 1.5,
                      }}
                    >
                      <Popup>
                        <div className="max-w-[220px] space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-display text-sm font-semibold text-white">{c.title}</p>
                          </div>
                          {c.department && <p className="text-2xs text-ink-400">{c.department}</p>}
                          {c.address && (
                            <p className="flex items-center gap-1 text-2xs text-ink-500">
                              <MapPin className="h-2.5 w-2.5" strokeWidth={1.8} />
                              {c.address}
                            </p>
                          )}
                          <div className="h-px bg-white/10" />
                          <p className="text-xs text-ink-300">{c.description}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <span
                              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-medium"
                              style={{
                                color,
                                borderColor: `${color}40`,
                                backgroundColor: `${color}1a`,
                              }}
                            >
                              {c.priority}
                            </span>
                            <span className="text-2xs text-ink-500 capitalize">{c.status}</span>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>

              {/* Floating avg-health chip */}
              <div className="pointer-events-none absolute bottom-4 left-4 z-[1000]">
                <div className="flex items-center gap-2 rounded-2xl glass-strong px-3 py-2">
                  <Activity className="h-3.5 w-3.5 text-primary-300" strokeWidth={1.8} />
                  <span className="text-2xs text-ink-400">Avg Health</span>
                  <span className="font-display text-sm font-bold tabular-nums text-white">
                    {avgHealth.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* ════════════════════════════════════════════════════════
            2 · Sidebar — legend, root causes, stats
            ════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          {/* Legend */}
          <GlassCard className="p-5" delay={0.05}>
            <div className="mb-4 flex items-center justify-between">
              <SectionLabel icon={Layers} accent="text-primary-300">Map Legend</SectionLabel>
            </div>
            <p className="text-2xs font-semibold uppercase tracking-ultrawide text-ink-600 mb-2.5">
              Ward Health
            </p>
            <div className="space-y-2.5">
              <LegendRow swatch="#22c55e" ring label="Healthy" sublabel="80+" />
              <LegendRow swatch="#f59e0b" ring label="Moderate" sublabel="65–79" />
              <LegendRow swatch="#ef4444" ring label="At Risk" sublabel="<65" />
            </div>
            <div className="my-3.5 h-px bg-white/[0.06]" />
            <p className="text-2xs font-semibold uppercase tracking-ultrawide text-ink-600 mb-2.5">
              Complaint Priority
            </p>
            <div className="space-y-2.5">
              <LegendRow swatch="#ef4444" label="Critical" />
              <LegendRow swatch="#f97316" label="High" />
              <LegendRow swatch="#f59e0b" label="Medium" />
              <LegendRow swatch="#3b82f6" label="Low" />
            </div>
          </GlassCard>

          {/* Active root causes */}
          <GlassCard className="p-5" delay={0.1}>
            <div className="mb-4 flex items-center justify-between">
              <SectionLabel icon={AlertTriangle} accent="text-error-300">
                Active Root Causes
              </SectionLabel>
              <span className="rounded-full bg-error-500/12 border border-error-500/20 px-2 py-0.5 text-2xs font-semibold text-error-300">
                {activeRootCauses.length}
              </span>
            </div>
            {activeRootCauses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CircleDot className="h-5 w-5 text-ink-600" strokeWidth={1.8} />
                <p className="mt-2 text-2xs text-ink-500">No active root causes</p>
              </div>
            ) : (
              <div className="max-h-[280px] space-y-2 overflow-y-auto no-scrollbar pr-1">
                {activeRootCauses.map((rc, i) => (
                  <motion.div
                    key={rc.id}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}
                    className="group rounded-2xl glass p-3 transition-colors hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-white truncate text-pretty pr-1">
                        {rc.title}
                      </p>
                      <PriorityBadge priority={rc.severity} size="sm" />
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-2xs text-ink-500">
                      <MapPin className="h-2.5 w-2.5 shrink-0" strokeWidth={1.8} />
                      <span className="truncate">
                        {rc.affected_wards?.length ? rc.affected_wards.join(', ') : '—'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Map stats */}
          <GlassCard className="p-5" delay={0.15}>
            <div className="mb-4 flex items-center justify-between">
              <SectionLabel icon={Activity} accent="text-secondary-300">Map Stats</SectionLabel>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <MapStat icon={MapIcon} label="Wards" value={wards.length} tone="primary" />
              <MapStat icon={Users} label="Complaints" value={complaints.length} tone="warning" />
              <MapStat icon={AlertTriangle} label="Critical" value={criticalCount} tone="error" />
              <MapStat icon={TrendingDown} label="Root Causes" value={criticalRootCauses.length} tone="error" />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
