import { useEffect, useState } from 'react';
import { TrendingUp, Brain, AlertTriangle, Target, Clock, Zap, Activity, Eye, Cpu, Sparkles, Calendar } from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '../components/ui';
import { PageHeader } from './Dashboard';
import { LineChart, BarChart, Heatmap, Gauge } from '../components/Charts';
import { generateTimeSeriesData } from '../lib/mockData';

interface Prediction {
  attackType: string;
  probability: number;
  timeframe: string;
  targetSystem: string;
  reasoning: string;
  confidence: number;
}

const PREDICTIONS: Prediction[] = [
  { attackType: 'DDoS Volumetric Attack', probability: 78, timeframe: 'Next 24 hours', targetSystem: 'Web Servers (DMZ)', reasoning: 'Increasing SYN flood probes from botnet IPs over the past 6 hours. Historical pattern matches pre-attack reconnaissance phase.', confidence: 82 },
  { attackType: 'Credential Brute Force', probability: 64, timeframe: 'Next 12 hours', targetSystem: 'SSH Servers, VPN Portal', reasoning: 'Sustained authentication failures from distributed IPs. Pattern consistent with credential stuffing toolkit.', confidence: 71 },
  { attackType: 'Lateral Movement (Ransomware)', probability: 45, timeframe: 'Next 48 hours', targetSystem: 'Internal File Servers', reasoning: 'Anomalous SMB traffic patterns detected. Increased port 445 scanning activity from internal host.', confidence: 58 },
  { attackType: 'SQL Injection', probability: 38, timeframe: 'Next 6 hours', targetSystem: 'Web Application Layer', reasoning: 'Web traffic containing encoded SQL keywords detected. Automated scanner fingerprint in user-agent strings.', confidence: 52 },
  { attackType: 'DNS Tunneling Exfiltration', probability: 28, timeframe: 'Next 72 hours', targetSystem: 'DNS Infrastructure', reasoning: 'Unusual DNS query lengths and TXT record frequency. Pattern matches known DNS exfiltration toolkits.', confidence: 45 },
];

const PATTERN_TIMELINE = [
  { phase: 'Reconnaissance', duration: '0-6h', status: 'active', icon: Eye },
  { phase: 'Initial Access', duration: '6-12h', status: 'predicted', icon: Target },
  { phase: 'Privilege Escalation', duration: '12-24h', status: 'predicted', icon: Cpu },
  { phase: 'Lateral Movement', duration: '24-48h', status: 'predicted', icon: Activity },
  { phase: 'Data Exfiltration', duration: '48-72h', status: 'predicted', icon: TrendingUp },
];

