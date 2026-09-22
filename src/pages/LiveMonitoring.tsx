import { useEffect, useState, useRef } from 'react';
import { Activity, Shield, Ban, Eye, Download, Filter, Pause, Play, Search, ChevronLeft, ChevronRight, Globe, HardDrive, Clock } from 'lucide-react';
import { Card, Badge, Button, StatCard } from '../components/ui';
import { PageHeader } from './Dashboard';
import { LineChart } from '../components/Charts';
import { generatePacket, generateTimeSeriesData, formatBytes, timeAgo } from '../lib/mockData';
import type { LivePacket, ThreatStatus } from '../types';

const PAGE_SIZE = 15;

type SortField = 'timestamp' | 'sourceIp' | 'destinationIp' | 'port' | 'size' | 'confidence' | 'riskScore';
type SortDir = 'asc' | 'desc';

export function LiveMonitoring() {
  const [packets, setPackets] = useState<LivePacket[]>([]);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<'all' | ThreatStatus>('all');
  const [search, setSearch] = useState('');
  const [rate, setRate] = useState<number[]>(() => generateTimeSeriesData(30, 120, 80));
  const [totalCaptured, setTotalCaptured] = useState(0);
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setPackets(Array.from({ length: 20 }, () => generatePacket()));
    setTotalCaptured(20);
  }, []);

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      const newPackets = Array.from({ length: Math.floor(Math.random() * 3 + 1) }, () => generatePacket());
      setPackets((prev) => [...newPackets, ...prev].slice(0, 200));
      setTotalCaptured((prev) => prev + newPackets.length);
      setRate((prev) => [...prev.slice(1), Math.floor(Math.random() * 80 + 80)]);
    }, 1500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused]);

  const filteredPackets = packets.filter((p) => {
    if (filter !== 'all' && p.threatStatus !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.sourceIp.includes(q) || p.destinationIp.includes(q) || p.protocol.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.device.toLowerCase().includes(q);
    }
    return true;
  });

  const sortedPackets = [...filteredPackets].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'timestamp') cmp = a.timestamp - b.timestamp;
    else if (sortField === 'size') cmp = a.size - b.size;
    else if (sortField === 'port') cmp = a.port - b.port;
    else if (sortField === 'confidence') cmp = a.confidence - b.confidence;
    else if (sortField === 'riskScore') cmp = a.riskScore - b.riskScore;
    else cmp = String(a[sortField]).localeCompare(String(b[sortField]));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sortedPackets.length / PAGE_SIZE);
  const pageData = sortedPackets.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const stats = {
    safe: packets.filter((p) => p.threatStatus === 'safe').length,
    suspicious: packets.filter((p) => p.threatStatus === 'suspicious').length,
    malicious: packets.filter((p) => p.threatStatus === 'malicious').length,
  };

  const exportCsv = () => {
    const header = 'Time,Source IP,Destination IP,Country,Protocol,Port,Size,Device,Threat Level,AI Confidence,Risk Score,Status\n';
    const rows = sortedPackets.map((p) =>
      `${new Date(p.timestamp).toISOString()},${p.sourceIp},${p.destinationIp},${p.country},${p.protocol},${p.port},${p.size},${p.device},${p.threatStatus},${p.confidence},${p.riskScore},${p.threatStatus}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netlens-packets-${Date.now()}.csv`;
    a.click();
  };

  const exportPdf = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>NetLens Packet Report</title><style>body{font-family:monospace;padding:20px;color:#0a0e1a}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:6px;text-align:left;font-size:11px}th{background:#f0f0f0}h1{font-size:18px}</style></head><body>`);
    win.document.write('<h1>NetLens - Live Monitoring Report</h1>');
    win.document.write(`<p>Generated: ${new Date().toLocaleString()} | Total Packets: ${sortedPackets.length}</p>`);
    win.document.write('<table><tr><th>Time</th><th>Source IP</th><th>Dest IP</th><th>Country</th><th>Protocol</th><th>Port</th><th>Size</th><th>Device</th><th>Threat</th><th>Confidence</th><th>Risk</th></tr>');
    sortedPackets.forEach((p) => {
      win.document.write(`<tr><td>${new Date(p.timestamp).toLocaleTimeString()}</td><td>${p.sourceIp}</td><td>${p.destinationIp}</td><td>${p.country}</td><td>${p.protocol}</td><td>${p.port}</td><td>${formatBytes(p.size)}</td><td>${p.device}</td><td>${p.threatStatus}</td><td>${p.confidence}%</td><td>${p.riskScore}</td></tr>`);
    });
    win.document.write('</table></body></html>');
    win.document.close();
    win.print();
  };

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th className="py-3 px-3 font-medium cursor-pointer hover:text-p transition-colors select-none" onClick={() => toggleSort(field)}>
      <span className="inline-flex items-center gap-1">
        {label}
        {sortField === field && <span className="text-accent">{sortDir === 'asc' ? '↑' : '↓'}</span>}
      </span>
    </th>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Live Monitoring" subtitle="Real-time packet capture and network traffic analysis" icon={Activity} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Packets Captured" value={totalCaptured.toLocaleString()} icon={<Activity className="w-5 h-5" />} color="#00d9ff" />
        <StatCard label="Safe Traffic" value={stats.safe} icon={<Shield className="w-5 h-5" />} color="#22c55e" />
        <StatCard label="Suspicious" value={stats.suspicious} icon={<Eye className="w-5 h-5" />} color="#eab308" />
        <StatCard label="Malicious" value={stats.malicious} icon={<Ban className="w-5 h-5" />} color="#ef4444" />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-p">Packet Rate (Live)</h3>
            <p className="text-sm text-m">Packets per second</p>
          </div>
          <Badge variant="info" dot>{paused ? 'Paused' : 'Live'}</Badge>
        </div>
        <LineChart data={rate} color="#00d9ff" height={160} />
      </Card>

      <Card>
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-m" />
            <input
              type="text"
              placeholder="Search IP, protocol, country, device..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'safe', 'suspicious', 'malicious'] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(0); }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === f ? 'text-accent' : 'text-s hover:text-p bg-tertiary'
                }`}
                style={filter === f ? { background: 'var(--accent-glow)' } : undefined}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="md" onClick={() => setPaused(!paused)}>
              {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {paused ? 'Resume' : 'Pause'}
            </Button>
            <Button variant="secondary" size="md" onClick={exportCsv}>
              <Download className="w-4 h-4" /> CSV
            </Button>
            <Button variant="secondary" size="md" onClick={exportPdf}>
              <Download className="w-4 h-4" /> PDF
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-m border-b border-c">
                <SortHeader field="timestamp" label="Time" />
                <SortHeader field="sourceIp" label="Source IP" />
                <SortHeader field="destinationIp" label="Destination IP" />
                <th className="py-3 px-3 font-medium">Country</th>
                <SortHeader field="port" label="Protocol" />
                <SortHeader field="port" label="Port" />
                <SortHeader field="size" label="Size" />
                <th className="py-3 px-3 font-medium">Device</th>
                <th className="py-3 px-3 font-medium">Threat Level</th>
                <SortHeader field="confidence" label="AI Conf." />
                <SortHeader field="riskScore" label="Risk" />
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((pkt) => (
                <tr key={pkt.id} className="border-b border-c hover:bg-hover-c transition-colors fade-in">
                  <td className="py-2.5 px-3 text-xs text-m whitespace-nowrap">{timeAgo(pkt.timestamp)}</td>
                  <td className="py-2.5 px-3 font-mono text-p text-xs">{pkt.sourceIp}</td>
                  <td className="py-2.5 px-3 font-mono text-p text-xs">{pkt.destinationIp}</td>
                  <td className="py-2.5 px-3">
                    <span className="flex items-center gap-1.5 text-xs text-s">
                      <Globe className="w-3 h-3 text-m" /> {pkt.country}
                    </span>
                  </td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-tertiary text-s font-mono text-xs">{pkt.protocol}</span></td>
                  <td className="py-2.5 px-3 font-mono text-s text-xs">{pkt.port}</td>
                  <td className="py-2.5 px-3 font-mono text-s text-xs">{formatBytes(pkt.size)}</td>
                  <td className="py-2.5 px-3">
                    <span className="flex items-center gap-1 text-xs text-s">
                      <HardDrive className="w-3 h-3 text-m" /> {pkt.device}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <Badge variant={pkt.threatStatus} dot size="sm">{pkt.threatStatus}</Badge>
                    {pkt.threatType && <div className="text-xs text-m mt-0.5">{pkt.threatType}</div>}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-tertiary overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${pkt.confidence}%`,
                          background: pkt.confidence > 80 ? '#ef4444' : pkt.confidence > 50 ? '#eab308' : '#22c55e'
                        }} />
                      </div>
                      <span className="text-xs font-mono text-s">{pkt.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-xs font-semibold" style={{
                      color: pkt.riskScore > 70 ? '#ef4444' : pkt.riskScore > 40 ? '#eab308' : '#22c55e'
                    }}>{pkt.riskScore}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="flex items-center gap-1 text-xs">
                      <span className="w-2 h-2 rounded-full" style={{
                        background: pkt.threatStatus === 'safe' ? '#22c55e' : pkt.threatStatus === 'suspicious' ? '#eab308' : '#ef4444'
                      }} />
                      <span className="text-s capitalize">{pkt.threatStatus}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {pkt.threatStatus !== 'safe' ? (
                      <button className="px-2 py-1 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 text-xs font-medium transition-colors flex items-center gap-1">
                        <Ban className="w-3 h-3" /> Block
                      </button>
                    ) : (
                      <button className="px-2 py-1 rounded-lg bg-tertiary text-m hover:text-s text-xs font-medium transition-colors flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pageData.length === 0 && (
            <div className="text-center py-12 text-m">No packets match your filters</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-c">
            <span className="text-sm text-m">
              Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, sortedPackets.length)} of {sortedPackets.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg bg-tertiary text-s hover:text-p disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-s font-mono px-2">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg bg-tertiary text-s hover:text-p disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
