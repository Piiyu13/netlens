import { useEffect, useState, useRef, useCallback } from 'react';
import { MessageSquare, Send, Brain, Sparkles, Bot, User, Zap, Lightbulb, Shield, FileText, Trash2 } from 'lucide-react';
import { Card, Badge, Button, Spinner } from '../components/ui';
import { PageHeader } from './Dashboard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  category?: string | null;
  created_at: string;
}

const QUICK_PROMPTS = [
  { icon: Shield, text: 'Explain the latest critical alert', category: 'alert' },
  { icon: Lightbulb, text: 'Suggest solutions for DDoS attacks', category: 'solution' },
  { icon: FileText, text: 'Analyze recent network logs', category: 'logs' },
  { icon: Brain, text: 'What security tips do you recommend?', category: 'tips' },
  { icon: Zap, text: 'Explain how the AI detection works', category: 'explanation' },
  { icon: FileText, text: 'Generate a threat summary report', category: 'report' },
];

const AI_RESPONSES: Record<string, string[]> = {
  alert: [
    'I analyzed the latest critical alerts. The most severe is a **DDoS Attack** from IP 45.227.255.206 with 97% AI confidence. The attack is a volumetric SYN flood targeting your web infrastructure. I recommend:\n\n1. **Immediate**: Activate rate limiting on edge firewalls\n2. **Block**: Add source IP to blocklist\n3. **Monitor**: Track bandwidth utilization for saturation\n4. **Report**: Document the incident for post-mortem analysis\n\nThe AI engine correlated 1,247 packet features to identify this as a coordinated attack pattern.',
  ],
  solution: [
    'For DDoS attack mitigation, here are my recommended solutions:\n\n**Layer 1 - Network Edge:**\n- Enable DDoS protection service (cloud scrubbing)\n- Configure SYN flood protection on firewalls\n- Implement rate limiting per source IP\n\n**Layer 2 - Application:**\n- Deploy Web Application Firewall (WAF) rules\n- Enable connection timeout and keep-alive limits\n- Use CDN to absorb volumetric traffic\n\n**Layer 3 - AI Response:**\n- NetLens auto-block has contained 342 malicious IPs\n- Predictive model shows 78% probability of continued attacks\n- Recommend increasing AI sensitivity to High temporarily',
  ],
  logs: [
    'I analyzed your recent network logs. Here\'s my summary:\n\n**Last 24 Hours:**\n- Total events: 45,231\n- Threats detected: 17 (3 critical, 5 high, 9 medium)\n- Blocked attempts: 342\n- False positives: 2 (0.004% rate)\n\n**Key Patterns:**\n- Increased port scanning activity from 203.0.113.50\n- Unusual DNS query patterns from internal host 172.16.0.8\n- Failed SSH logins spiked 340% around 2:00 AM\n\n**AI Recommendation:** The pattern suggests reconnaissance phase of a potential attack. Recommend increasing monitoring on affected systems.',
  ],
  tips: [
    'Here are my top security recommendations:\n\n1. **Enable MFA** on all administrative accounts\n2. **Patch Management**: Keep systems updated - 60% of breaches involve unpatched vulnerabilities\n3. **Network Segmentation**: Isolate critical systems from general network\n4. **Zero Trust**: Implement least-privilege access controls\n5. **Monitor DNS**: DNS tunneling is a common exfiltration vector\n6. **Log Analysis**: Review logs daily - NetLens AI can automate this\n7. **Incident Response**: Have a documented IR plan with defined roles\n8. **Backup Strategy**: Follow 3-2-1 backup rule for ransomware resilience\n\nThe NetLens AI engine can help automate detection for most of these areas.',
  ],
  explanation: [
    'NetLens AI detection works through a multi-layered approach:\n\n**1. Feature Extraction**\nThe engine extracts 247+ features from each network packet: header info, payload patterns, timing, frequency, protocol anomalies.\n\n**2. Machine Learning Models**\n- **Random Forest**: Classifies known attack signatures (94% accuracy)\n- **LSTM Neural Network**: Detects sequential attack patterns (91% accuracy)\n- **Isolation Forest**: Identifies anomalies without signatures (87% accuracy)\n- **XGBoost**: Ensemble prediction with highest accuracy (95%)\n\n**3. Deep Learning**\nDeep neural networks analyze raw packet data for zero-day detection - threats never seen before.\n\n**4. Explainable AI**\nEvery detection includes confidence scores and reasoning so analysts understand *why* a threat was flagged.\n\nCurrent system accuracy: **99.7%** with 0.3% false positive rate.',
  ],
  report: [
    'I\'ve generated a threat summary report for your review:\n\n**Threat Summary Report - ' + new Date().toLocaleDateString() + '**\n\n**Overview:**\n- Monitoring period: Last 24 hours\n- Total packets analyzed: 45,231\n- Threats detected: 17\n- AI confidence average: 94.2%\n\n**Threat Breakdown:**\n- Critical: 3 (DDoS, Malware C2, Ransomware)\n- High: 5 (SQL Injection, Brute Force x2, ARP Spoofing, Bot)\n- Medium: 9 (Port Scans, Phishing, DNS anomalies)\n\n**Actions Taken:**\n- 342 IPs auto-blocked\n- 2 hosts isolated\n- 0 false positives confirmed\n\n**AI Prediction:** Elevated risk for next 24 hours. Recommend heightened monitoring.\n\nYou can export this report from the Reports page.',
  ],
  default: [
    'I\'m NetLens AI, your security assistant. I can help you with:\n\n- **Explaining alerts** and their severity\n- **Suggesting solutions** for detected threats\n- **Analyzing logs** for patterns and anomalies\n- **Security tips** and best practices\n- **Attack explanations** - how and why threats work\n- **Generating reports** for your security posture\n\nWhat would you like to know about your network security?',
  ],
};

