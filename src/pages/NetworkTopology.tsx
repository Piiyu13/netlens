import { useEffect, useRef, useState } from 'react';
import { Network, Router, Server, Cloud, Shield, Cpu, Activity, Wifi } from 'lucide-react';
import { Card, Badge, StatCard } from '../components/ui';
import { PageHeader } from './Dashboard';

interface TopologyNode {
  id: string;
  label: string;
  type: 'router' | 'switch' | 'server' | 'client' | 'firewall' | 'cloud';
  x: number;
  y: number;
  status: 'online' | 'warning' | 'critical';
  bandwidth: number;
}

interface TopologyLink {
  from: string;
  to: string;
  bandwidth: number;
  active: boolean;
}

const NODES: TopologyNode[] = [
  { id: 'fw', label: 'Firewall', type: 'firewall', x: 50, y: 50, status: 'online', bandwidth: 1000 },
  { id: 'r1', label: 'Core Router', type: 'router', x: 50, y: 30, status: 'online', bandwidth: 10000 },
  { id: 'sw1', label: 'Switch A', type: 'switch', x: 25, y: 65, status: 'online', bandwidth: 1000 },
  { id: 'sw2', label: 'Switch B', type: 'switch', x: 75, y: 65, status: 'warning', bandwidth: 1000 },
  { id: 'srv1', label: 'Web Server', type: 'server', x: 10, y: 85, status: 'online', bandwidth: 500 },
  { id: 'srv2', label: 'DB Server', type: 'server', x: 25, y: 90, status: 'online', bandwidth: 500 },
  { id: 'srv3', label: 'App Server', type: 'server', x: 65, y: 85, status: 'critical', bandwidth: 500 },
  { id: 'cl1', label: 'Workstations', type: 'client', x: 85, y: 85, status: 'online', bandwidth: 100 },
  { id: 'cl2', label: 'IoT Devices', type: 'client', x: 80, y: 95, status: 'warning', bandwidth: 100 },
  { id: 'cloud', label: 'Cloud', type: 'cloud', x: 50, y: 10, status: 'online', bandwidth: 10000 },
];

const LINKS: TopologyLink[] = [
  { from: 'cloud', to: 'r1', bandwidth: 10000, active: true },
  { from: 'r1', to: 'fw', bandwidth: 10000, active: true },
  { from: 'fw', to: 'sw1', bandwidth: 1000, active: true },
  { from: 'fw', to: 'sw2', bandwidth: 1000, active: true },
  { from: 'sw1', to: 'srv1', bandwidth: 500, active: true },
  { from: 'sw1', to: 'srv2', bandwidth: 500, active: true },
  { from: 'sw2', to: 'srv3', bandwidth: 500, active: true },
  { from: 'sw2', to: 'cl1', bandwidth: 100, active: true },
  { from: 'sw2', to: 'cl2', bandwidth: 100, active: false },
];

const TYPE_META: Record<string, { icon: any; color: string }> = {
  router: { icon: Router, color: '#a3e635' },
  switch: { icon: Network, color: '#34d399' },
  server: { icon: Server, color: '#22c55e' },
  client: { icon: Cpu, color: '#8b95b0' },
  firewall: { icon: Shield, color: '#f97316' },
  cloud: { icon: Cloud, color: '#16a34a' },
};

const STATUS_COLOR: Record<string, string> = {
  online: '#22c55e',
  warning: '#eab308',
  critical: '#ef4444',
};

