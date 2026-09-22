import { useEffect, useState } from 'react';
import { Brain, Shield, Target, Cpu, Zap, AlertTriangle, CheckCircle, Eye, Bot, Sparkles, TrendingUp, Lock, Ban, ShieldX, PackageSearch } from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '../components/ui';
import { PageHeader } from './Dashboard';
import { Gauge, DonutChart, BarChart } from '../components/Charts';
import { ATTACK_TYPES } from '../lib/mockData';
import type { Severity } from '../types';

interface DetectionResult {
  threatType: string;
  category: string;
  confidence: number;
  riskScore: number;
  riskLevel: Severity;
  recommendation: string;
  description: string;
  affectedDevice: string;
  status: 'active' | 'blocked' | 'ignored' | 'quarantined';
}

const RECOMMENDATIONS: Record<string, string> = {
  'DDoS Attack': 'Activate rate limiting on edge firewalls. Enable DDoS protection service. Block offending source IPs and monitor bandwidth utilization.',
  'Port Scan': 'Block source IP temporarily. Review firewall rules to ensure only necessary ports are exposed. Enable port scan detection alerts.',
  'SQL Injection': 'Block source IP immediately. Review and sanitize all database input parameters. Enable WAF rules for SQL injection patterns.',
  'Brute Force': 'Enable account lockout policy. Implement CAPTCHA on login forms. Block source IP and review failed authentication logs.',
  'Malware C2': 'Isolate infected host from network immediately. Block C2 server IP at firewall. Run full malware scan and preserve forensic evidence.',
  'Botnet': 'Block botnet IP range. Implement bot detection challenge (CAPTCHA). Review traffic patterns for additional infected hosts.',
  'Ransomware': 'Isolate affected systems from network immediately. Disable file sharing. Activate incident response plan and preserve forensic snapshots.',
  'Phishing': 'Block phishing domain at DNS level. Alert users about the phishing campaign. Review email security gateway logs for similar attempts.',
  'Trojan': 'Isolate infected host. Quarantine the system. Run full anti-malware scan. Review network logs for data exfiltration. Rebuild from known-good image.',
  'Worm': 'Segment network to prevent spread. Apply security patches to all systems. Block exploitation vectors at firewall. Scan all endpoints.',
  'Spyware': 'Isolate affected device. Remove spyware using anti-malware tools. Review data access logs for exfiltration. Update endpoint protection policies.',
  'DNS Spoofing': 'Flush DNS caches. Enable DNSSEC. Review DNS server configurations for unauthorized changes. Block rogue DNS responses.',
  'ARP Spoofing': 'Enable port security on network switches. Configure DHCP snooping and ARP inspection. Identify and isolate the spoofing device.',
  'MITM Attack': 'Enforce TLS for all connections. Review SSL/TLS certificate validation. Identify rogue access points or compromised network devices.',
  'Insider Threat': 'Review user access logs and data exfiltration patterns. Escalate to security team for behavioral analysis. Restrict access pending review.',
  'XSS Attempt': 'Block source IP. Review and sanitize all user input in web applications. Enable WAF XSS protection rules.',
  'Zero-Day Exploit': 'Isolate affected system immediately. Apply virtual patch at WAF. Escalate to security research team for vulnerability analysis.',
  'Data Exfiltration': 'Block destination IP immediately. Review DLP policies. Audit affected user access. Preserve forensic network captures for investigation.',
  'Beaconing': 'Block C2 destination IP. Quarantine the beaconing host. Investigate for additional compromised systems. Run full malware scan.',
  'Credential Stuffing': 'Enable rate limiting on auth endpoints. Implement account lockout after failed attempts. Block source IP. Force password resets for affected accounts.',
};

const AFFECTED_DEVICES = ['WEB-SRV-01', 'DB-SRV-02', 'APP-SRV-03', 'CORE-RTR-01', 'FW-EDGE-01', 'WS-JOHN-PC', 'IOT-CAM-03', 'CLOUD-AWS-01'];

