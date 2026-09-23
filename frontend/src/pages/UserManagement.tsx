import { useState } from 'react';
import { Users, Shield, Crown, UserCog, Eye, User, Search, Activity, Check, X } from 'lucide-react';
import { Card, Badge, Button, StatCard } from '../components/ui';
import { PageHeader } from './Dashboard';

type Role = 'admin' | 'analyst' | 'operator' | 'guest';

interface UserEntry {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  avatar: string;
}

const SAMPLE_USERS: UserEntry[] = [
  { id: '1', name: 'Alex Morgan', email: 'alex.morgan@netlens.ai', role: 'admin', status: 'active', lastActive: '2 min ago', avatar: 'A' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.chen@netlens.ai', role: 'analyst', status: 'active', lastActive: '5 min ago', avatar: 'S' },
  { id: '3', name: 'John Patel', email: 'john.patel@netlens.ai', role: 'operator', status: 'active', lastActive: '1 hour ago', avatar: 'J' },
  { id: '4', name: 'Maria Garcia', email: 'maria.garcia@netlens.ai', role: 'analyst', status: 'active', lastActive: '15 min ago', avatar: 'M' },
  { id: '5', name: 'David Kim', email: 'david.kim@netlens.ai', role: 'operator', status: 'inactive', lastActive: '3 days ago', avatar: 'D' },
  { id: '6', name: 'Lisa Wang', email: 'lisa.wang@netlens.ai', role: 'guest', status: 'suspended', lastActive: '1 week ago', avatar: 'L' },
  { id: '7', name: 'Tom Anderson', email: 'tom.anderson@netlens.ai', role: 'analyst', status: 'active', lastActive: '30 min ago', avatar: 'T' },
  { id: '8', name: 'Emma Wilson', email: 'emma.wilson@netlens.ai', role: 'operator', status: 'active', lastActive: 'Just now', avatar: 'E' },
];

const ROLE_META: Record<Role, { icon: any; color: string; label: string }> = {
  admin: { icon: Crown, color: '#f97316', label: 'Administrator' },
  analyst: { icon: UserCog, color: '#a3e635', label: 'Security Analyst' },
  operator: { icon: Shield, color: '#34d399', label: 'Operator' },
  guest: { icon: Eye, color: '#8b95b0', label: 'Guest (Read Only)' },
};

const PERMISSIONS = [
  { key: 'view_dashboard', label: 'View Dashboard' },
  { key: 'view_alerts', label: 'View Alerts' },
  { key: 'manage_alerts', label: 'Manage Alerts' },
  { key: 'view_logs', label: 'View Logs' },
  { key: 'view_reports', label: 'View Reports' },
  { key: 'generate_reports', label: 'Generate Reports' },
  { key: 'view_devices', label: 'View Devices' },
  { key: 'manage_devices', label: 'Manage Devices' },
  { key: 'view_users', label: 'View Users' },
  { key: 'manage_users', label: 'Manage Users' },
  { key: 'view_settings', label: 'View Settings' },
  { key: 'manage_settings', label: 'Manage Settings' },
  { key: 'ai_chat', label: 'AI Chat Assistant' },
  { key: 'admin_panel', label: 'Admin Panel Access' },
];

const PERMISSION_MATRIX: Record<Role, Record<string, boolean>> = {
  admin: Object.fromEntries(PERMISSIONS.map((p) => [p.key, true])),
  analyst: Object.fromEntries(PERMISSIONS.map((p) => [p.key, ['view_dashboard', 'view_alerts', 'manage_alerts', 'view_logs', 'view_reports', 'generate_reports', 'view_devices', 'ai_chat'].includes(p.key)])),
  operator: Object.fromEntries(PERMISSIONS.map((p) => [p.key, ['view_dashboard', 'view_alerts', 'view_logs', 'view_devices', 'ai_chat'].includes(p.key)])),
  guest: Object.fromEntries(PERMISSIONS.map((p) => [p.key, ['view_dashboard', 'view_alerts'].includes(p.key)])),
};

const ACTIVITY_HISTORY = [
  { user: 'Alex Morgan', action: 'Blocked malicious IP 45.227.255.206', time: '2 min ago', type: 'block' },
  { user: 'Sarah Chen', action: 'Generated weekly security report', time: '15 min ago', type: 'report' },
  { user: 'John Patel', action: 'Acknowledged alert: SQL Injection', time: '1 hour ago', type: 'alert' },
  { user: 'Maria Garcia', action: 'Updated firewall rules', time: '3 hours ago', type: 'config' },
  { user: 'Tom Anderson', action: 'Resolved alert: Port Scan', time: '5 hours ago', type: 'alert' },
  { user: 'Emma Wilson', action: 'Exported packet capture (PCAP)', time: '6 hours ago', type: 'export' },
];

export function UserManagement() {
  const [users] = useState<UserEntry[]>(SAMPLE_USERS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Role | 'all'>('all');
  const [tab, setTab] = useState<'users' | 'permissions' | 'activity'>('users');

  const filtered = users.filter((u) => {
    if (filter !== 'all' && u.role !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    admins: users.filter((u) => u.role === 'admin').length,
    analysts: users.filter((u) => u.role === 'analyst').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="User Management" subtitle="Role-based access control and user management" icon={Users} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.total} icon={<Users className="w-5 h-5" />} color="#a3e635" />
        <StatCard label="Active" value={stats.active} icon={<Activity className="w-5 h-5" />} color="#22c55e" />
        <StatCard label="Admins" value={stats.admins} icon={<Crown className="w-5 h-5" />} color="#f97316" />
        <StatCard label="Analysts" value={stats.analysts} icon={<UserCog className="w-5 h-5" />} color="#34d399" />
      </div>

      <div className="flex gap-2 mb-4">
        {(['users', 'permissions', 'activity'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'text-accent' : 'text-s hover:text-p bg-tertiary'}`}
            style={tab === t ? { background: 'var(--accent-glow)' } : undefined}>{t === 'permissions' ? 'Permission Matrix' : t === 'activity' ? 'Activity History' : 'Users'}</button>
        ))}
      </div>

      {tab === 'users' && (
        <Card>
          <div className="flex flex-col lg:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-m" />
              <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
            </div>
            <div className="flex gap-2">
              {(['all', 'admin', 'analyst', 'operator', 'guest'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'text-accent' : 'text-s hover:text-p bg-tertiary'}`}
                  style={filter === f ? { background: 'var(--accent-glow)' } : undefined}>{f}</button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {filtered.map((u) => {
              const meta = ROLE_META[u.role];
              return (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-tertiary hover:bg-hover-c transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white font-semibold">{u.avatar}</div>
                    <div>
                      <div className="text-sm font-medium text-p">{u.name}</div>
                      <div className="text-xs text-m">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <meta.icon className="w-4 h-4" style={{ color: meta.color }} />
                      <span className="text-sm text-s hidden md:inline">{meta.label}</span>
                    </div>
                    <Badge variant={u.status === 'active' ? 'safe' : u.status === 'inactive' ? 'medium' : 'critical'} dot>{u.status}</Badge>
                    <span className="text-xs text-m hidden lg:inline">{u.lastActive}</span>
                    <Button variant="ghost" size="sm"><UserCog className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {tab === 'permissions' && (
        <Card>
          <h3 className="font-semibold text-p mb-4">Permission Matrix (RBAC)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-m border-b border-c">
                  <th className="py-3 px-3 font-medium">Permission</th>
                  {(['admin', 'analyst', 'operator', 'guest'] as Role[]).map((r) => {
                    const meta = ROLE_META[r];
                    return <th key={r} className="py-3 px-3 font-medium text-center"><div className="flex items-center justify-center gap-1.5"><meta.icon className="w-3.5 h-3.5" style={{ color: meta.color }} /><span className="capitalize">{r}</span></div></th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map((p) => (
                  <tr key={p.key} className="border-b border-c hover:bg-hover-c transition-colors">
                    <td className="py-2.5 px-3 text-p">{p.label}</td>
                    {(['admin', 'analyst', 'operator', 'guest'] as Role[]).map((r) => (
                      <td key={r} className="py-2.5 px-3 text-center">
                        {PERMISSION_MATRIX[r][p.key] ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-m mx-auto" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'activity' && (
        <Card>
          <h3 className="font-semibold text-p mb-4">User Activity History</h3>
          <div className="space-y-2">
            {ACTIVITY_HISTORY.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-tertiary">
                <div className="w-8 h-8 rounded-lg bg-lime-500/15 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-p"><span className="font-medium">{a.user}</span> {a.action}</div>
                  <div className="text-xs text-m">{a.time}</div>
                </div>
                <Badge variant="info" size="sm">{a.type}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
