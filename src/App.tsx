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
import { PacketAnalyzer } from './pages/PacketAnalyzer';
import { AlertsCenter } from './pages/AlertsCenter';
import { Performance } from './pages/Performance';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { NetworkTopology } from './pages/NetworkTopology';
import { DeviceManagement } from './pages/DeviceManagement';
import { UserManagement } from './pages/UserManagement';

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
    '/packet-analyzer': <PacketAnalyzer />,
    '/alerts': <AlertsCenter />,
    '/performance': <Performance />,
    '/settings': <Settings />,
    '/topology': <NetworkTopology />,
    '/devices': <DeviceManagement />,
    '/users': <UserManagement />,
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