export function AIThreatDetection() {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [history, setHistory] = useState<DetectionResult[]>([]);
  const [allThreats, setAllThreats] = useState<DetectionResult[]>([]);

  const runScan = () => {
    setScanning(true);
    setScanProgress(0);
    setResult(null);

    const progressInterval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          const attack = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
          const confidence = Math.floor(Math.random() * 20 + 80);
          const riskScore = Math.floor(Math.random() * 30 + 70);
          const newResult: DetectionResult = {
            threatType: attack.name,
            category: attack.category,
            confidence,
            riskScore,
            riskLevel: attack.severity,
            recommendation: RECOMMENDATIONS[attack.name] || 'Investigate and escalate to security team.',
            description: attack.description,
            affectedDevice: AFFECTED_DEVICES[Math.floor(Math.random() * AFFECTED_DEVICES.length)],
            status: 'active',
          };
          setResult(newResult);
          setHistory((prev) => [newResult, ...prev].slice(0, 8));
          setScanning(false);
          return 100;
        }
        return p + 2;
      });
    }, 50);
  };

  useEffect(() => {
    runScan();
    setAllThreats(ATTACK_TYPES.map((a, i) => ({
      threatType: a.name,
      category: a.category,
      confidence: Math.floor(Math.random() * 25 + 70),
      riskScore: Math.floor(Math.random() * 40 + 50),
      riskLevel: a.severity,
      recommendation: RECOMMENDATIONS[a.name] || 'Investigate and escalate to security team.',
      description: a.description,
      affectedDevice: AFFECTED_DEVICES[i % AFFECTED_DEVICES.length],
      status: 'active' as const,
    })));
  }, []);

  const updateThreatStatus = (threatType: string, status: DetectionResult['status']) => {
    setAllThreats((prev) => prev.map((t) => t.threatType === threatType ? { ...t, status } : t));
    if (result?.threatType === threatType) setResult({ ...result, status });
  };

  const modelBreakdown = [
    { label: 'Random Forest', value: 94, color: '#00d9ff' },
    { label: 'LSTM Neural Net', value: 91, color: '#a855f7' },
    { label: 'Isolation Forest', value: 87, color: '#22c55e' },
    { label: 'XGBoost', value: 95, color: '#f97316' },
  ];

  const threatCategories = [
    { label: 'Volumetric', value: 45, color: '#ef4444' },
    { label: 'Web Attack', value: 32, color: '#f97316' },
    { label: 'Malware', value: 28, color: '#eab308' },
    { label: 'Reconnaissance', value: 18, color: '#00d9ff' },
    { label: 'Credential', value: 15, color: '#a855f7' },
  ];

  const severityColor = (s: Severity) => s === 'critical' ? '#ef4444' : s === 'high' ? '#f97316' : s === 'medium' ? '#eab308' : '#22c55e';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="AI Threat Detection" subtitle="Machine learning-powered real-time threat classification" icon={Brain} />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-p flex items-center gap-2">
                  <Brain className="w-5 h-5 text-accent" /> AI Model Prediction
                </h3>
                <p className="text-sm text-m">Deep learning classification engine</p>
              </div>
              <Badge variant="info" dot>Active</Badge>
            </div>

            {scanning ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-tertiary" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 spin-slow" />
                  <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-500 spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
                  <Brain className="absolute inset-0 m-auto w-10 h-10 text-accent" />
                </div>
                <p className="text-lg font-medium text-p mb-2">AI Analyzing Network Traffic...</p>
                <p className="text-sm text-m mb-4">Running deep learning inference on packet features</p>
                <div className="w-full max-w-xs">
                  <ProgressBar value={scanProgress} color="var(--accent)" />
                  <p className="text-center text-xs text-m mt-2 font-mono">{scanProgress}%</p>
                </div>
              </div>
            ) : result ? (
              <div className="fade-in-up">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{
                    background: `${severityColor(result.riskLevel)}25`,
                    color: severityColor(result.riskLevel),
                  }}>
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-xl font-bold text-p">{result.threatType}</h4>
                      <Badge variant={result.riskLevel} dot>{result.riskLevel}</Badge>
                    </div>
                    <p className="text-sm text-s">{result.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-tertiary">
                    <div className="text-xs text-m mb-1">Category</div>
                    <div className="text-sm font-semibold text-p">{result.category}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-tertiary">
                    <div className="text-xs text-m mb-1">Risk Level</div>
                    <div className="text-sm font-semibold capitalize" style={{ color: severityColor(result.riskLevel) }}>{result.riskLevel}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-tertiary">
                    <div className="text-xs text-m mb-1">Risk Score</div>
                    <div className="text-sm font-semibold font-mono text-p">{result.riskScore}/100</div>
                  </div>
                  <div className="p-3 rounded-xl bg-tertiary">
                    <div className="text-xs text-m mb-1">Affected Device</div>
                    <div className="text-sm font-semibold font-mono text-p">{result.affectedDevice}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-tertiary mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-s">AI Confidence Score</span>
                    <span className="text-2xl font-bold font-mono text-p">{result.confidence}%</span>
                  </div>
                  <ProgressBar value={result.confidence} color={result.confidence > 90 ? '#ef4444' : result.confidence > 75 ? '#eab308' : '#22c55e'} />
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-600/5 border border-c mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-p">AI Recommendation</span>
                  </div>
                  <p className="text-sm text-s leading-relaxed">{result.recommendation}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="danger" onClick={() => updateThreatStatus(result.threatType, 'blocked')}>
                    <Ban className="w-4 h-4" /> Block
                  </Button>
                  <Button variant="secondary" onClick={() => updateThreatStatus(result.threatType, 'ignored')}>
                    <Eye className="w-4 h-4" /> Ignore
                  </Button>
                  <Button variant="secondary" onClick={() => updateThreatStatus(result.threatType, 'quarantined')}>
                    <ShieldX className="w-4 h-4" /> Quarantine
                  </Button>
                  <Button variant="secondary" onClick={runScan}>
                    <Zap className="w-4 h-4" /> New Scan
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-p mb-4">AI Confidence Score</h3>
            <Gauge value={result?.confidence || 97} label="Detection Confidence" color={result && result.confidence > 90 ? '#ef4444' : '#22c55e'} />
          </Card>

          <Card>
            <h3 className="font-semibold text-p mb-4">Model Performance</h3>
            <div className="space-y-3">
              {modelBreakdown.map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-s">{m.label}</span>
                    <span className="text-sm font-mono text-p">{m.value}%</span>
                  </div>
                  <ProgressBar value={m.value} color={m.color} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-p mb-4">Threat Category Distribution</h3>
          <DonutChart data={threatCategories} centerValue="138" centerLabel="Total Detections" />
        </Card>

        <Card>
          <h3 className="font-semibold text-p mb-4">Detection by Attack Type</h3>
          <BarChart data={ATTACK_TYPES.slice(0, 8).map((a, i) => ({
            label: a.name.split(' ')[0],
            value: Math.floor(Math.random() * 50 + 10),
            color: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#00d9ff', '#a855f7', '#06b6d4', '#f472b6'][i],
          }))} height={200} />
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-p mb-4">All Detected Threats ({allThreats.length})</h3>
        <div className="space-y-3">
          {allThreats.map((t, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-xl bg-tertiary gap-3 fade-in">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                  background: `${severityColor(t.riskLevel)}25`,
                  color: severityColor(t.riskLevel),
                }}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-p truncate">{t.threatType}</div>
                  <div className="text-xs text-m truncate">{t.category} · {t.affectedDevice}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-xs text-m">Confidence</div>
                  <div className="text-sm font-mono text-p">{t.confidence}%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-m">Risk</div>
                  <div className="text-sm font-mono text-p">{t.riskScore}</div>
                </div>
                <Badge variant={t.riskLevel} size="sm">{t.riskLevel}</Badge>
                {t.status === 'active' ? (
                  <div className="flex gap-1">
                    <button onClick={() => updateThreatStatus(t.threatType, 'blocked')} className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors" title="Block">
                      <Ban className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => updateThreatStatus(t.threatType, 'ignored')} className="p-1.5 rounded-lg bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25 transition-colors" title="Ignore">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => updateThreatStatus(t.threatType, 'quarantined')} className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 transition-colors" title="Quarantine">
                      <ShieldX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <Badge variant={t.status === 'blocked' ? 'critical' : t.status === 'quarantined' ? 'high' : 'medium'} size="sm">{t.status}</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-p mb-4">Recent AI Detections</h3>
        <div className="space-y-3">
          {history.map((h, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-tertiary fade-in">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{
                  background: `${severityColor(h.riskLevel)}25`,
                  color: severityColor(h.riskLevel),
                }}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-p">{h.threatType}</div>
                  <div className="text-xs text-m">{h.category} · {h.affectedDevice}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-s">{h.confidence}%</span>
                <Badge variant={h.riskLevel}>{h.riskLevel}</Badge>
              </div>
            </div>
          ))}
          {history.length === 0 && <div className="text-center text-m py-6">No detections yet</div>}
        </div>
      </Card>
    </div>
  );
}
