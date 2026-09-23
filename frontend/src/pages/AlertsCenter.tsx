import { useEffect, useState, useCallback } from 'react';
import { Bell, AlertTriangle, CheckCircle, XCircle, Mail, MessageSquare, Filter, Check, Ban, Clock } from 'lucide-react';
import { Card, Badge, Button, StatCard, EmptyState } from '../components/ui';
import { PageHeader } from './Dashboard';
import { alertsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { ATTACK_TYPES } from '../lib/mockData';
import { timeAgo } from '../lib/mockData';
import type { Alert, Severity, AlertStatus } from '../types';

const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'medium', 'low'];

const SAMPLE_ALERTS: Omit<Alert, 'id' | 'user_id' | 'created_at'>[] = [
  { title: 'DDoS Attack Detected', severity: 'critical', alert_type: 'DDoS', source_ip: '45.227.255.206', destination_ip: '192.168.1.10', status: 'open', confidence: 97, description: 'Volumetric SYN flood attack detected from 45.227.255.206 targeting web infrastructure', recommendation: 'Activate DDoS protection, block source IP, enable rate limiting' },
  { title: 'SQL Injection Attempt', severity: 'high', alert_type: 'SQL Injection', source_ip: '185.220.101.45', destination_ip: '10.0.0.5', status: 'open', confidence: 92, description: 'Malicious SQL payload detected in HTTP request parameter', recommendation: 'Block source IP, review input validation, enable WAF rules' },
  { title: 'Brute Force SSH Login', severity: 'high', alert_type: 'Brute Force', source_ip: '203.0.113.50', destination_ip: '192.168.1.20', status: 'acknowledged', confidence: 88, description: '342 failed SSH authentication attempts in 5 minutes', recommendation: 'Block source IP, enable fail2ban, review SSH configuration' },
  { title: 'Port Scan Activity', severity: 'medium', alert_type: 'Port Scan', source_ip: '198.51.100.23', destination_ip: '10.0.0.15', status: 'open', confidence: 76, description: 'Sequential port scanning detected across range 1-1024', recommendation: 'Monitor source IP, review firewall rules, enable IDS alerts' },
  { title: 'Malware C2 Beaconing', severity: 'critical', alert_type: 'Malware C2', source_ip: '192.168.1.10', destination_ip: '91.214.124.18', status: 'open', confidence: 95, description: 'Internal host communicating with known C2 server', recommendation: 'Isolate host immediately, block C2 IP, run malware scan' },
  { title: 'Suspicious DNS Query', severity: 'low', alert_type: 'DNS Attack', source_ip: '172.16.0.8', destination_ip: '8.8.8.8', status: 'resolved', confidence: 62, description: 'Unusual DNS query pattern with high TXT record frequency', recommendation: 'Monitor DNS traffic, review query logs for exfiltration' },
];