export function NetworkTopology() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<TopologyNode | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulsePhase((p) => p + 1), 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

      LINKS.forEach((link) => {
        const from = nodeMap[link.from];
        const to = nodeMap[link.to];
        if (!from || !to) return;
        const x1 = (from.x / 100) * w;
        const y1 = (from.y / 100) * h;
        const x2 = (to.x / 100) * w;
        const y2 = (to.y / 100) * h;

        if (link.active) {
          const phase = (t / 1500) % 1;
          const px = x1 + (x2 - x1) * phase;
          const py = y1 + (y2 - y1) * phase;
          const grad = ctx.createRadialGradient(px, py, 0, px, py, 15);
          grad.addColorStop(0, 'rgba(0,217,255,0.8)');
          grad.addColorStop(1, 'rgba(0,217,255,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, 15, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = link.active ? 'rgba(0,217,255,0.25)' : 'rgba(139,149,176,0.1)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash(link.active ? [] : [4, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      NODES.forEach((node) => {
        const x = (node.x / 100) * w;
        const y = (node.y / 100) * h;
        const color = STATUS_COLOR[node.status];
        const pulse = (Math.sin(t / 600) + 1) / 2;
        const r = 6 + pulse * 3;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
        grad.addColorStop(0, color + '40');
        grad.addColorStop(1, color + '00');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'rgba(232,237,247,0.9)';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, x, y - 14);
      });

      animId = requestAnimationFrame(draw);
    };
    draw(0);
    return () => cancelAnimationFrame(animId);
  }, []);

  const stats = {
    total: NODES.length,
    online: NODES.filter((n) => n.status === 'online').length,
    warning: NODES.filter((n) => n.status === 'warning').length,
    critical: NODES.filter((n) => n.status === 'critical').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Network Topology" subtitle="Interactive network infrastructure visualization" icon={Network} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Devices" value={stats.total} icon={<Network className="w-5 h-5" />} color="#a3e635" />
        <StatCard label="Online" value={stats.online} icon={<Wifi className="w-5 h-5" />} color="#22c55e" />
        <StatCard label="Warning" value={stats.warning} icon={<Activity className="w-5 h-5" />} color="#eab308" />
        <StatCard label="Critical" value={stats.critical} icon={<Shield className="w-5 h-5" />} color="#ef4444" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-p">Network Map</h3>
            <Badge variant="info" dot>Live</Badge>
          </div>
          <div className="relative rounded-xl overflow-hidden bg-tertiary" style={{ height: '500px' }}>
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-p mb-4">Device Legend</h3>
            <div className="space-y-3">
              {Object.entries(TYPE_META).map(([type, meta]) => (
                <div key={type} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${meta.color}15`, color: meta.color }}>
                    <meta.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-p capitalize">{type}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-p mb-4">Status Overview</h3>
            <div className="space-y-3">
              {NODES.map((node) => {
                const meta = TYPE_META[node.type];
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelected(node)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all ${selected?.id === node.id ? 'bg-hover-c' : 'hover:bg-hover-c'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: STATUS_COLOR[node.status], color: STATUS_COLOR[node.status] }} />
                      <span className="text-sm text-p">{node.label}</span>
                    </div>
                    <span className="text-xs font-mono text-m">{node.bandwidth} Mbps</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {selected && (
        <Card className="fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${TYPE_META[selected.type].color}15`, color: TYPE_META[selected.type].color }}>
              {(() => { const Icon = TYPE_META[selected.type].icon; return <Icon className="w-5 h-5" />; })()}
            </div>
            <div>
              <h3 className="font-semibold text-p">{selected.label}</h3>
              <Badge variant={selected.status === 'online' ? 'safe' : selected.status === 'warning' ? 'medium' : 'critical'}>{selected.status}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-tertiary"><div className="text-xs text-m">Type</div><div className="text-sm font-medium text-p capitalize">{selected.type}</div></div>
            <div className="p-3 rounded-xl bg-tertiary"><div className="text-xs text-m">Bandwidth</div><div className="text-sm font-medium text-p font-mono">{selected.bandwidth} Mbps</div></div>
            <div className="p-3 rounded-xl bg-tertiary"><div className="text-xs text-m">Status</div><div className="text-sm font-medium capitalize" style={{ color: STATUS_COLOR[selected.status] }}>{selected.status}</div></div>
            <div className="p-3 rounded-xl bg-tertiary"><div className="text-xs text-m">Last Seen</div><div className="text-sm font-medium text-p">Just now</div></div>
          </div>
        </Card>
      )}
    </div>
  );
}
