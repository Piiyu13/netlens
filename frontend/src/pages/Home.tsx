import { useEffect, useRef, useState, useMemo } from 'react';
import { Shield, Activity, Brain, Globe, Zap, Lock, Cpu, Radar, AlertTriangle, TrendingUp, Eye, Bot, ChevronRight, ArrowRight, Target, Star, HelpCircle, ChevronDown, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui';

interface NetworkAnimationProps {
  onNavigate: (path: string) => void;
}

export function Home({ onNavigate }: NetworkAnimationProps) {
  return (
    <div className="bg-base">
      <HeroSection onNavigate={onNavigate} />
      <FeaturesSection />
      <AISection />
      <SecuritySection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection onNavigate={onNavigate} />
      <FAQSection />
      <CTASection onNavigate={onNavigate} />
      <FooterSection />
    </div>
  );
}

function NetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<{ x: number; y: number; vx: number; vy: number; type: 'core' | 'node' | 'threat' }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = canvas.width = canvas.offsetWidth * 2;
    let h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;

    const nodeCount = 24;
    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      type: Math.random() > 0.85 ? 'threat' : Math.random() > 0.6 ? 'core' : 'node',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const nodes = nodesRef.current;

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.3;
            const isThreat = nodes[i].type === 'threat' || nodes[j].type === 'threat';
            ctx.strokeStyle = isThreat ? `rgba(239,68,68,${opacity})` : `rgba(0,217,255,${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        const color = n.type === 'threat' ? '#ef4444' : n.type === 'core' ? '#a3e635' : '#16a34a';
        const size = n.type === 'core' ? 5 : n.type === 'threat' ? 4 : 3;
        ctx.fillStyle = color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      w = canvas.width = canvas.offsetWidth * 2;
      h = canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function LiveAttackCounter() {
  const [count, setCount] = useState(12847);
  useEffect(() => {
    const interval = setInterval(() => setCount((c) => c + Math.floor(Math.random() * 5 + 1)), 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex items-center gap-4 mt-8 fade-in-up" style={{ animationDelay: '0.6s' }}>
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
        <span className="w-2 h-2 rounded-full bg-red-400 pulse-dot" />
        <span className="text-sm text-s">Attacks Blocked Today:</span>
        <span className="text-lg font-bold text-p font-mono">{count.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
        <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
        <span className="text-sm text-s">AI Accuracy:</span>
        <span className="text-lg font-bold text-green-400 font-mono">99.7%</span>
      </div>
    </div>
  );
}

function HeroSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Real-time network intrusion detection powered by AI';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0">
        <NetworkAnimation />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-primary)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="flex items-start gap-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
            <span className="text-sm text-s font-medium">AI Engine Active · Monitoring in Real-Time</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-p">Net</span>
            <span className="text-gradient-cyber">Lens</span>
          </h1>

          <p className="text-xl md:text-2xl text-s mb-2 font-medium fade-in-up" style={{ animationDelay: '0.2s' }}>
            AI-Powered Network Intrusion Detection System
          </p>
          <p className="text-lg text-m mb-8 fade-in-up blink-cursor" style={{ animationDelay: '0.3s' }}>
            {typedText}
          </p>

          <div className="flex flex-wrap gap-4 fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" onClick={() => onNavigate('/dashboard')}>
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => onNavigate('/monitoring')}>
              <Activity className="w-5 h-5" /> Live Demo
            </Button>
          </div>

          <LiveAttackCounter />

          <div className="flex flex-wrap gap-6 mt-12 fade-in-up" style={{ animationDelay: '0.5s' }}>
            {[
              { icon: Brain, label: 'ML Detection' },
              { icon: Zap, label: 'Real-Time Analysis' },
              { icon: Shield, label: 'Zero-Day Defense' },
              { icon: Cpu, label: 'Deep Learning' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-s">
                <f.icon className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block w-[480px] flex-shrink-0 fade-in-up" style={{ animationDelay: '0.4s' }}>
          <TerminalAnimation />
          <div className="mt-6">
            <p className="text-xs text-m mb-3 text-center">Trusted by security teams at</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {['TechCorp', 'FinEdge', 'HealthGuard', 'CloudSec', 'DataShield'].map((c) => (
                <span key={c} className="text-sm font-semibold text-m hover:text-s transition-colors cursor-default">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: Activity, title: 'Real-Time Packet Capture', desc: 'Monitor live network traffic with protocol analysis and device discovery', color: '#a3e635' },
    { icon: Radar, title: 'Live Traffic Monitoring', desc: 'Continuous surveillance of all network flows with instant anomaly flagging', color: '#16a34a' },
    { icon: Globe, title: 'Protocol Analysis', desc: 'Deep inspection of TCP, UDP, HTTP, DNS, SSH and 50+ protocols', color: '#0891b2' },
    { icon: Cpu, title: 'Device Discovery', desc: 'Automatic identification and profiling of all connected network devices', color: '#0e7490' },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <SectionHeader icon={Activity} title="Network Monitoring" subtitle="Comprehensive real-time visibility into your network infrastructure" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div key={i} className="card p-6 group hover:border-lc transition-all duration-300 fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${f.color}20`, color: f.color }}>
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-p mb-2">{f.title}</h3>
            <p className="text-sm text-s leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AISection() {
  const features = [
    { icon: Brain, title: 'AI Threat Detection', desc: 'Machine Learning classification with deep learning detection models identify known and unknown threats', color: '#a3e635' },
    { icon: AlertTriangle, title: 'Zero-Day Attack Detection', desc: 'Behavioral anomaly detection catches previously unseen attacks without signatures', color: '#f97316' },
    { icon: TrendingUp, title: 'AI Threat Prediction', desc: 'Predictive models forecast attack patterns and identify at-risk systems before compromise', color: '#34d399' },
    { icon: Cpu, title: 'AI Risk Score', desc: 'Dynamic risk scoring aggregates hundreds of signals into a single actionable confidence metric', color: '#16a34a' },
    { icon: Bot, title: 'AI Security Chatbot', desc: 'Natural language security assistant explains alerts, suggests solutions, and analyzes logs', color: '#22c55e' },
    { icon: Zap, title: 'AI Auto Response', desc: 'Automated threat containment blocks malicious IPs and isolates compromised devices instantly', color: '#ef4444' },
  ];

  return (
    <section className="py-24 px-6 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto">
        <SectionHeader icon={Brain} title="AI Features" subtitle="Advanced artificial intelligence for autonomous threat detection and response" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card p-6 group hover:border-lc transition-all duration-300 fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ background: `${f.color}20`, color: f.color }}>
                  <f.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-p mb-2">{f.title}</h3>
                  <p className="text-sm text-s leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecuritySection() {
  const threats = [
    'DDoS Detection', 'Port Scan Detection', 'SQL Injection Detection', 'Brute Force Detection',
    'Malware Detection', 'Bot Detection', 'Ransomware Detection', 'Phishing Detection',
    'DNS Attack Detection', 'ARP Spoofing Detection', 'MITM Detection', 'Insider Threat Detection',
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <SectionHeader icon={Shield} title="Cyber Security Features" subtitle="Detection engines for the full spectrum of network attack vectors" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {threats.map((t, i) => (
          <div key={i} className="card p-4 flex items-center gap-3 group hover:border-lc transition-all fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-sm font-medium text-p">{t}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = useMemo(() => [
    { value: '99.7%', label: 'Detection Accuracy', icon: Target, color: '#22c55e' },
    { value: '< 50ms', label: 'Response Time', icon: Zap, color: '#a3e635' },
    { value: '20+', label: 'Attack Types Detected', icon: Shield, color: '#f97316' },
    { value: '24/7', label: 'AI Monitoring', icon: Eye, color: '#34d399' },
  ], []);

  return (
    <section className="py-24 px-6 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${s.color}20`, color: s.color }}>
                <s.icon className="w-7 h-7" />
              </div>
              <div className="text-4xl font-bold text-p font-mono mb-2">{s.value}</div>
              <div className="text-sm text-s">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="card p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 to-green-700/5" />
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center mx-auto mb-6 glow-accent">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-p mb-4">Ready to Secure Your Network?</h2>
          <p className="text-lg text-s mb-8 max-w-2xl mx-auto">
            Deploy NetLens AI-powered intrusion detection and gain real-time visibility, predictive threat analysis, and autonomous response capabilities.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" onClick={() => onNavigate('/dashboard')}>
              View Dashboard <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => onNavigate('/threat-detection')}>
              <Brain className="w-5 h-5" /> Explore AI Features
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tertiary mb-4">
        <Icon className="w-4 h-4 text-accent" />
        <span className="text-sm text-s font-medium">{title}</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-p mb-3">{title}</h2>
      <p className="text-lg text-s max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
}

function TerminalAnimation() {
  const [lines, setLines] = useState<string[]>([]);
  const fullLines = [
    '$ netlens --start --ai-engine',
    '> Initializing AI models...',
    '> Loading Random Forest classifier... OK',
    '> Loading LSTM neural network... OK',
    '> Loading Isolation Forest... OK',
    '> Calibrating deep learning model... OK',
    '> Starting packet capture on eth0...',
    '> [ALERT] DDoS attack detected from 45.227.255.206',
    '> AI confidence: 97.3% | Action: AUTO-BLOCK',
    '> [ALERT] SQL injection attempt from 185.220.101.45',
    '> AI confidence: 92.1% | Action: AUTO-BLOCK',
    '> [INFO] 1,247 packets analyzed in 42ms',
    '> [INFO] Detection accuracy: 99.7%',
    '> [INFO] False positive rate: 0.3%',
    '> NetLens AI Engine: ACTIVE',
    '> Monitoring 47 devices across 3 subnets...',
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullLines.length) {
        setLines((prev) => [...prev, fullLines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card p-5 bg-secondary font-mono text-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-c">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-400" />
        <span className="text-xs text-m ml-2">netlens@security-ops: ~/monitoring</span>
      </div>
      <div className="space-y-1 min-h-[280px]">
        {lines.map((line, i) => {
          if (typeof line !== 'string') return null;
          let color = 'var(--text-secondary)';
          if (line.includes('[ALERT]')) color = '#f87171';
          else if (line.includes('[INFO]')) color = '#4ade80';
          else if (line.startsWith('$')) color = '#a3e635';
          return <div key={i} className="text-xs fade-in" style={{ color }}>{line}</div>;
        })}
        {lines.length < fullLines.length && <span className="blink-cursor text-xs text-accent" />}
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { name: 'James Carter', role: 'CISO, TechCorp', text: 'NetLens transformed our security operations. The AI detection accuracy is unmatched - we catch threats our previous SIEM completely missed.', avatar: 'J' },
    { name: 'Priya Sharma', role: 'Security Lead, FinEdge', text: 'The predictive analytics feature alone justified the investment. We prevented 3 major attacks before they happened.', avatar: 'P' },
    { name: 'Michael Chen', role: 'IT Director, HealthGuard', text: 'Real-time monitoring with AI explanations gives our team confidence. The chat assistant is like having a 24/7 security expert.', avatar: 'M' },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <SectionHeader icon={Star} title="Testimonials" subtitle="Trusted by security teams worldwide" />
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="card p-6 fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
            </div>
            <p className="text-sm text-s leading-relaxed mb-4">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white font-semibold">{t.avatar}</div>
              <div><div className="text-sm font-medium text-p">{t.name}</div><div className="text-xs text-m">{t.role}</div></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const plans = [
    { name: 'Starter', price: '$49', period: '/month', desc: 'For small teams getting started with AI security', features: ['Up to 10 devices', 'Real-time monitoring', 'AI threat detection', 'Email alerts', '7-day log retention', 'Community support'], color: '#a3e635', popular: false },
    { name: 'Professional', price: '$199', period: '/month', desc: 'For growing security teams', features: ['Up to 50 devices', 'Everything in Starter', 'AI attack prediction', 'AI chat assistant', 'Custom reports', '30-day log retention', 'Priority support'], color: '#34d399', popular: true },
    { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large organizations', features: ['Unlimited devices', 'Everything in Professional', 'Custom AI models', 'API access', 'Unlimited retention', 'Dedicated support', 'SLA guarantee'], color: '#f97316', popular: false },
  ];

  return (
    <section className="py-24 px-6 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto">
        <SectionHeader icon={Zap} title="Pricing" subtitle="Choose the plan that fits your security needs" />
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`card p-6 relative fade-in-up ${plan.popular ? 'border-lc glow-accent' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-lime-400 text-xs font-semibold text-[#071026]">Most Popular</div>}
              <h3 className="text-lg font-semibold text-p mb-1">{plan.name}</h3>
              <p className="text-sm text-m mb-4">{plan.desc}</p>
              <div className="mb-6"><span className="text-4xl font-bold text-p font-mono">{plan.price}</span><span className="text-sm text-m">{plan.period}</span></div>
              <div className="space-y-2 mb-6">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm text-s"><CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /> {f}</div>
                ))}
              </div>
              <button onClick={() => onNavigate('/dashboard')} className="w-full py-2.5 rounded-xl text-sm font-medium transition-all" style={plan.popular ? { background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))', color: '#0a0e1a' } : { background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: 'How does NetLens AI detection work?', a: 'NetLens uses a multi-layered AI approach: Random Forest for known signatures, LSTM neural networks for sequential patterns, Isolation Forest for anomalies, and deep learning for zero-day detection. The ensemble achieves 99.7% accuracy.' },
    { q: 'Can NetLens detect zero-day attacks?', a: 'Yes. Our behavioral anomaly detection engine identifies deviations from normal network patterns without requiring signatures. This catches previously unseen attacks, including zero-day exploits.' },
    { q: 'How fast is the threat detection?', a: 'NetLens processes and classifies packets in under 50ms. The AI auto-response system can block malicious IPs and quarantine affected devices within milliseconds of detection.' },
    { q: 'Does NetLens support compliance reporting?', a: 'Yes. NetLens generates compliance reports for SOC 2, ISO 27001, PCI DSS, and HIPAA. Reports can be exported as PDF, Excel, or CSV with full audit trails.' },
    { q: 'Can I integrate NetLens with my existing tools?', a: 'NetLens supports webhook integrations, REST API access (Enterprise plan), and can forward alerts to SIEMs like Splunk, IBM QRadar, and Microsoft Sentinel.' },
  ];

  return (
    <section className="py-24 px-6 max-w-3xl mx-auto">
      <SectionHeader icon={HelpCircle} title="FAQ" subtitle="Frequently asked questions about NetLens" />
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="card overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
              <span className="text-sm font-medium text-p">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-m transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <div className="px-4 pb-4 text-sm text-s leading-relaxed fade-in">{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="border-t border-c bg-secondary">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
              <div className="font-bold text-p text-lg">NetLens</div>
            </div>
            <p className="text-sm text-s leading-relaxed">AI-Powered Network Intrusion Detection System for real-time threat monitoring and predictive cyber defense.</p>
          </div>
          {[
            { title: 'Product', links: ['Dashboard', 'Live Monitoring', 'AI Detection', 'Threat Intel'] },
            { title: 'Company', links: ['About', 'Contact', 'Pricing', 'FAQ'] },
            { title: 'Resources', links: ['Documentation', 'API Reference', 'Security Blog', 'Help Center'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-sm font-semibold text-p mb-3">{col.title}</h4>
              <div className="space-y-2">
                {col.links.map((link, j) => <div key={j} className="text-sm text-s hover:text-accent cursor-pointer transition-colors">{link}</div>)}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-c mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-m">© 2026 NetLens AI. All rights reserved. Built for cybersecurity excellence.</p>
          <div className="flex gap-4 text-xs text-m">
            <span className="hover:text-p cursor-pointer">Privacy Policy</span>
            <span className="hover:text-p cursor-pointer">Terms of Service</span>
            <span className="hover:text-p cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
