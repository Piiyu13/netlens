import { useEffect, useState } from 'react';
import { Package, Search, FileText, Layers, Eye, Zap, Download, ChevronRight, Hexagon } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { PageHeader } from './Dashboard';
import { generatePacket, formatBytes } from '../lib/mockData';
import type { LivePacket } from '../types';

export function PacketAnalyzer() {
  const [selectedPacket, setSelectedPacket] = useState<LivePacket | null>(null);
  const [packets, setPackets] = useState<LivePacket[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setPackets(Array.from({ length: 15 }, () => generatePacket()));
  }, []);

  const filtered = packets.filter((p) =>
    !search || p.sourceIp.includes(search) || p.destinationIp.includes(search) || p.protocol.toLowerCase().includes(search)
  );

  const hexDump = selectedPacket
    ? Array.from({ length: 8 }, (_, i) => ({
        offset: (i * 16).toString(16).padStart(8, '0'),
        hex: Array.from({ length: 16 }, (_, j) => ((i * 16 + j) % 256).toString(16).padStart(2, '0')).join(' '),
        ascii: Array.from({ length: 16 }, (_, j) => {
          const c = (i * 16 + j) % 128;
          return c >= 32 && c < 127 ? String.fromCharCode(c) : '.';
        }).join(''),
      }))
    : [];

  const layers = selectedPacket ? [
    { name: 'Ethernet', protocol: 'IEEE 802.3', color: '#8b95b0', fields: [
      { key: 'Source MAC', value: '00:1a:2b:3c:4d:5e' },
      { key: 'Dest MAC', value: '00:5e:6f:7a:8b:9c' },
      { key: 'Type', value: 'IPv4 (0x0800)' },
    ]},
    { name: 'IP', protocol: 'IPv4', color: '#00d9ff', fields: [
      { key: 'Version', value: '4' },
      { key: 'Source IP', value: selectedPacket.sourceIp },
      { key: 'Destination IP', value: selectedPacket.destinationIp },
      { key: 'TTL', value: '64' },
      { key: 'Protocol', value: selectedPacket.protocol },
    ]},
    { name: 'Transport', protocol: selectedPacket.protocol, color: '#a855f7', fields: [
      { key: 'Source Port', value: selectedPacket.port > 1024 ? '54321' : selectedPacket.port.toString() },
      { key: 'Destination Port', value: selectedPacket.port.toString() },
      { key: 'Sequence', value: '0x' + Math.floor(Math.random() * 0xffffffff).toString(16) },
      { key: 'Window Size', value: '64240' },
      { key: 'Flags', value: 'SYN, ACK' },
    ]},
    { name: 'Application', protocol: selectedPacket.protocol, color: '#22c55e', fields: [
      { key: 'Payload Size', value: formatBytes(selectedPacket.size) },
      { key: 'Content Type', value: 'application/octet-stream' },
      { key: 'Threat Status', value: selectedPacket.threatStatus },
      ...(selectedPacket.threatType ? [{ key: 'Threat Type', value: selectedPacket.threatType }] : []),
    ]},
  ] : [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Packet Analyzer" subtitle="Deep packet inspection and protocol analysis" icon={Package} />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-p">Captured Packets</h3>
            <Badge variant="info" dot>{filtered.length}</Badge>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-m" />
            <input type="text" placeholder="Filter packets..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filtered.map((pkt) => (
              <button
                key={pkt.id}
                onClick={() => setSelectedPacket(pkt)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${selectedPacket?.id === pkt.id ? 'border-lc glow-accent' : 'border-c hover:border-lc'}`}
                style={selectedPacket?.id === pkt.id ? { background: 'var(--accent-glow)' } : { background: 'var(--bg-tertiary)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm text-p">{pkt.protocol}</span>
                  <Badge variant={pkt.threatStatus} size="sm">{pkt.threatStatus}</Badge>
                </div>
                <div className="text-xs font-mono text-s truncate">{pkt.sourceIp} → {pkt.destinationIp}:{pkt.port}</div>
                <div className="text-xs text-m mt-1">{formatBytes(pkt.size)}</div>
              </button>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {selectedPacket ? (
            <>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-p flex items-center gap-2"><Layers className="w-5 h-5 text-accent" /> Protocol Stack</h3>
                  <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export PCAP</Button>
                </div>
                <div className="space-y-3">
                  {layers.map((layer, i) => (
                    <div key={i} className="rounded-xl bg-tertiary overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-c">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-m" />
                          <span className="font-medium text-p">{layer.name}</span>
                          <span className="text-xs text-m">· {layer.protocol}</span>
                        </div>
                        <div className="w-2 h-2 rounded-full" style={{ background: layer.color }} />
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-2">
                        {layer.fields.map((f, j) => (
                          <div key={j} className="flex justify-between text-sm">
                            <span className="text-m">{f.key}</span>
                            <span className="font-mono text-p text-right">{f.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold text-p flex items-center gap-2 mb-4"><Hexagon className="w-5 h-5 text-accent" /> Hex Dump</h3>
                <div className="font-mono text-xs space-y-1 bg-tertiary p-4 rounded-xl overflow-x-auto">
                  {hexDump.map((line, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-m">{line.offset}</span>
                      <span className="text-p flex-1">{line.hex}</span>
                      <span className="text-s">{line.ascii}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {selectedPacket.threatStatus !== 'safe' && (
                <Card className="glow-error border-red-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-p">AI Threat Analysis</h3>
                    <Badge variant={selectedPacket.threatStatus} dot>{selectedPacket.threatStatus}</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-tertiary">
                      <div className="text-xs text-m mb-1">Detected Threat</div>
                      <div className="text-lg font-semibold text-p">{selectedPacket.threatType}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-tertiary">
                      <div className="text-xs text-m mb-1">AI Confidence</div>
                      <div className="text-lg font-semibold text-p font-mono">{selectedPacket.confidence}%</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-p">AI Explanation</span>
                    </div>
                    <p className="text-sm text-s leading-relaxed">
                      This packet exhibits {selectedPacket.threatType?.toLowerCase()} patterns. The AI model identified anomalous
                      protocol behavior with {selectedPacket.confidence}% confidence based on payload inspection, header analysis,
                      and traffic pattern correlation. Recommended action: block source IP and investigate connected sessions.
                    </p>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-tertiary flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-m" />
                </div>
                <h3 className="text-lg font-semibold text-p mb-2">Select a Packet to Analyze</h3>
                <p className="text-sm text-s">Click any packet from the list to view deep inspection details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