function getAIResponse(category: string): string {
  const responses = AI_RESPONSES[category] || AI_RESPONSES.default;
  return responses[0];
}

function categorizeMessage(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('alert') || m.includes('threat') || m.includes('attack')) return 'alert';
  if (m.includes('solution') || m.includes('fix') || m.includes('prevent') || m.includes('ddos')) return 'solution';
  if (m.includes('log') || m.includes('analyze')) return 'logs';
  if (m.includes('tip') || m.includes('recommend') || m.includes('advice')) return 'tips';
  if (m.includes('explain') || m.includes('how') || m.includes('work') || m.includes('ai')) return 'explanation';
  if (m.includes('report') || m.includes('summary') || m.includes('generate')) return 'report';
  return 'default';
}

export function AIChatAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('chat_history')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);
    if (data && data.length > 0) {
      setMessages(data as ChatMsg[]);
    } else {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        message: getAIResponse('default'),
        created_at: new Date().toISOString(),
      }]);
    }
  }, [user]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const sendMessage = async (text: string, category?: string) => {
    if (!text.trim() || !user) return;
    const cat = category || categorizeMessage(text);
    const userMsg: ChatMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    await supabase.from('chat_history').insert({
      user_id: user.id,
      role: 'user',
      message: text,
      category: cat,
    });

    setTimeout(async () => {
      const response = getAIResponse(cat);
      const aiMsg: ChatMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        message: response,
        category: cat,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setThinking(false);

      await supabase.from('chat_history').insert({
        user_id: user.id,
        role: 'assistant',
        message: response,
        category: cat,
      });
    }, 1200);
  };

  const clearChat = async () => {
    if (!user) return;
    await supabase.from('chat_history').delete().eq('user_id', user.id);
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      message: getAIResponse('default'),
      created_at: new Date().toISOString(),
    }]);
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} className="font-semibold text-p mt-2 mb-1">{line.slice(2, -2)}</div>;
      }
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <div key={i} className={i > 0 ? 'mt-1' : ''}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <span key={j} className="font-semibold text-p">{part.slice(2, -2)}</span>;
            }
            return <span key={j} className="text-s">{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader title="AI Chat Assistant" subtitle="Interactive AI security assistant for threat analysis and recommendations" icon={MessageSquare} />

      <Card className="flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        <div className="flex items-center justify-between pb-4 border-b border-c">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center glow-accent">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-p flex items-center gap-2">NetLens AI <Badge variant="info" dot>Online</Badge></h3>
              <p className="text-xs text-m">Security Assistant · Powered by AI</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={clearChat}><Trash2 className="w-4 h-4" /> Clear</Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn('flex gap-3 fade-in', msg.role === 'user' ? 'flex-row-reverse' : '')}>
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', msg.role === 'user' ? 'bg-tertiary' : 'bg-gradient-to-br from-cyan-400 to-blue-600 glow-accent')}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-s" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={cn('max-w-[80%] rounded-2xl px-4 py-3', msg.role === 'user' ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-tertiary border border-c')}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-2 text-xs text-accent">
                    <Sparkles className="w-3 h-3" /> AI Response
                  </div>
                )}
                <div className="text-sm leading-relaxed">{formatMessage(msg.message)}</div>
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex gap-3 fade-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center glow-accent flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-tertiary border border-c rounded-2xl px-4 py-3 flex items-center gap-2">
                <Spinner size={16} />
                <span className="text-sm text-s">AI is analyzing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-c pt-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} onClick={() => sendMessage(p.text, p.category)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tertiary text-xs text-s hover:text-p hover:border-lc border border-c transition-all">
                <p.icon className="w-3.5 h-3.5" /> {p.text}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about threats, alerts, security tips..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              className="input-field flex-1"
            />
            <Button onClick={() => sendMessage(input)} disabled={!input.trim()}>
              <Send className="w-4 h-4" /> Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
