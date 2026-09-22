import { useEffect, useState, useRef } from 'react';
import { Globe, Bug, Biohazard, Crosshair, Activity, Search, Shield, AlertTriangle } from 'lucide-react';
import { Card, Badge, StatCard, EmptyState } from '../components/ui';
import { PageHeader } from './Dashboard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../lib/utils';
import type { ThreatIntel } from '../types';

const TYPE_META: Record<string, { icon: any; color: string; label: string }> = {
  cve: { icon: Bug, color: '#ef4444', label: 'CVE' },
  malware: { icon: Biohazard, color: '#f97316', label: 'Malware' },
  ioc: { icon: Crosshair, color: '#eab308', label: 'IOC' },
  global_attack: { icon: Activity, color: '#00d9ff', label: 'Global Attack' },
};

const ATTACK_LOCATIONS = [
  { x: 20, y: 35, name: 'North America', intensity: 0.9 },
  { x: 48, y: 30, name: 'Europe', intensity: 0.8 },
  { x: 70, y: 40, name: 'Asia Pacific', intensity: 0.85 },
  { x: 30, y: 55, name: 'Latin America', intensity: 0.6 },
  { x: 55, y: 60, name: 'Africa', intensity: 0.5 },
  { x: 80, y: 70, name: 'Oceania', intensity: 0.4 },
];

export function ThreatIntelligence() {
  const { user } = useAuth();
  const [intel, setIntel] = useState<ThreatIntel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('threat_intel')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setIntel(data as ThreatIntel[]);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Connection lines between attack locations
      ATTACK_LOCATIONS.forEach((loc, i) => {
        ATTACK_LOCATIONS.slice(i + 1).forEach((loc2) => {
          const x1 = (loc.x / 100) * w;
          const y1 = (loc.y / 100) * h;
          const x2 = (loc2.x / 100) * w;
          const y2 = (loc2.y / 100) * h;
          const phase = (t / 2000 + i * 0.3) % 1;
          ctx.strokeStyle = `rgba(239,68,68,${0.15 * Math.sin(phase * Math.PI)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });
      });

      ATTACK_LOCATIONS.forEach((loc) => {
        const x = (loc.x / 100) * w;
        const y = (loc.y / 100) * h;
        const pulse = (Math.sin(t / 800) + 1) / 2;
        const radius = 8 + pulse * 6;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        grad.addColorStop(0, `rgba(239,68,68,${0.6 * loc.intensity})`);
        grad.addColorStop(1, 'rgba(239,68,68,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    };
    draw(0);
    return () => cancelAnimationFrame(animId);
  }, []);

  const filtered = intel.filter((i) => {
    if (filter !== 'all' && i.intel_type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return i.name.toLowerCase().includes(q) || (i.description?.toLowerCase().includes(q) ?? false);
    }
    return true;
  });

  const stats = {
    cve: intel.filter((i) => i.intel_type === 'cve').length,
    malware: intel.filter((i) => i.intel_type === 'malware').length,
    ioc: intel.filter((i) => i.intel_type === 'ioc').length,
    global: intel.filter((i) => i.intel_type === 'global_attack').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Threat Intelligence" subtitle="Global cyber threat intelligence and indicators of compromise" icon={Globe} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="CVE Database" value={stats.cve} icon={<Bug className="w-5 h-5" />} color="#ef4444" />
        <StatCard label="Malware Database" value={stats.malware} icon={<Biohazard className="w-5 h-5" />} color="#f97316" />
        <StatCard label="IOCs" value={stats.ioc} icon={<Crosshair className="w-5 h-5" />} color="#eab308" />
        <StatCard label="Global Attacks" value={stats.global} icon={<Activity className="w-5 h-5" />} color="#00d9ff" />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-p">Global Attack Map</h3>
            <p className="text-sm text-m">Real-time cyber attack activity worldwide</p>
          </div>
          <Badge variant="critical" dot>Live</Badge>
        </div>
        <div className="relative rounded-xl overflow-hidden bg-tertiary" style={{ height: '350px' }}>
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          {ATTACK_LOCATIONS.map((loc) => (
            <div
              key={loc.name}
              className="absolute text-xs text-s font-medium pointer-events-none"
              style={{
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                transform: 'translate(10px, -50%)',
              }}
            >
              {loc.name}
            </div>
          ))}
          <div className="absolute bottom-4 left-4 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-s"><span className="w-2 h-2 rounded-full bg-red-400 pulse-dot" /> Active Attack</span>
            <span className="flex items-center gap-1.5 text-s"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Monitoring</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-m" />
            <input type="text" placeholder="Search threats..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'cve', 'malware', 'ioc', 'global_attack'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'text-accent' : 'text-s hover:text-p bg-tertiary'}`}
                style={filter === f ? { background: 'var(--accent-glow)' } : undefined}>
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const meta = TYPE_META[item.intel_type];
            const Icon = meta.icon;
            return (
              <div key={item.id} className="p-4 rounded-xl bg-tertiary border border-c hover:border-lc transition-all fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${meta.color}15`, color: meta.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-medium text-p">{item.name}</h4>
                      <Badge variant={item.severity} size="sm">{item.severity}</Badge>
                      <Badge variant="info" size="sm">{meta.label}</Badge>
                    </div>
                    <p className="text-sm text-s mb-2">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-m">
                      {item.affected_systems && <span>Target: <span className="text-s">{item.affected_systems}</span></span>}
                      {item.indicator_value && <span className="font-mono">IOC: {item.indicator_value}</span>}
                      {item.region && <span>{item.region}</span>}
                      <span>Updated: {formatDate(item.last_seen)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && !loading && (
            <div className="col-span-2">
              <EmptyState icon={<Globe className="w-8 h-8" />} title="No Threat Intelligence Found" subtitle="No entries match your search." />
            </div>
          )}
          {loading && <div className="col-span-2 text-center py-12 text-m">Loading threat intelligence...</div>}
        </div>
      </Card>
    </div>
  );
}
