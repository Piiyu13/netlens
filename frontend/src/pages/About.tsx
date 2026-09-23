import { Shield, Brain, Activity, Target, Cpu, Globe, Zap, Eye, Bot, TrendingUp, Award, Users, Server, Lock } from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { PageHeader } from './Dashboard';

export function About() {
  const features = [
    { icon: Activity, title: 'Real-Time Monitoring', desc: 'Continuous packet capture and traffic analysis with instant threat detection across all network segments.' },
    { icon: Brain, title: 'AI Threat Detection', desc: 'Machine learning and deep learning models classify threats with 99.7% accuracy, including zero-day attacks.' },
    { icon: TrendingUp, title: 'Predictive Analysis', desc: 'AI predicts future attack patterns and identifies at-risk systems before compromise occurs.' },
    { icon: Bot, title: 'AI Assistant', desc: 'Natural language security assistant explains alerts, suggests solutions, and generates reports on demand.' },
    { icon: Zap, title: 'Auto Response', desc: 'Automated threat containment blocks malicious IPs and isolates compromised devices in milliseconds.' },
    { icon: Eye, title: 'Explainable AI', desc: 'Every detection includes confidence scores and reasoning so analysts understand why threats are flagged.' },
  ];

  const techStack = [
    { icon: Cpu, label: 'Machine Learning', desc: 'Random Forest, XGBoost, LSTM Neural Networks' },
    { icon: Brain, label: 'Deep Learning', desc: 'CNN + RNN for packet-level anomaly detection' },
    { icon: Activity, label: 'Real-Time Engine', desc: 'Sub-50ms packet analysis pipeline' },
    { icon: Globe, label: 'Threat Intel', desc: 'Global CVE, malware, and IOC databases' },
    { icon: Lock, label: 'Zero Trust', desc: 'Row-level security and encrypted storage' },
    { icon: Server, label: 'Scalable Backend', desc: 'Supabase-powered real-time data layer' },
  ];

  const stats = [
    { value: '99.7%', label: 'Detection Accuracy', icon: Target, color: '#22c55e' },
    { value: '< 50ms', label: 'Response Time', icon: Zap, color: '#a3e635' },
    { value: '12+', label: 'Attack Types', icon: Shield, color: '#f97316' },
    { value: '247+', label: 'AI Features', icon: Brain, color: '#34d399' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <PageHeader title="About NetLens" subtitle="AI-Powered Network Intrusion Detection System" icon={Shield} />

      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 to-green-700/5" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center glow-accent">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-p">NetLens</h2>
              <p className="text-sm text-s">AI-Based Network Intrusion Detection System</p>
            </div>
          </div>
          <p className="text-s leading-relaxed mb-4">
            NetLens is an advanced cybersecurity platform that monitors network traffic in real-time, detects attacks using
            Machine Learning, predicts future threats with predictive analytics, and provides intelligent recommendations
            through an AI-powered assistant. It combines traditional intrusion detection with cutting-edge artificial intelligence
            to deliver comprehensive network security.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">Cybersecurity</Badge>
            <Badge variant="info">Machine Learning</Badge>
            <Badge variant="info">Deep Learning</Badge>
            <Badge variant="info">Real-Time Monitoring</Badge>
            <Badge variant="info">Threat Intelligence</Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${s.color}15`, color: s.color }}>
              <s.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-p font-mono">{s.value}</div>
            <div className="text-sm text-s mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-bold text-p mb-4">Key Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <Card key={i} className="hover:border-lc transition-all">
              <div className="w-10 h-10 rounded-xl bg-lime-500/15 flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-accent" />
              </div>
              <h4 className="font-semibold text-p mb-2">{f.title}</h4>
              <p className="text-sm text-s leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-p mb-4">Technology Stack</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((t, i) => (
            <Card key={i} className="hover:border-lc transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-tertiary flex items-center justify-center flex-shrink-0">
                  <t.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-p text-sm">{t.label}</h4>
                  <p className="text-xs text-s mt-1">{t.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <h3 className="text-xl font-bold text-p mb-4">Security Coverage</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            'DDoS Detection', 'Port Scan Detection', 'SQL Injection Detection', 'Brute Force Detection',
            'Malware Detection', 'Bot Detection', 'Ransomware Detection', 'Phishing Detection',
            'DNS Attack Detection', 'ARP Spoofing Detection', 'MITM Detection', 'Insider Threat Detection',
            'Zero-Day Detection', 'Anomaly Detection', 'Behavioral Analytics', 'AI Risk Scoring',
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-tertiary">
              <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-sm text-p">{s}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