export function AIAttackPrediction() {
  const [predictionData, setPredictionData] = useState<number[]>(() => generateTimeSeriesData(30, 50, 60));
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction>(PREDICTIONS[0]);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPredictionData((prev) => [...prev.slice(1), Math.floor(Math.random() * 60 + 20)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress((p) => (p >= 100 ? 0 : p + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="AI Attack Prediction" subtitle="Predictive analytics for proactive threat prevention" icon={TrendingUp} />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-p flex items-center gap-2"><Brain className="w-5 h-5 text-accent" /> Predictive Threat Model</h3>
              <p className="text-sm text-m">Attack probability forecast based on behavioral patterns</p>
            </div>
            <Badge variant="info" dot>Predicting</Badge>
          </div>
          <LineChart data={predictionData} color="#a855f7" height={220} />
          <div className="mt-4 p-3 rounded-xl bg-tertiary">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-s flex items-center gap-2"><Cpu className="w-4 h-4" /> Pattern Analysis Progress</span>
              <span className="text-sm font-mono text-p">{analysisProgress}%</span>
            </div>
            <ProgressBar value={analysisProgress} color="var(--accent)" />
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-p mb-4">Threat Probability Index</h3>
          <Gauge value={78} label="Elevated Risk" color="#f97316" size={160} />
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-tertiary">
              <span className="text-sm text-s">Predictions Active</span>
              <span className="text-sm font-mono text-p">5</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-tertiary">
              <span className="text-sm text-s">Model Accuracy</span>
              <span className="text-sm font-mono text-green-400">87.3%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-tertiary">
              <span className="text-sm text-s">Patterns Analyzed</span>
              <span className="text-sm font-mono text-p">1,247</span>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-p mb-6">AI Attack Predictions</h3>
        <div className="grid lg:grid-cols-2 gap-4">
          {PREDICTIONS.map((pred, i) => (
            <div
              key={i}
              onClick={() => setSelectedPrediction(pred)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedPrediction === pred ? 'border-lc glow-accent' : 'border-c hover:border-lc'}`}
              style={selectedPrediction === pred ? { background: 'var(--accent-glow)' } : { background: 'var(--bg-tertiary)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                    background: pred.probability > 60 ? 'rgba(220,38,38,0.15)' : pred.probability > 40 ? 'rgba(249,115,22,0.15)' : 'rgba(234,179,8,0.15)',
                    color: pred.probability > 60 ? '#ef4444' : pred.probability > 40 ? '#f97316' : '#eab308',
                  }}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-p">{pred.attackType}</div>
                    <div className="text-xs text-m flex items-center gap-1"><Clock className="w-3 h-3" /> {pred.timeframe}</div>
                  </div>
                </div>
                <span className="text-2xl font-bold font-mono" style={{
                  color: pred.probability > 60 ? '#ef4444' : pred.probability > 40 ? '#f97316' : '#eab308',
                }}>{pred.probability}%</span>
              </div>
              <ProgressBar value={pred.probability} color={pred.probability > 60 ? '#ef4444' : pred.probability > 40 ? '#f97316' : '#eab308'} />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-m">Target: <span className="text-s">{pred.targetSystem}</span></span>
                <Badge variant={pred.probability > 60 ? 'critical' : pred.probability > 40 ? 'high' : 'medium'}>{pred.confidence}% conf.</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {selectedPrediction && (
        <Card className="fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-p">AI Analysis: {selectedPrediction.attackType}</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-tertiary">
              <div className="text-xs text-m mb-1">Probability</div>
              <div className="text-2xl font-bold text-p font-mono">{selectedPrediction.probability}%</div>
            </div>
            <div className="p-4 rounded-xl bg-tertiary">
              <div className="text-xs text-m mb-1">Timeframe</div>
              <div className="text-2xl font-bold text-p">{selectedPrediction.timeframe}</div>
            </div>
            <div className="p-4 rounded-xl bg-tertiary">
              <div className="text-xs text-m mb-1">Target System</div>
              <div className="text-lg font-semibold text-p">{selectedPrediction.targetSystem}</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border border-c">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-p">AI Reasoning</span>
            </div>
            <p className="text-sm text-s leading-relaxed">{selectedPrediction.reasoning}</p>
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="primary"><Zap className="w-4 h-4" /> Implement Preventive Controls</Button>
            <Button variant="secondary"><Eye className="w-4 h-4" /> View Attack Simulation</Button>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-p mb-4">AI Attack Pattern Recognition</h3>
          <div className="space-y-3">
            {PATTERN_TIMELINE.map((phase, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${phase.status === 'active' ? 'glow-accent' : ''}`} style={{
                  background: phase.status === 'active' ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                  color: phase.status === 'active' ? 'var(--accent)' : 'var(--text-muted)',
                }}>
                  <phase.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-p">{phase.phase}</span>
                    <span className="text-xs text-m font-mono">{phase.duration}</span>
                  </div>
                  <div className="h-1 rounded-full bg-tertiary mt-1.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                      width: phase.status === 'active' ? '100%' : '0%',
                      background: phase.status === 'active' ? 'var(--accent)' : 'var(--border-light)',
                    }} />
                  </div>
                </div>
                {phase.status === 'active' && <Badge variant="info" dot>Active</Badge>}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-p mb-4">Predictive Risk Heatmap</h3>
          <Heatmap rows={8} cols={14} />
          <div className="flex items-center justify-between mt-3 text-xs text-m">
            <span>Low Probability</span>
            <span>High Probability</span>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-tertiary">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-p">7-Day Forecast</span>
            </div>
            <p className="text-xs text-s">Risk elevated through Friday. Recommend increasing monitoring sensitivity and preparing incident response resources.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
