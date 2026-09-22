import { useState } from 'react';
import { ShieldCheck, Users, HardDrive, Bell, FileText, Settings, Activity, ScrollText, BarChart3, Crown, Server, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, Badge, StatCard, ProgressBar } from '../components/ui';
import { PageHeader } from './Dashboard';
import { LineChart, BarChart, DonutChart, Gauge } from '../components/Charts';
import { generateTimeSeriesData } from '../lib/mockData';

const AUDIT_LOGS = [
  { action: 'User role changed: Sarah Chen → Analyst', user: 'Alex Morgan', time: '2 min ago', level: 'warning' },
  { action: 'Firewall rule added: Block 45.227.255.206', user: 'System', time: '5 min ago', level: 'info' },
  { action: 'Device quarantined: APP-SRV-03', user: 'AI Engine', time: '15 min ago', level: 'critical' },
  { action: 'Report exported: Monthly Security Report', user: 'Sarah Chen', time: '1 hour ago', level: 'info' },
  { action: 'Settings updated: AI Sensitivity → High', user: 'Alex Morgan', time: '2 hours ago', level: 'info' },
  { action: 'Failed login attempt (3rd) from 203.0.113.50', user: 'Unknown', time: '3 hours ago', level: 'critical' },
  { action: 'New user registered: Emma Wilson', user: 'System', time: '5 hours ago', level: 'info' },
  { action: 'Alert resolved: DDoS Attack', user: 'John Patel', time: '6 hours ago', level: 'info' },
];

const SYSTEM_METRICS = [
  { label: 'CPU Usage', value: 42, color: '#00d9ff', icon: Server },
  { label: 'Memory Usage', value: 61, color: '#a855f7', icon: Activity },
  { label: 'Disk Usage', value: 38, color: '#22c55e', icon: HardDrive },
  { label: 'Network Load', value: 72, color: '#f97316', icon: BarChart3 },
];

const ALERT_STATS = [
  { label: 'Critical', value: 12, color: '#ef4444' },
  { label: 'High', value: 28, color: '#f97316' },
  { label: 'Medium', value: 45, color: '#eab308' },
  { label: 'Low', value: 67, color: '#22c55e' },
];

const ATTACK_TREND = generateTimeSeriesData(24, 30, 40);
const USER_ACTIVITY = generateTimeSeriesData(24, 50, 30);

