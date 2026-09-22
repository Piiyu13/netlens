import { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, MapPin, Globe, Clock } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { PageHeader } from './Dashboard';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName(''); setEmail(''); setSubject(''); setMessage('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader title="Contact" subtitle="Get support and send feedback" icon={Mail} />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold text-p mb-1">Email Support</h3>
          <p className="text-sm text-s mb-2">24/7 email support for all users</p>
          <a href="mailto:support@netlens.ai" className="text-sm text-accent hover:underline">support@netlens.ai</a>
        </Card>
        <Card>
          <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-orange-400" />
          </div>
          <h3 className="font-semibold text-p mb-1">Phone Support</h3>
          <p className="text-sm text-s mb-2">Critical incident hotline</p>
          <a href="tel:+18005550123" className="text-sm text-accent hover:underline">+1 (800) 555-0123</a>
        </Card>
        <Card>
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="font-semibold text-p mb-1">Live Chat</h3>
          <p className="text-sm text-s mb-2">Chat with our security team</p>
          <Badge variant="safe" dot>Online Now</Badge>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-p mb-4">Send Feedback</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-s mb-1.5 block">Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm text-s mb-1.5 block">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="text-sm text-s mb-1.5 block">Subject</label>
              <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field" placeholder="How can we help?" />
            </div>
            <div>
              <label className="text-sm text-s mb-1.5 block">Message</label>
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="input-field resize-none" placeholder="Describe your issue or feedback..." />
            </div>
            <Button type="submit"><Send className="w-4 h-4" /> {sent ? 'Sent!' : 'Send Message'}</Button>
            {sent && <span className="text-sm text-green-400 ml-3 fade-in">Thank you! We\'ll respond within 24 hours.</span>}
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-p mb-4">Office Location</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <div className="text-sm text-p">Cyber Security Center</div>
                  <div className="text-sm text-s">123 Tech Plaza, Innovation District</div>
                  <div className="text-sm text-s">San Francisco, CA 94103</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-accent" />
                <span className="text-sm text-s">www.netlens.ai</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-sm text-s">24/7 Security Operations Center</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-p mb-4">Response Times</h3>
            <div className="space-y-3">
              {[
                { level: 'Critical', time: '< 15 minutes', color: '#ef4444' },
                { level: 'High', time: '< 1 hour', color: '#f97316' },
                { level: 'Medium', time: '< 4 hours', color: '#eab308' },
                { level: 'Low', time: '< 24 hours', color: '#22c55e' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-tertiary">
                  <span className="text-sm text-p">{r.level}</span>
                  <span className="text-sm font-mono" style={{ color: r.color }}>{r.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
