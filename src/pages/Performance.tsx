import { useEffect, useState } from 'react';
import { Gauge as GaugeIcon, Cpu, MemoryStick, Globe, Zap, Activity, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, Badge, StatCard, ProgressBar } from '../components/ui';
import { PageHeader } from './Dashboard';
import { Gauge, Sparkline, LineChart, BarChart } from '../components/Charts';
import { generateTimeSeriesData, generateTrafficData } from '../lib/mockData';

export function Performance() {
  const [cpuData, setCpuData] = useState<number[]>(() => generateTimeSeriesData(30, 42, 25));
  const [memData, setMemData] = useState<number[]>(() => generateTimeSeriesData(30, 58, 20));
  const [netData, setNetData] = useState<number[]>(() => generateTimeSeriesData(30, 70, 35));
  const [trafficData, setTrafficData] = useState(() => generateTrafficData(24));
  const [uptime, setUptime] = useState(99.97);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuData((p) => [...p.slice(1), Math.floor(Math.random() * 25 + 35)]);
      setMemData((p) => [...p.slice(1), Math.floor(Math.random() * 20 + 52)]);
      setNetData((p) => [...p.slice(1), Math.floor(Math.random() * 30 + 60)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const detectionSpeed = [
    { label: 'ML Model', value: 42, color: '#a3e635' },
    { label: 'DL Model', value: 68, color: '#34d399' },
    { label: 'Anomaly', value: 35, color: '#22c55e' },
    { label: 'Pattern', value: 28, color: '#f97316' },
    { label: 'Heuristic', value: 15, color: '#eab308' },
  ];

  const cpu = cpuData[cpuData.length - 1];
  const mem = memData[memData.length - 1];
  const net = netData[netData.length - 1];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Performance" subtitle="System performance and detection metrics" icon={GaugeIcon} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="CPU Usage" value={`${cpu}%`} icon={<Cpu className="w-5 h-5" />} color="#a3e635" trend={{ value: '5%', positive: true }} />
        <StatCard label="RAM Usage" value={`${mem}%`} icon={<MemoryStick className="w-5 h-5" />} color="#34d399" trend={{ value: '2%', positive: true }} />
        <StatCard label="Network Usage" value={`${net}%`} icon={<Globe className="w-5 h-5" />} color="#22c55e" />
        <StatCard label="Uptime" value={`${uptime}%`} icon={<CheckCircle className="w-5 h-5" />} color="#22c55e" sublabel="30-day average" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center">
          <h3 className="font-semibold text-p mb-4 self-start">CPU Performance</h3>
          <Gauge value={cpu} label="Processor Load" color="#a3e635" size={160} />
          <div className="w-full mt-4">
            <Sparkline data={cpuData} color="#a3e635" height={40} width={280} />
          </div>
        </Card>
        <Card className="flex flex-col items-center">
          <h3 className="font-semibold text-p mb-4 self-start">Memory Usage</h3>
          <Gauge value={mem} label="RAM Utilization" color="#34d399" size={160} />
          <div className="w-full mt-4">
            <Sparkline data={memData} color="#34d399" height={40} width={280} />
          </div>
        </Card>
        <Card className="flex flex-col items-center">
          <h3 className="font-semibold text-p mb-4 self-start">Network Load</h3>
          <Gauge value={net} label="Bandwidth Usage" color="#22c55e" size={160} />
          <div className="w-full mt-4">
            <Sparkline data={netData} color="#22c55e" height={40} width={280} />
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-p">Network Traffic (24h)</h3>
            <Badge variant="info" dot>Live</Badge>
          </div>
          <LineChart data={netData} color="#a3e635" height={220} />
        </Card>

        <Card>
          <h3 className="font-semibold text-p mb-4">Detection Speed (ms)</h3>
          <BarChart data={detectionSpeed} height={220} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-tertiary">
              <div className="text-xs text-m mb-1">Avg Response Time</div>
              <div className="text-lg font-semibold text-p font-mono">42ms</div>
            </div>
            <div className="p-3 rounded-xl bg-tertiary">
              <div className="text-xs text-m mb-1">Detection Accuracy</div>
              <div className="text-lg font-semibold text-green-400 font-mono">99.7%</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-p mb-4">System Health Metrics</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Response Time', value: '42ms', icon: Clock, color: '#a3e635' },
            { label: 'Detection Speed', value: '28ms', icon: Zap, color: '#34d399' },
            { label: 'Accuracy', value: '99.7%', icon: CheckCircle, color: '#22c55e' },
            { label: 'Throughput', value: '1.2 Gbps', icon: Activity, color: '#f97316' },
          ].map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-tertiary">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${m.color}15`, color: m.color }}>
                <m.icon className="w-5 h-5" />
              </div>
              <div className="text-xl font-bold text-p font-mono">{m.value}</div>
              <div className="text-sm text-s mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-p mb-4">AI Engine Performance</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-s flex items-center gap-2"><Cpu className="w-4 h-4" /> Model Inference Speed</span>
              <span className="text-sm font-mono text-p">42ms avg</span>
            </div>
            <ProgressBar value={92} color="#a3e635" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-s flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Detection Accuracy</span>
              <span className="text-sm font-mono text-green-400">99.7%</span>
            </div>
            <ProgressBar value={99.7} color="#22c55e" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-s flex items-center gap-2"><Activity className="w-4 h-4" /> False Positive Rate</span>
              <span className="text-sm font-mono text-p">0.3%</span>
            </div>
            <ProgressBar value={3} color="#f97316" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-s flex items-center gap-2"><CheckCircle className="w-4 h-4" /> System Availability</span>
              <span className="text-sm font-mono text-green-400">99.97%</span>
            </div>
            <ProgressBar value={99.97} color="#22c55e" />
          </div>
        </div>
      </Card>
    </div>
  );
}
