import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Spinner } from './components/ui';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Dashboard } from './pages/Dashboard';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { AIThreatDetection } from './pages/AIThreatDetection';
import { AIAttackPrediction } from './pages/AIAttackPrediction';
import { PacketAnalyzer } from './pages/PacketAnalyzer';
import { AlertsCenter } from './pages/AlertsCenter';
import { Reports } from './pages/Reports';
import { Logs } from './pages/Logs';
import { Performance } from './pages/Performance';
import { ThreatIntelligence } from './pages/ThreatIntelligence';
import { AIChatAssistant } from './pages/AIChatAssistant';
import { Settings } from './pages/Settings';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { NetworkTopology } from './pages/NetworkTopology';
import { DeviceManagement } from './pages/DeviceManagement';
import { UserManagement } from './pages/UserManagement';
import { AdminPanel } from './pages/AdminPanel';

function AppContent() {
  const { user, loading } = useAuth();
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-tertiary" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin" />
          </div>
          <p className="text-sm text-s">Initializing NetLens...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onSuccess={() => {}} />;
  }

  const pages: Record<string, React.ReactNode> = {
    '/': <Home onNavigate={navigate} />,
    '/about': <About />,
    '/dashboard': <Dashboard />,
    '/monitoring': <LiveMonitoring />,
    '/threat-detection': <AIThreatDetection />,
    '/attack-prediction': <AIAttackPrediction />,
    '/packet-analyzer': <PacketAnalyzer />,
    '/alerts': <AlertsCenter />,
    '/reports': <Reports />,
    '/logs': <Logs />,
    '/performance': <Performance />,
    '/threat-intel': <ThreatIntelligence />,
    '/chat': <AIChatAssistant />,
    '/settings': <Settings />,
    '/contact': <Contact />,
    '/topology': <NetworkTopology />,
    '/devices': <DeviceManagement />,
    '/users': <UserManagement />,
    '/admin': <AdminPanel />,
  };

  const page = pages[route] || <Home onNavigate={navigate} />;

  return (
    <Layout currentPath={route} onNavigate={navigate}>
      <div key={route} className="fade-in">
        {page}
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
