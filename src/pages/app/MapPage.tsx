import { Map, MapPin, AlertTriangle, Activity } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { PriorityBadge } from '../../components/ui/Badge';
import { useSupabaseData } from '../../hooks/useSupabaseData';

// Fix default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const severityColors: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#3b82f6',
};

export function MapPage() {
  const { wards, complaints, rootCauses, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader title="Infrastructure Map" subtitle="Loading..." icon={<Map className="h-5 w-5" />} />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  const centerLat = wards.length > 0 ? wards.reduce((s, w) => s + w.lat, 0) / wards.length : 19.076;
  const centerLng = wards.length > 0 ? wards.reduce((s, w) => s + w.lng, 0) / wards.length : 72.8777;

  return (
    <div className="p-6">
      <PageHeader
        title="Infrastructure Intelligence Map"
        subtitle="Geospatial view of complaints, root causes, and ward health"
        icon={<Map className="h-5 w-5" />}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Map */}
        <div className="lg:col-span-3">
          <GlassCard className="overflow-hidden p-0">
            <div className="h-[600px] w-full">
              <MapContainer center={[centerLat, centerLng]} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Ward markers */}
                {wards.map((ward) => (
                  <CircleMarker
                    key={ward.id}
                    center={[ward.lat, ward.lng]}
                    radius={20}
                    pathOptions={{
                      color: ward.health_score >= 80 ? '#22c55e' : ward.health_score >= 65 ? '#f59e0b' : '#ef4444',
                      fillColor: ward.health_score >= 80 ? '#22c55e' : ward.health_score >= 65 ? '#f59e0b' : '#ef4444',
                      fillOpacity: 0.15,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <p className="font-semibold">{ward.name}</p>
                        <p>Health Score: {ward.health_score}</p>
                        <p>Population: {ward.population.toLocaleString('en-IN')}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}

                {/* Complaint markers */}
                {complaints.filter((c) => c.lat && c.lng).map((c) => (
                  <CircleMarker
                    key={c.id}
                    center={[c.lat!, c.lng!]}
                    radius={8}
                    pathOptions={{
                      color: severityColors[c.priority] || severityColors.low,
                      fillColor: severityColors[c.priority] || severityColors.low,
                      fillOpacity: 0.6,
                      weight: 1.5,
                    }}
                  >
                    <Popup>
                      <div className="p-2 max-w-[200px]">
                        <p className="font-semibold text-sm">{c.title}</p>
                        <p className="text-xs mt-1">{c.department}</p>
                        <p className="text-xs">Priority: {c.priority}</p>
                        <p className="text-xs mt-1">{c.description}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar legend */}
        <div className="space-y-4">
          {/* Legend */}
          <GlassCard className="p-4">
            <h3 className="text-sm font-medium text-white mb-3">Map Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-ink-300">
                <div className="h-3 w-3 rounded-full bg-success-500" /> Healthy Ward (80+)
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-300">
                <div className="h-3 w-3 rounded-full bg-warning-500" /> Moderate Ward (65-79)
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-300">
                <div className="h-3 w-3 rounded-full bg-error-500" /> Critical Ward (&lt;65)
              </div>
              <div className="my-2 h-px bg-white/5" />
              <div className="flex items-center gap-2 text-xs text-ink-300">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500" /> Critical Complaint
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-300">
                <div className="h-2.5 w-2.5 rounded-full bg-orange-500" /> High Priority
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-300">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Medium Priority
              </div>
            </div>
          </GlassCard>

          {/* Active root causes */}
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-error-400" />
              <h3 className="text-sm font-medium text-white">Active Root Causes</h3>
            </div>
            <div className="space-y-2">
              {rootCauses.map((rc) => (
                <div key={rc.id} className="rounded-xl glass p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-white truncate flex-1">{rc.title}</p>
                    <PriorityBadge priority={rc.severity} />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-ink-500">
                    <MapPin className="h-2.5 w-2.5" />
                    {rc.affected_wards?.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Stats */}
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-primary-400" />
              <h3 className="text-sm font-medium text-white">Map Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl glass p-2 text-center">
                <p className="font-display text-lg font-bold text-white">{wards.length}</p>
                <p className="text-[10px] text-ink-500">Wards</p>
              </div>
              <div className="rounded-xl glass p-2 text-center">
                <p className="font-display text-lg font-bold text-white">{complaints.length}</p>
                <p className="text-[10px] text-ink-500">Complaints</p>
              </div>
              <div className="rounded-xl glass p-2 text-center">
                <p className="font-display text-lg font-bold text-white">{rootCauses.length}</p>
                <p className="text-[10px] text-ink-500">Root Causes</p>
              </div>
              <div className="rounded-xl glass p-2 text-center">
                <p className="font-display text-lg font-bold text-white">{complaints.filter((c) => c.priority === 'critical').length}</p>
                <p className="text-[10px] text-ink-500">Critical</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
