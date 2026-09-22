import { useEffect, useState, useMemo } from 'react';
import { Brain, Shield, ShieldCheck, ShieldAlert, Wifi, Cpu, MemoryStick, Target, Zap, Globe, HardDrive, Clock, Activity, Users, FlameKindling } from 'lucide-react';
import { Card, StatCard, Badge, ProgressBar } from '../components/ui';
import { LineChart, AreaChart, BarChart, DonutChart, Heatmap, Gauge, Sparkline } from '../components/Charts';
import { generateTimeSeriesData, generateTrafficData, ATTACK_TYPES } from '../lib/mockData';
import { useAuth } from '../context/AuthContext';

const GEO_ATTACKS = [
  { country: 'China', code: 'CN', lat: 35, lng: 105, count: 342, severity: 'critical' },
  { country: 'Russia', code: 'RU', lat: 61, lng: 105, count: 218, severity: 'critical' },
  { country: 'USA', code: 'US', lat: 38, lng: -97, count: 187, severity: 'high' },
  { country: 'Brazil', code: 'BR', lat: -14, lng: -51, count: 98, severity: 'medium' },
  { country: 'India', code: 'IN', lat: 21, lng: 78, count: 156, severity: 'high' },
  { country: 'Netherlands', code: 'NL', lat: 52, lng: 5, count: 72, severity: 'medium' },
  { country: 'North Korea', code: 'KP', lat: 40, lng: 127, count: 134, severity: 'critical' },
  { country: 'Iran', code: 'IR', lat: 32, lng: 53, count: 89, severity: 'high' },
];

const TOP_DEST_PORTS = [
  { label: '443 (HTTPS)', value: 4200, color: '#22c55e' },
  { label: '80 (HTTP)', value: 2800, color: '#00d9ff' },
  { label: '22 (SSH)', value: 1200, color: '#a855f7' },
  { label: '3389 (RDP)', value: 890, color: '#f97316' },
  { label: '53 (DNS)', value: 650, color: '#eab308' },
  { label: '445 (SMB)', value: 430, color: '#ef4444' },
];

