import { useEffect, useState, useCallback } from 'react';
import { ScrollText, Search, LogIn, Activity, Shield, Package, AlertCircle, Server } from 'lucide-react';
import { Card, Badge, StatCard, EmptyState } from '../components/ui';
import { PageHeader } from './Dashboard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../lib/utils';
import type { LogEntry, LogType } from '../types';

const LOG_TYPE_META: Record<LogType, { icon: any; color: string; label: string }> = {
  login: { icon: LogIn, color: '#00d9ff', label: 'Login' },
  activity: { icon: Activity, color: '#a855f7', label: 'Activity' },
  attack: { icon: Shield, color: '#ef4444', label: 'Attack' },
  packet: { icon: Package, color: '#22c55e', label: 'Packet' },
  error: { icon: AlertCircle, color: '#f97316', label: 'Error' },
  system: { icon: Server, color: '#8b95b0', label: 'System' },
};

const SAMPLE_LOGS: Omit<LogEntry, 'id' | 'user_id' | 'created_at'>[] = [
  { log_type: 'login', level: 'info', message: 'User signed in successfully', source: 'auth-service', ip_address: '192.168.1.10', metadata: { method: 'password' } },
  { log_type: 'attack', level: 'critical', message: 'DDoS attack detected from 45.227.255.206', source: 'ai-engine', ip_address: '45.227.255.206', metadata: { confidence: 97, type: 'DDoS' } },
  { log_type: 'packet', level: 'info', message: 'Packet captured: TCP 192.168.1.10 -> 10.0.0.5:443', source: 'packet-capture', ip_address: '192.168.1.10', metadata: { protocol: 'TCP', size: 1024 } },
  { log_type: 'activity', level: 'warning', message: 'Unusual data transfer detected from internal host', source: 'behavioral-analytics', ip_address: '192.168.1.20', metadata: { volume: '2.3GB' } },
  { log_type: 'error', level: 'error', message: 'Failed to connect to threat intel API', source: 'threat-intel-service', ip_address: null, metadata: { code: 'TIMEOUT' } },
  { log_type: 'system', level: 'info', message: 'AI model retrained successfully', source: 'ml-pipeline', ip_address: null, metadata: { accuracy: '99.7%' } },
  { log_type: 'attack', level: 'warning', message: 'SQL injection attempt blocked', source: 'waf', ip_address: '185.220.101.45', metadata: { confidence: 92 } },
  { log_type: 'login', level: 'warning', message: 'Failed login attempt (3rd)', source: 'auth-service', ip_address: '203.0.113.50', metadata: { attempts: 3 } },
];

export function Logs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LogType | 'all'>('all');
  const [search, setSearch] = useState('');

  const loadLogs = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (!error && data && data.length > 0) {
      setLogs(data as LogEntry[]);
    } else if (!error) {
      const inserts = SAMPLE_LOGS.map((l) => ({ ...l, user_id: user.id }));
      const { data: seeded } = await supabase.from('logs').insert(inserts).select();
      if (seeded) setLogs(seeded as LogEntry[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const filtered = logs.filter((l) => {
    if (filter !== 'all' && l.log_type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return l.message.toLowerCase().includes(q) || (l.source?.toLowerCase().includes(q) ?? false);
    }
    return true;
  });

  const stats = {
    login: logs.filter((l) => l.log_type === 'login').length,
    attack: logs.filter((l) => l.log_type === 'attack').length,
    error: logs.filter((l) => l.log_type === 'error').length,
    system: logs.filter((l) => l.log_type === 'system').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Logs" subtitle="System and security audit logs" icon={ScrollText} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Login Logs" value={stats.login} icon={<LogIn className="w-5 h-5" />} color="#00d9ff" />
        <StatCard label="Attack Logs" value={stats.attack} icon={<Shield className="w-5 h-5" />} color="#ef4444" />
        <StatCard label="Error Logs" value={stats.error} icon={<AlertCircle className="w-5 h-5" />} color="#f97316" />
        <StatCard label="System Logs" value={stats.system} icon={<Server className="w-5 h-5" />} color="#8b95b0" />
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-m" />
            <input type="text" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'login', 'activity', 'attack', 'packet', 'error', 'system'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'text-accent' : 'text-s hover:text-p bg-tertiary'}`}
                style={filter === f ? { background: 'var(--accent-glow)' } : undefined}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filtered.map((log) => {
            const meta = LOG_TYPE_META[log.log_type];
            const Icon = meta.icon;
            return (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-tertiary hover:bg-hover-c transition-all fade-in">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${meta.color}15`, color: meta.color }}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant={log.level === 'critical' ? 'critical' : log.level === 'error' ? 'high' : log.level === 'warning' ? 'medium' : 'safe'} size="sm">{log.level}</Badge>
                    <span className="text-sm font-medium text-p">{meta.label}</span>                    {log.source && <span className="text-xs text-m font-mono">· {log.source}</span>}
                  </div>
                  <p className="text-sm text-s">{log.message}</p>
                  <div className="flex items-center gap-3 text-xs text-m mt-1">
                    <span>{formatDate(log.created_at, true)}</span>
                    {log.ip_address && <span className="font-mono">IP: {log.ip_address}</span>}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && !loading && (
            <EmptyState icon={<ScrollText className="w-8 h-8" />} title="No Logs Found" subtitle="No logs match your current filters." />
          )}
          {loading && <div className="text-center py-12 text-m">Loading logs...</div>}
        </div>
      </Card>
    </div>
  );
}
