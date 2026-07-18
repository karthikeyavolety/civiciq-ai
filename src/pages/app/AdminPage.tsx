import { motion } from 'framer-motion';
import {
  Settings,
  Users,
  Building2,
  Shield,
  Activity,
  Database,
  Server,
  HardDrive,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Droplets,
  Zap,
  Car,
  Trash2,
  UserCog,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
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

const systemServices = [
  { name: 'AI Root Cause Engine', status: 'operational', uptime: '99.98%', icon: Cpu },
  { name: 'NLP Classification Service', status: 'operational', uptime: '99.95%', icon: Activity },
  { name: 'Geospatial Analysis', status: 'operational', uptime: '99.99%', icon: Server },
  { name: 'Report Generator', status: 'operational', uptime: '99.92%', icon: HardDrive },
  { name: 'Notification Service', status: 'degraded', uptime: '98.87%', icon: AlertTriangle },
  { name: 'Database Cluster', status: 'operational', uptime: '99.99%', icon: Database },
];

const adminUsers = [
  { name: 'Ananya Kapoor', role: 'Chief Commissioner', dept: 'Administration', status: 'active' },
  { name: 'Rajesh Kumar', role: 'Water Works Head', dept: 'Water Works', status: 'active' },
  { name: 'Sunita Sharma', role: 'Roads Director', dept: 'Roads & Transport', status: 'active' },
  { name: 'Amit Patel', role: 'Electrical Engineer', dept: 'Electricity', status: 'active' },
  { name: 'Priya Singh', role: 'Sanitation Officer', dept: 'Sanitation', status: 'inactive' },
  { name: 'Vikram Reddy', role: 'Traffic Controller', dept: 'Traffic', status: 'active' },
];

export function AdminPage() {
  const { departments, complaints, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader title="Admin Panel" subtitle="Loading..." icon={<Settings className="h-5 w-5" />} />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Admin Panel"
        subtitle="Manage users, departments, system health, and permissions"
        icon={<Settings className="h-5 w-5" />}
      />

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider">Total Users</p>
              <p className="mt-1 font-display text-2xl font-bold text-white"><AnimatedNumber value={adminUsers.length} /></p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/5 p-2.5">
              <Users className="h-5 w-5 text-primary-300" />
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider">Departments</p>
              <p className="mt-1 font-display text-2xl font-bold text-white"><AnimatedNumber value={departments.length} /></p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-secondary-500/20 to-secondary-600/5 p-2.5">
              <Building2 className="h-5 w-5 text-secondary-300" />
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider">Total Complaints</p>
              <p className="mt-1 font-display text-2xl font-bold text-white"><AnimatedNumber value={complaints.length} /></p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-accent-500/20 to-accent-600/5 p-2.5">
              <AlertTriangle className="h-5 w-5 text-accent-300" />
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider">System Uptime</p>
              <p className="mt-1 font-display text-2xl font-bold text-success-400">99.97%</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-success-500/20 to-success-600/5 p-2.5">
              <CheckCircle2 className="h-5 w-5 text-success-300" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Two column layout */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* User management */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary-400" />
              <h3 className="font-display text-lg font-semibold text-white">User Management</h3>
            </div>
            <button className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-primary-500/20 to-secondary-500/10 border border-primary-500/30 px-3 py-1.5 text-xs text-primary-200 hover:from-primary-500/30 hover:to-secondary-500/20 transition-all">
              <Plus className="h-3.5 w-3.5" /> Add User
            </button>
          </div>
          <div className="space-y-2">
            {adminUsers.map((user, i) => (
              <motion.div key={user.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between rounded-2xl glass p-3 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-bold text-white">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-[10px] text-ink-500">{user.role} · {user.dept}</p>
                  </div>
                </div>
                <Badge variant={user.status === 'active' ? 'success' : 'default'}>{user.status}</Badge>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Departments */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-secondary-400" />
              <h3 className="font-display text-lg font-semibold text-white">Departments</h3>
            </div>
            <button className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-secondary-500/20 to-primary-500/10 border border-secondary-500/30 px-3 py-1.5 text-xs text-secondary-200 hover:from-secondary-500/30 hover:to-primary-500/20 transition-all">
              <Plus className="h-3.5 w-3.5" /> Add Department
            </button>
          </div>
          <div className="space-y-2">
            {departments.map((dept, i) => {
              const Icon = deptIcons[dept.name] || Building2;
              return (
                <motion.div key={dept.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between rounded-2xl glass p-3 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/10">
                      <Icon className="h-4 w-4 text-primary-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{dept.name}</p>
                      <p className="text-[10px] text-ink-500">{dept.head_officer} · {dept.active_complaints} active</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${dept.performance_score >= 80 ? 'text-success-400' : dept.performance_score >= 70 ? 'text-warning-400' : 'text-error-400'}`}>{dept.performance_score}</p>
                    <p className="text-[9px] text-ink-500">score</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* System health */}
      <div className="mt-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success-400" />
              <h3 className="font-display text-lg font-semibold text-white">System Health</h3>
            </div>
            <Badge variant="success" icon={<motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-success-400" />}>
              All Systems Operational
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {systemServices.map((service, i) => {
              const Icon = service.icon;
              const isOperational = service.status === 'operational';
              return (
                <motion.div key={service.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl glass p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${isOperational ? 'text-success-400' : 'text-warning-400'}`} />
                      <span className="text-xs font-medium text-white">{service.name}</span>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${isOperational ? 'bg-success-400' : 'bg-warning-400'}`}>
                      {isOperational && <motion.div animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }} transition={{ duration: 2, repeat: Infinity }} className="h-2 w-2 rounded-full bg-success-400" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={isOperational ? 'text-success-300' : 'text-warning-300'}>{isOperational ? 'Operational' : 'Degraded'}</span>
                    <span className="text-ink-500">Uptime: {service.uptime}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Permissions matrix */}
      <div className="mt-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-accent-400" />
            <h3 className="font-display text-lg font-semibold text-white">Role Permissions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">Role</th>
                  <th className="pb-3 text-center text-xs font-medium text-ink-500 uppercase tracking-wider">View</th>
                  <th className="pb-3 text-center text-xs font-medium text-ink-500 uppercase tracking-wider">Create</th>
                  <th className="pb-3 text-center text-xs font-medium text-ink-500 uppercase tracking-wider">Edit</th>
                  <th className="pb-3 text-center text-xs font-medium text-ink-500 uppercase tracking-wider">Delete</th>
                  <th className="pb-3 text-center text-xs font-medium text-ink-500 uppercase tracking-wider">Admin</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { role: 'Chief Commissioner', perms: [true, true, true, true, true] },
                  { role: 'Department Head', perms: [true, true, true, false, false] },
                  { role: 'Field Officer', perms: [true, true, false, false, false] },
                  { role: 'Citizen', perms: [true, true, false, false, false] },
                ].map((row) => (
                  <tr key={row.role} className="border-b border-white/5">
                    <td className="py-3 text-sm text-white">{row.role}</td>
                    {row.perms.map((perm, i) => (
                      <td key={i} className="py-3 text-center">
                        {perm ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-success-400" />
                        ) : (
                          <div className="mx-auto h-4 w-4 rounded-full bg-white/5" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
