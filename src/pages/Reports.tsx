import { useEffect, useState, useCallback } from 'react';
import { FileText, Download, Calendar, TrendingUp, Brain, BarChart3, FileSpreadsheet, FileType } from 'lucide-react';
import { Card, Badge, Button, StatCard, EmptyState } from '../components/ui';
import { PageHeader } from './Dashboard';
import { BarChart, DonutChart, LineChart } from '../components/Charts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { generateTimeSeriesData } from '../lib/mockData';
import { formatDate } from '../lib/utils';
import type { Report } from '../types';

export function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'threat_summary' | 'ai_analysis'>('daily');

  const loadReports = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error && data) setReports(data as Report[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const generateReport = async (type: typeof activeTab) => {
    if (!user) return;
    const titles: Record<string, string> = {
      daily: 'Daily Security Report',
      weekly: 'Weekly Security Report',
      monthly: 'Monthly Security Report',
      threat_summary: 'Threat Summary Report',
      ai_analysis: 'AI Analysis Report',
    };
    const reportData = {
      total_packets: Math.floor(Math.random() * 50000 + 10000),
      threats_detected: Math.floor(Math.random() * 50 + 10),
      false_positives: Math.floor(Math.random() * 5),
      avg_confidence: Math.floor(Math.random() * 10 + 88),
      top_threats: ['DDoS', 'SQL Injection', 'Brute Force', 'Port Scan'],
    };
    const { data } = await supabase.from('reports').insert({
      user_id: user.id,
      title: titles[type],
      report_type: type,
      summary: `${titles[type]}: ${reportData.threats_detected} threats detected with ${reportData.avg_confidence}% average AI confidence.`,
      threat_count: reportData.threats_detected,
      data: reportData,
    }).select();
    if (data) setReports((prev) => [data[0] as Report, ...prev]);
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    const content = reports.length > 0 ? JSON.stringify(reports[0], null, 2) : 'No reports available';
    const blob = new Blob([content], { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `netlens-report-${Date.now()}.${format === 'pdf' ? 'pdf' : 'xls'}`;
    a.click();
  };

  const filtered = reports.filter((r) => r.report_type === activeTab);

  const threatBreakdown = [
    { label: 'DDoS', value: 45, color: '#ef4444' },
    { label: 'SQL Injection', value: 32, color: '#f97316' },
    { label: 'Brute Force', value: 28, color: '#eab308' },
    { label: 'Port Scan', value: 18, color: '#00d9ff' },
    { label: 'Malware', value: 15, color: '#a855f7' },
  ];

  const weeklyTrend = generateTimeSeriesData(7, 30, 40);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Reports" subtitle="Security reports and analytics export" icon={FileText} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Reports" value={reports.length} icon={<FileText className="w-5 h-5" />} color="#00d9ff" />
        <StatCard label="Threats Reported" value={reports.reduce((s, r) => s + r.threat_count, 0)} icon={<TrendingUp className="w-5 h-5" />} color="#ef4444" />
        <StatCard label="AI Reports" value={reports.filter((r) => r.report_type === 'ai_analysis').length} icon={<Brain className="w-5 h-5" />} color="#a855f7" />
        <StatCard label="This Month" value={reports.filter((r) => new Date(r.created_at).getMonth() === new Date().getMonth()).length} icon={<Calendar className="w-5 h-5" />} color="#22c55e" />
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          <div className="flex gap-2 flex-wrap">
            {([
              { key: 'daily', label: 'Daily' },
              { key: 'weekly', label: 'Weekly' },
              { key: 'monthly', label: 'Monthly' },
              { key: 'threat_summary', label: 'Threat Summary' },
              { key: 'ai_analysis', label: 'AI Analysis' },
            ] as const).map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === t.key ? 'text-accent' : 'text-s hover:text-p bg-tertiary'}`}
                style={activeTab === t.key ? { background: 'var(--accent-glow)' } : undefined}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 lg:ml-auto">
            <Button variant="primary" size="md" onClick={() => generateReport(activeTab)}>
              <FileText className="w-4 h-4" /> Generate Report
            </Button>
            <Button variant="secondary" size="md" onClick={() => exportReport('pdf')}>
              <FileType className="w-4 h-4" /> PDF
            </Button>
            <Button variant="secondary" size="md" onClick={() => exportReport('excel')}>
              <FileSpreadsheet className="w-4 h-4" /> Excel
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-p mb-4">Threat Distribution</h4>
            <DonutChart data={threatBreakdown} centerValue="138" centerLabel="Threats" />
          </div>
          <div>
            <h4 className="font-medium text-p mb-4">Weekly Threat Trend</h4>
            <LineChart data={weeklyTrend} color="#ef4444" height={200} />
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((report) => (
            <div key={report.id} className="p-4 rounded-xl bg-tertiary border border-c hover:border-lc transition-all fade-in">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-p truncate">{report.title}</h4>
                      <Badge variant="info">{report.report_type.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-sm text-s truncate">{report.summary}</p>
                    <div className="flex items-center gap-4 text-xs text-m mt-1">
                      <span>{formatDate(report.created_at, true)}</span>
                      <span>{report.threat_count} threats</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => exportReport('pdf')}><Download className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <EmptyState icon={<FileText className="w-8 h-8" />} title="No Reports Yet" subtitle="Generate a report to see it here." />
          )}
          {loading && <div className="text-center py-12 text-m">Loading reports...</div>}
        </div>
      </Card>
    </div>
  );
}
