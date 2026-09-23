import { useEffect, useState, useCallback } from 'react';
import { HardDrive, Search, Plus, RefreshCw, Monitor, Server, Cloud, Cpu, MemoryStick, Activity, Shield, Router, Network } from 'lucide-react';
import { Card, Badge, Button, StatCard, EmptyState } from '../components/ui';
import { PageHeader } from './Dashboard';
import { devicesApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../lib/utils';
import type { Device } from '../types';

const SAMPLE_DEVICES: Omit<Device, 'id' | 'user_id' | 'created_at' | 'last_seen'>[] = [
  { hostname: 'WEB-SRV-01', ip_address: '192.168.1.10', mac_address: '00:1a:2b:3c:4d:5e', os_type: 'Ubuntu 22.04 LTS', device_type: 'server', cpu_usage: 42, ram_usage: 68, storage_usage: 45, status: 'online', patch_level: 'current', bandwidth_mbps: 1000 },
  { hostname: 'DB-SRV-02', ip_address: '192.168.1.20', mac_address: '00:1a:2b:3c:4d:5f', os_type: 'Windows Server 2022', device_type: 'server', cpu_usage: 78, ram_usage: 82, storage_usage: 67, status: 'warning', patch_level: 'pending', bandwidth_mbps: 1000 },
  { hostname: 'CORE-RTR-01', ip_address: '10.0.0.1', mac_address: '00:1a:2b:3c:4d:60', os_type: 'Cisco IOS XE', device_type: 'router', cpu_usage: 15, ram_usage: 32, storage_usage: 20, status: 'online', patch_level: 'current', bandwidth_mbps: 10000 },
  { hostname: 'SW-FLOOR-A', ip_address: '10.0.0.5', mac_address: '00:1a:2b:3c:4d:61', os_type: 'ArubaOS', device_type: 'switch', cpu_usage: 8, ram_usage: 24, storage_usage: 15, status: 'online', patch_level: 'current', bandwidth_mbps: 1000 },
  { hostname: 'WS-JOHN-PC', ip_address: '192.168.1.100', mac_address: '00:1a:2b:3c:4d:62', os_type: 'Windows 11 Pro', device_type: 'client', cpu_usage: 35, ram_usage: 52, storage_usage: 78, status: 'online', patch_level: 'current', bandwidth_mbps: 100 },
  { hostname: 'WS-SARA-MAC', ip_address: '192.168.1.101', mac_address: '00:1a:2b:3c:4d:63', os_type: 'macOS Sonoma', device_type: 'client', cpu_usage: 28, ram_usage: 61, storage_usage: 55, status: 'online', patch_level: 'current', bandwidth_mbps: 100 },
  { hostname: 'IOT-CAM-03', ip_address: '192.168.1.150', mac_address: '00:1a:2b:3c:4d:64', os_type: 'Embedded Linux', device_type: 'iot', cpu_usage: 12, ram_usage: 18, storage_usage: 8, status: 'warning', patch_level: 'outdated', bandwidth_mbps: 10 },
  { hostname: 'APP-SRV-03', ip_address: '192.168.1.30', mac_address: '00:1a:2b:3c:4d:65', os_type: 'CentOS 8', device_type: 'server', cpu_usage: 91, ram_usage: 88, storage_usage: 72, status: 'critical', patch_level: 'outdated', bandwidth_mbps: 500 },
  { hostname: 'FW-EDGE-01', ip_address: '10.0.0.254', mac_address: '00:1a:2b:3c:4d:66', os_type: 'pfSense 2.7', device_type: 'firewall', cpu_usage: 22, ram_usage: 45, storage_usage: 30, status: 'online', patch_level: 'current', bandwidth_mbps: 10000 },
  { hostname: 'CLOUD-AWS-01', ip_address: '172.16.0.8', mac_address: 'N/A', os_type: 'Amazon Linux 2', device_type: 'cloud', cpu_usage: 55, ram_usage: 70, storage_usage: 40, status: 'online', patch_level: 'current', bandwidth_mbps: 5000 },
];

const TYPE_ICON: Record<string, any> = {
  router: Router, switch: Network, server: Server, client: Monitor, firewall: Shield, cloud: Cloud, iot: Cpu,
};

export function DeviceManagement() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const loadDevices = useCallback(async () => {
    if (!user) return;
    try {
      const data = await devicesApi.list();
      if (data.length > 0) {
        setDevices(data);
      } else {
        const seeded = await devicesApi.create(SAMPLE_DEVICES.map((d) => ({ ...d })));
        setDevices(seeded);
      }
    } catch {
      setDevices(
        SAMPLE_DEVICES.map((d, i) => ({
          ...d,
          id: `local-${i}`,
          user_id: user.id,
          created_at: new Date().toISOString(),
          last_seen: new Date().toISOString(),
        })),
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { loadDevices(); }, [loadDevices]);

  const filtered = devices.filter((d) => {
    if (filter !== 'all' && d.device_type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return d.hostname.toLowerCase().includes(q) || d.ip_address.includes(q) || (d.os_type?.toLowerCase().includes(q) ?? false);
    }
    return true;
  });

  const stats = {
    total: devices.length,
    online: devices.filter((d) => d.status === 'online').length,
    warning: devices.filter((d) => d.status === 'warning').length,
    critical: devices.filter((d) => d.status === 'critical').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Device Management" subtitle="Network device inventory and management" icon={HardDrive} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Devices" value={stats.total} icon={<HardDrive className="w-5 h-5" />} color="#a3e635" />
        <StatCard label="Online" value={stats.online} icon={<Activity className="w-5 h-5" />} color="#22c55e" />
        <StatCard label="Warning" value={stats.warning} icon={<Shield className="w-5 h-5" />} color="#eab308" />
        <StatCard label="Critical" value={stats.critical} icon={<Shield className="w-5 h-5" />} color="#ef4444" />
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-m" />
            <input type="text" placeholder="Search hostname, IP, OS..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'server', 'client', 'router', 'switch', 'firewall', 'cloud', 'iot'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'text-accent' : 'text-s hover:text-p bg-tertiary'}`}
                style={filter === f ? { background: 'var(--accent-glow)' } : undefined}>{f}</button>
            ))}
          </div>
          <Button variant="secondary" onClick={loadDevices}><RefreshCw className="w-4 h-4" /> Refresh</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-m border-b border-c">
                <th className="py-3 px-3 font-medium">Hostname</th>
                <th className="py-3 px-3 font-medium">IP Address</th>
                <th className="py-3 px-3 font-medium">MAC</th>
                <th className="py-3 px-3 font-medium">OS</th>
                <th className="py-3 px-3 font-medium">Type</th>
                <th className="py-3 px-3 font-medium">CPU</th>
                <th className="py-3 px-3 font-medium">RAM</th>
                <th className="py-3 px-3 font-medium">Storage</th>
                <th className="py-3 px-3 font-medium">Patch</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const Icon = TYPE_ICON[d.device_type] || Monitor;
                return (
                  <tr key={d.id} className="border-b border-c hover:bg-hover-c transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-tertiary flex items-center justify-center"><Icon className="w-3.5 h-3.5 text-s" /></div>
                        <span className="font-medium text-p">{d.hostname}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-s">{d.ip_address}</td>
                    <td className="py-2.5 px-3 font-mono text-xs text-m">{d.mac_address || 'N/A'}</td>
                    <td className="py-2.5 px-3 text-s">{d.os_type || 'Unknown'}</td>
                    <td className="py-2.5 px-3"><Badge variant="info" size="sm">{d.device_type}</Badge></td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5"><Cpu className="w-3 h-3 text-m" /><span className="font-mono text-s">{d.cpu_usage}%</span></div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5"><MemoryStick className="w-3 h-3 text-m" /><span className="font-mono text-s">{d.ram_usage}%</span></div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-s">{d.storage_usage}%</td>
                    <td className="py-2.5 px-3">
                      <Badge variant={d.patch_level === 'current' ? 'safe' : d.patch_level === 'pending' ? 'medium' : 'critical'} size="sm">{d.patch_level}</Badge>
                    </td>
                    <td className="py-2.5 px-3"><Badge variant={d.status === 'online' ? 'safe' : d.status === 'warning' ? 'medium' : 'critical'} dot>{d.status}</Badge></td>
                    <td className="py-2.5 px-3 text-xs text-m">{formatDate(d.last_seen)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && <EmptyState icon={<HardDrive className="w-8 h-8" />} title="No Devices Found" subtitle="No devices match your filters." />}
          {loading && <div className="text-center py-12 text-m">Loading devices...</div>}
        </div>
      </Card>
    </div>
  );
}