export function AdminPanel() {
  const [tab, setTab] = useState<'overview' | 'users' | 'devices' | 'alerts' | 'reports' | 'audit' | 'settings'>('overview');

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'devices', label: 'Devices', icon: HardDrive },
    { key: 'alerts', label: 'Alerts', icon: Bell },
    { key: 'reports', label: 'Reports', icon: FileText },
    { key: 'audit', label: 'Audit Logs', icon: ScrollText },
    { key: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Admin Panel" subtitle="System administration and management" icon={ShieldCheck} />

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? 'text-accent' : 'text-s hover:text-p bg-tertiary'}`}
            style={tab === t.key ? { background: 'var(--accent-glow)' } : undefined}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users" value="8" icon={<Users className="w-5 h-5" />} color="#00d9ff" />
            <StatCard label="Total Devices" value="47" icon={<HardDrive className="w-5 h-5" />} color="#a855f7" />
            <StatCard label="Open Alerts" value="152" icon={<Bell className="w-5 h-5" />} color="#ef4444" />
            <StatCard label="System Uptime" value="99.97%" icon={<CheckCircle className="w-5 h-5" />} color="#22c55e" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-p mb-4">Attack Trend (24h)</h3>
              <LineChart data={ATTACK_TREND} color="#ef4444" height={200} />
            </Card>
            <Card>
              <h3 className="font-semibold text-p mb-4">User Activity (24h)</h3>
              <LineChart data={USER_ACTIVITY} color="#00d9ff" height={200} />
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card>
              <h3 className="font-semibold text-p mb-4">Alert Distribution</h3>
              <DonutChart data={ALERT_STATS} centerValue="152" centerLabel="Alerts" />
            </Card>
            <Card>
              <h3 className="font-semibold text-p mb-4">System Health</h3>
              <div className="space-y-4">
                {SYSTEM_METRICS.map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-s flex items-center gap-2"><m.icon className="w-4 h-4" /> {m.label}</span>
                      <span className="text-sm font-mono text-p">{m.value}%</span>
                    </div>
                    <ProgressBar value={m.value} color={m.color} />
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="font-semibold text-p mb-4">AI Engine Status</h3>
              <Gauge value={97} label="Model Accuracy" color="#22c55e" size={140} />
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-tertiary">
                  <span className="text-sm text-s">Detection Speed</span>
                  <span className="text-sm font-mono text-green-400">42ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-tertiary">
                  <span className="text-sm text-s">False Positive Rate</span>
                  <span className="text-sm font-mono text-green-400">0.3%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <Card>
          <h3 className="font-semibold text-p mb-4">User Management</h3>
          <div className="space-y-2">
            {[
              { name: 'Alex Morgan', role: 'admin', status: 'active' },
              { name: 'Sarah Chen', role: 'analyst', status: 'active' },
              { name: 'John Patel', role: 'operator', status: 'active' },
              { name: 'Maria Garcia', role: 'analyst', status: 'active' },
              { name: 'David Kim', role: 'operator', status: 'inactive' },
              { name: 'Lisa Wang', role: 'guest', status: 'suspended' },
            ].map((u, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-tertiary">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">{u.name[0]}</div>
                  <div>
                    <div className="text-sm font-medium text-p">{u.name}</div>
                    <div className="text-xs text-m capitalize">{u.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={u.status === 'active' ? 'safe' : u.status === 'inactive' ? 'medium' : 'critical'} dot>{u.status}</Badge>
                  <Badge variant="info" size="sm">{u.role}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'devices' && (
        <Card>
          <h3 className="font-semibold text-p mb-4">Device Management</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-tertiary text-center"><div className="text-2xl font-bold text-p font-mono">47</div><div className="text-xs text-m">Total</div></div>
            <div className="p-3 rounded-xl bg-tertiary text-center"><div className="text-2xl font-bold text-green-400 font-mono">38</div><div className="text-xs text-m">Online</div></div>
            <div className="p-3 rounded-xl bg-tertiary text-center"><div className="text-2xl font-bold text-yellow-400 font-mono">6</div><div className="text-xs text-m">Warning</div></div>
            <div className="p-3 rounded-xl bg-tertiary text-center"><div className="text-2xl font-bold text-red-400 font-mono">3</div><div className="text-xs text-m">Critical</div></div>
          </div>
          <div className="space-y-2">
            {['WEB-SRV-01', 'DB-SRV-02', 'APP-SRV-03', 'CORE-RTR-01', 'FW-EDGE-01'].map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-tertiary">
                <div className="flex items-center gap-3"><Server className="w-4 h-4 text-s" /><span className="text-sm font-mono text-p">{h}</span></div>
                <Badge variant={i === 2 ? 'critical' : i === 1 ? 'medium' : 'safe'} dot>{i === 2 ? 'critical' : i === 1 ? 'warning' : 'online'}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'alerts' && (
        <Card>
          <h3 className="font-semibold text-p mb-4">Alert Management</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {ALERT_STATS.map((s, i) => (
              <div key={i} className="p-3 rounded-xl bg-tertiary text-center"><div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div><div className="text-xs text-m">{s.label}</div></div>
            ))}
          </div>
          <div className="space-y-2">
            {['DDoS Attack Detected', 'SQL Injection Attempt', 'Brute Force SSH', 'Malware C2 Beaconing', 'Port Scan Activity'].map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-tertiary">
                <div className="flex items-center gap-3"><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-sm text-p">{a}</span></div>
                <div className="flex gap-2"><Badge variant="critical" size="sm">critical</Badge><Badge variant="info" size="sm">open</Badge></div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'reports' && (
        <Card>
          <h3 className="font-semibold text-p mb-4">Report Management</h3>
          <div className="space-y-2">
            {['Daily Security Report - Jul 15', 'Weekly Threat Summary - Week 28', 'Monthly Executive Report - June', 'AI Analysis Report - Jul 14', 'Compliance Report - Q2 2026'].map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-tertiary">
                <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-s" /><span className="text-sm text-p">{r}</span></div>
                <Badge variant="safe" size="sm">generated</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'audit' && (
        <Card>
          <h3 className="font-semibold text-p mb-4">Audit Logs</h3>
          <div className="space-y-2">
            {AUDIT_LOGS.map((log, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-tertiary">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                  background: log.level === 'critical' ? 'rgba(220,38,38,0.15)' : log.level === 'warning' ? 'rgba(234,179,8,0.15)' : 'rgba(0,217,255,0.15)',
                  color: log.level === 'critical' ? '#ef4444' : log.level === 'warning' ? '#eab308' : '#00d9ff',
                }}>
                  {log.level === 'critical' ? <XCircle className="w-4 h-4" /> : log.level === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-p">{log.action}</div>
                  <div className="text-xs text-m">{log.user} · {log.time}</div>
                </div>
                <Badge variant={log.level === 'critical' ? 'critical' : log.level === 'warning' ? 'medium' : 'info'} size="sm">{log.level}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'settings' && (
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-p mb-4">System Settings</h3>
            <div className="space-y-3">
              {[
                { label: 'Auto-block threats', desc: 'Automatically block IPs with high-confidence threats', enabled: true },
                { label: 'AI auto-response', desc: 'Enable AI-powered automatic incident response', enabled: true },
                { label: 'Email notifications', desc: 'Send email alerts for critical threats', enabled: true },
                { label: 'SMS notifications', desc: 'Send SMS for critical severity threats', enabled: false },
                { label: 'Webhook integration', desc: 'Forward alerts to external webhook endpoints', enabled: false },
                { label: 'Audit logging', desc: 'Log all user and system actions for compliance', enabled: true },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-tertiary">
                  <div><div className="text-sm font-medium text-p">{s.label}</div><div className="text-xs text-m">{s.desc}</div></div>
                  <Badge variant={s.enabled ? 'safe' : 'default'} dot>{s.enabled ? 'enabled' : 'disabled'}</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold text-p mb-4">Role Management</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {(['admin', 'analyst', 'operator', 'guest'] as const).map((r) => (
                <div key={r} className="p-3 rounded-xl bg-tertiary">
                  <div className="flex items-center gap-2 mb-2">
                    {r === 'admin' ? <Crown className="w-4 h-4 text-orange-400" /> : r === 'analyst' ? <Users className="w-4 h-4 text-cyan-400" /> : r === 'operator' ? <ShieldCheck className="w-4 h-4 text-purple-400" /> : <Activity className="w-4 h-4 text-gray-400" />}
                    <span className="text-sm font-medium text-p capitalize">{r}</span>
                  </div>
                  <div className="text-xs text-m">{r === 'admin' ? 'Full system access' : r === 'analyst' ? 'Security analysis' : r === 'operator' ? 'Monitor & respond' : 'Read-only access'}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