export function Dashboard() {
  const { user } = useAuth();
  const [packetRate, setPacketRate] = useState<number[]>(() => generateTimeSeriesData(30, 800, 400));
  const [trafficData, setTrafficData] = useState(() => generateTrafficData(24));
  const [threatTimeline, setThreatTimeline] = useState<number[]>(() => generateTimeSeriesData(20, 15, 20));
  const [stats, setStats] = useState({ packets: 0, safe: 0, suspicious: 0, malicious: 0 });
  const [livePackets, setLivePackets] = useState<{ ip: string; status: string; type: string }[]>([]);
  const [cpuData, setCpuData] = useState<number[]>(() => generateTimeSeriesData(20, 45, 30));
  const [memData, setMemData] = useState<number[]>(() => generateTimeSeriesData(20, 62, 20));

  useEffect(() => {
    const interval = setInterval(() => {
      setPacketRate((prev) => [...prev.slice(1), Math.floor(Math.random() * 400 + 600)]);
      setThreatTimeline((prev) => [...prev.slice(1), Math.floor(Math.random() * 25 + 5)]);
      setCpuData((prev) => [...prev.slice(1), Math.floor(Math.random() * 30 + 35)]);
      setMemData((prev) => [...prev.slice(1), Math.floor(Math.random() * 20 + 55)]);
      setStats((prev) => ({
        packets: prev.packets + Math.floor(Math.random() * 50 + 20),
        safe: prev.safe + Math.floor(Math.random() * 40 + 15),
        suspicious: prev.suspicious + Math.floor(Math.random() * 8 + 1),
        malicious: prev.malicious + Math.floor(Math.random() * 3),
      }));
      const protocols = ['TCP', 'HTTP', 'DNS', 'HTTPS'];
      const statuses = ['safe', 'suspicious', 'malicious'];
      const ips = ['192.168.1.10', '45.227.255.206', '10.0.0.5', '185.220.101.45'];
      setLivePackets((prev) => [
        {
          ip: ips[Math.floor(Math.random() * ips.length)],
          status: statuses[Math.floor(Math.random() * 3)],
          type: ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)].name,
        },
        ...prev.slice(0, 5),
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const threatDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    ATTACK_TYPES.slice(0, 6).forEach((a) => {
      dist[a.name] = Math.floor(Math.random() * 50 + 10);
    });
    return Object.entries(dist).map(([label, value]) => ({ label, value }));
  }, []);

  const protocolUsage = [
    { label: 'TCP', value: 4200, color: '#00d9ff' },
    { label: 'UDP', value: 2100, color: '#06b6d4' },
    { label: 'HTTP', value: 1800, color: '#a855f7' },
    { label: 'HTTPS', value: 3200, color: '#22c55e' },
    { label: 'DNS', value: 950, color: '#eab308' },
    { label: 'SSH', value: 340, color: '#f97316' },
  ];

  const topSourceIps = [
    { label: '45.227.255.206', value: 342, color: '#ef4444' },
    { label: '185.220.101.45', value: 218, color: '#f97316' },
    { label: '192.168.1.10', value: 187, color: '#00d9ff' },
    { label: '10.0.0.5', value: 156, color: '#06b6d4' },
    { label: '203.0.113.50', value: 98, color: '#eab308' },
  ];

  const donutData = [
    { label: 'Safe', value: stats.safe || 1, color: '#22c55e' },
    { label: 'Suspicious', value: stats.suspicious || 1, color: '#eab308' },
    { label: 'Malicious', value: stats.malicious || 1, color: '#ef4444' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Dashboard" subtitle="Real-time network security overview" icon={Activity} />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Packets" value={stats.packets.toLocaleString()} icon={<Activity className="w-5 h-5" />} color="#00d9ff" trend={{ value: '12%', positive: true }} />
        <StatCard label="Safe Traffic" value={stats.safe.toLocaleString()} icon={<ShieldCheck className="w-5 h-5" />} color="#22c55e" trend={{ value: '8%', positive: true }} />
        <StatCard label="Suspicious" value={stats.suspicious.toLocaleString()} icon={<ShieldAlert className="w-5 h-5" />} color="#eab308" trend={{ value: '3%', positive: false }} />
        <StatCard label="Threats Detected" value={stats.malicious.toLocaleString()} icon={<Shield className="w-5 h-5" />} color="#ef4444" trend={{ value: '15%', positive: false }} />
        <StatCard label="Active Devices" value="47" icon={<Wifi className="w-5 h-5" />} color="#a855f7" sublabel="across 3 subnets" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Packets" value="2.4M" icon={<Activity className="w-5 h-5" />} color="#00d9ff" />
        <StatCard label="Safe Traffic" value="94.2%" icon={<ShieldCheck className="w-5 h-5" />} color="#22c55e" />
        <StatCard label="Suspicious" value="4.8%" icon={<ShieldAlert className="w-5 h-5" />} color="#eab308" />
        <StatCard label="Critical Threats" value={stats.malicious} icon={<Shield className="w-5 h-5" />} color="#ef4444" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Devices" value="47" icon={<HardDrive className="w-5 h-5" />} color="#06b6d4" />
        <StatCard label="Online Users" value="8" icon={<Users className="w-5 h-5" />} color="#a855f7" />
        <StatCard label="Firewall Status" value="Active" icon={<ShieldCheck className="w-5 h-5" />} color="#22c55e" />
        <StatCard label="AI Confidence" value="97.3%" icon={<Brain className="w-5 h-5" />} color="#00d9ff" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Detection Accuracy" value="99.7%" icon={<Target className="w-5 h-5" />} color="#22c55e" />
        <StatCard label="Network Health" value="Good" icon={<Wifi className="w-5 h-5" />} color="#06b6d4" />
        <StatCard label="CPU Usage" value="42%" icon={<Cpu className="w-5 h-5" />} color="#f97316" />
        <StatCard label="Memory Usage" value="61%" icon={<MemoryStick className="w-5 h-5" />} color="#a855f7" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Disk Usage" value="38%" icon={<HardDrive className="w-5 h-5" />} color="#22c55e" />
        <StatCard label="Response Time" value="42ms" icon={<Clock className="w-5 h-5" />} color="#00d9ff" />
        <StatCard label="Packet Loss" value="0.3%" icon={<FlameKindling className="w-5 h-5" />} color="#eab308" />
        <StatCard label="Latency" value="12ms" icon={<Zap className="w-5 h-5" />} color="#a855f7" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-p">Live Network Traffic</h3>
              <p className="text-sm text-m">Real-time packet rate (packets/sec)</p>
            </div>
            <Badge variant="info" dot>Live</Badge>
          </div>
          <LineChart data={packetRate} color="#00d9ff" height={220} />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-p">Threat Distribution</h3>
            <Badge variant="high" dot>Active</Badge>
          </div>
          <DonutChart data={donutData} centerValue={stats.malicious.toString()} centerLabel="Threats" />
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-p">Traffic Timeline</h3>
              <p className="text-sm text-m">Inbound vs outbound bandwidth</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-s"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Inbound</span>
              <span className="flex items-center gap-1.5 text-s"><span className="w-2 h-2 rounded-full" style={{ background: '#a855f7' }} /> Outbound</span>
            </div>
          </div>
          <AreaChart data={trafficData} height={220} />
        </Card>

        <Card>
          <h3 className="font-semibold text-p mb-4">AI Confidence Score</h3>
          <Gauge value={97} label="Model Accuracy" color="#22c55e" size={160} />
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-s">ML Classification</span>
              <span className="text-sm font-mono text-p">98.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-s">Deep Learning</span>
              <span className="text-sm font-mono text-p">96.7%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-s">Anomaly Detection</span>
              <span className="text-sm font-mono text-p">94.1%</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-p mb-4">Attack Trend (Last 24h)</h3>
          <LineChart data={threatTimeline} color="#ef4444" height={180} />
        </Card>

        <Card>
          <h3 className="font-semibold text-p mb-4">Threat Type Distribution</h3>
          <BarChart data={threatDistribution} height={180} />
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="font-semibold text-p mb-4">Top Source IPs</h3>
          <BarChart data={topSourceIps} horizontal height={200} />
        </Card>

        <Card>
          <h3 className="font-semibold text-p mb-4">Protocol Usage</h3>
          <BarChart data={protocolUsage} height={200} />
        </Card>

        <Card>
          <h3 className="font-semibold text-p mb-4">AI Threat Heatmap</h3>
          <Heatmap rows={7} cols={12} />
          <div className="flex items-center justify-between mt-3 text-xs text-m">
            <span>Low Risk</span>
            <span>High Risk</span>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-p">System Resources</h3>
            <Badge variant="safe" dot>Healthy</Badge>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-s flex items-center gap-2"><Cpu className="w-4 h-4" /> CPU</span>
                <span className="text-sm font-mono text-p">{cpuData[cpuData.length - 1]}%</span>
              </div>
              <Sparkline data={cpuData} color="#00d9ff" height={30} width={300} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-s flex items-center gap-2"><MemoryStick className="w-4 h-4" /> Memory</span>
                <span className="text-sm font-mono text-p">{memData[memData.length - 1]}%</span>
              </div>
              <Sparkline data={memData} color="#a855f7" height={30} width={300} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-s flex items-center gap-2"><Globe className="w-4 h-4" /> Network I/O</span>
                <span className="text-sm font-mono text-p">1.2 Gbps</span>
              </div>
              <Sparkline data={packetRate} color="#22c55e" height={30} width={300} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-p">Live Packet Feed</h3>
            <Badge variant="info" dot>Streaming</Badge>
          </div>
          <div className="space-y-2">
            {livePackets.map((pkt, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-tertiary slide-in-right">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full pulse-dot ${pkt.status === 'safe' ? 'bg-green-400' : pkt.status === 'suspicious' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                  <span className="text-sm font-mono text-p">{pkt.ip}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-m">{pkt.type}</span>
                  <Badge variant={pkt.status as any} size="sm">{pkt.status}</Badge>
                </div>
              </div>
            ))}
            {livePackets.length === 0 && (
              <div className="text-sm text-m text-center py-8">Waiting for packets...</div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-p flex items-center gap-2"><Globe className="w-5 h-5 text-accent" /> Geographic Attack Map</h3>
            <Badge variant="critical" dot>Live</Badge>
          </div>
          <div className="relative rounded-xl overflow-hidden bg-tertiary" style={{ height: '320px' }}>
            <div className="absolute inset-0 grid-pattern opacity-30" />
            {GEO_ATTACKS.map((attack, i) => {
              const x = ((attack.lng + 180) / 360) * 100;
              const y = ((90 - attack.lat) / 180) * 100;
              const size = Math.min(attack.count / 40, 20);
              const color = attack.severity === 'critical' ? '#ef4444' : attack.severity === 'high' ? '#f97316' : '#eab308';
              return (
                <div key={i} className="absolute group" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full pulse-dot" style={{ width: size, height: size, background: color, opacity: 0.4 }} />
                    <div className="rounded-full" style={{ width: size / 2, height: size / 2, background: color, boxShadow: `0 0 12px ${color}` }} />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-secondary px-2 py-1 rounded-lg text-xs whitespace-nowrap pointer-events-none border border-c">
                    <span className="text-p font-medium">{attack.country}</span>
                    <span className="text-m ml-1">{attack.count} attacks</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {GEO_ATTACKS.slice(0, 4).map((a, i) => (
              <div key={i} className="p-3 rounded-xl bg-tertiary">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: a.severity === 'critical' ? '#ef4444' : a.severity === 'high' ? '#f97316' : '#eab308' }} />
                  <span className="text-sm font-medium text-p">{a.country}</span>
                </div>
                <div className="text-xs text-m">{a.count} attacks · {a.severity}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-p mb-4">Top Destination Ports</h3>
          <div className="space-y-3">
            {TOP_DEST_PORTS.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-s font-mono">{p.label}</span>
                  <span className="text-sm font-mono text-p">{p.value.toLocaleString()}</span>
                </div>
                <ProgressBar value={(p.value / 4200) * 100} color={p.color} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: any }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-tertiary flex items-center justify-center text-accent">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-p">{title}</h1>
        <p className="text-sm text-s">{subtitle}</p>
      </div>
    </div>
  );
}