export function AlertsCenter() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Severity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');

  const loadAlerts = useCallback(async () => {
    if (!user) return;
    try {
      const data = await alertsApi.list(100);
      if (data.length > 0) {
        setAlerts(data);
      } else {
        // Seed sample alerts for new users
        const inserts = SAMPLE_ALERTS.map((a) => ({ ...a }));
        const seeded = await alertsApi.create(inserts);
        setAlerts(seeded);
      }
    } catch {
      // Backend unreachable — fall back to local sample data
      setAlerts(
        SAMPLE_ALERTS.map((a, i) => ({
          ...a,
          id: `local-${i}`,
          user_id: user.id,
          created_at: new Date().toISOString(),
        })),
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const updateAlertStatus = async (id: string, status: AlertStatus) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    try {
      await alertsApi.updateStatus(id, status);
    } catch {
      // local-only update when backend is unreachable
    }
  };

  const filtered = alerts.filter((a) => {
    if (filter !== 'all' && a.severity !== filter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    critical: alerts.filter((a) => a.severity === 'critical').length,
    high: alerts.filter((a) => a.severity === 'high').length,
    medium: alerts.filter((a) => a.severity === 'medium').length,
    low: alerts.filter((a) => a.severity === 'low').length,
    open: alerts.filter((a) => a.status === 'open').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Alerts Center" subtitle="Security alerts and notification management" icon={Bell} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Critical Alerts" value={stats.critical} icon={<AlertTriangle className="w-5 h-5" />} color="#ef4444" />
        <StatCard label="High Alerts" value={stats.high} icon={<AlertTriangle className="w-5 h-5" />} color="#f97316" />
        <StatCard label="Medium Alerts" value={stats.medium} icon={<AlertTriangle className="w-5 h-5" />} color="#eab308" />
        <StatCard label="Open Alerts" value={stats.open} icon={<Clock className="w-5 h-5" />} color="#a3e635" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-p">Email Alerts</h3>
          </div>
          <p className="text-sm text-s mb-3">Instant email notifications for critical threats</p>
          <Badge variant="safe" dot>Enabled</Badge>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-p">SMS Alerts</h3>
          </div>
          <p className="text-sm text-s mb-3">SMS notifications for critical severity threats</p>
          <Badge variant="medium" dot>Disabled</Badge>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-p">Notification History</h3>
          </div>
          <p className="text-sm text-s mb-3">Last 30 days of alert notifications sent</p>
          <div className="text-lg font-mono text-p">{alerts.length} notifications</div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          <div className="flex gap-2 flex-wrap">
            {(['all', ...SEVERITY_ORDER] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === s ? 'text-accent' : 'text-s hover:text-p bg-tertiary'}`}
                style={filter === s ? { background: 'var(--accent-glow)' } : undefined}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2 lg:ml-auto">
            {(['all', 'open', 'acknowledged', 'resolved', 'blocked'] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${statusFilter === s ? 'text-accent' : 'text-s hover:text-p bg-tertiary'}`}
                style={statusFilter === s ? { background: 'var(--accent-glow)' } : undefined}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((alert) => (
            <div key={alert.id} className="p-4 rounded-xl bg-tertiary border border-c hover:border-lc transition-all fade-in">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                    background: alert.severity === 'critical' ? 'rgba(220,38,38,0.15)' : alert.severity === 'high' ? 'rgba(249,115,22,0.15)' : alert.severity === 'medium' ? 'rgba(234,179,8,0.15)' : 'rgba(34,197,94,0.15)',
                    color: alert.severity === 'critical' ? '#ef4444' : alert.severity === 'high' ? '#f97316' : alert.severity === 'medium' ? '#eab308' : '#22c55e',
                  }}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-semibold text-p">{alert.title}</h4>
                      <Badge variant={alert.severity} dot>{alert.severity}</Badge>
                      <Badge variant="info">{alert.status}</Badge>
                    </div>
                    <p className="text-sm text-s mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-m flex-wrap">
                      {alert.source_ip && <span className="font-mono">Source: {alert.source_ip}</span>}
                      {alert.destination_ip && <span className="font-mono">Dest: {alert.destination_ip}</span>}
                      <span>AI Confidence: <span className="text-s font-mono">{alert.confidence}%</span></span>
                      <span>{timeAgo(alert.created_at)}</span>
                    </div>
                    {alert.recommendation && (
                      <div className="mt-2 p-2.5 rounded-lg bg-tertiary/50 border border-c">
                        <span className="text-xs text-m">Recommendation: </span>
                        <span className="text-xs text-s">{alert.recommendation}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {alert.status === 'open' && (
                    <>
                      <Button size="sm" variant="secondary" onClick={() => updateAlertStatus(alert.id, 'acknowledged')}>
                        <Check className="w-3.5 h-3.5" /> Ack
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => updateAlertStatus(alert.id, 'blocked')}>
                        <Ban className="w-3.5 h-3.5" /> Block
                      </Button>
                    </>
                  )}
                  {alert.status === 'acknowledged' && (
                    <Button size="sm" variant="success" onClick={() => updateAlertStatus(alert.id, 'resolved')}>
                      <CheckCircle className="w-3.5 h-3.5" /> Resolve
                    </Button>
                  )}
                  {alert.status === 'open' && (
                    <Button size="sm" variant="ghost" onClick={() => updateAlertStatus(alert.id, 'resolved')}>
                      <XCircle className="w-3.5 h-3.5" /> Dismiss
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <EmptyState icon={<Bell className="w-8 h-8" />} title="No Alerts Found" subtitle="No alerts match your current filters. Adjust filters or wait for new alerts." />
          )}
          {loading && (
            <div className="text-center py-12 text-m">Loading alerts...</div>
          )}
        </div>
      </Card>
    </div>
  );
}
