import { useState, type ReactNode } from 'react';
import { Shield, Menu, X, Moon, Sun, LogOut, User, ChevronDown } from 'lucide-react';
import { NAV_ITEMS } from '../lib/navigation';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const GROUP_LABELS: Record<string, string> = {
  main: 'Overview',
  monitoring: 'Monitoring',
  ai: 'AI Security',
  analysis: 'Analysis',
  intel: 'Intelligence',
  system: 'System',
};

export function Layout({ children, currentPath, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const grouped = NAV_ITEMS.reduce((acc, item) => {
    const g = item.group || 'main';
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {} as Record<string, typeof NAV_ITEMS>);

  const groupOrder = ['main', 'monitoring', 'ai', 'analysis', 'intel', 'system'];

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 px-5 py-5 border-b border-c">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center glow-accent">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-p text-lg leading-tight">NetLens</div>
          <div className="text-xs text-m">AI-NIDS Platform</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {groupOrder.map((group) => {
          const items = grouped[group];
          if (!items) return null;
          return (
            <div key={group} className="mb-4">
              <div className="px-3 mb-2 text-xs font-semibold text-m uppercase tracking-wider">
                {GROUP_LABELS[group]}
              </div>
              {items.map((item) => {
                const active = currentPath === item.path;
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      setMobileOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-0.5',
                      active
                        ? 'text-accent glow-accent'
                        : 'text-s hover:text-p hover:bg-hover-c'
                    )}
                    style={active ? { background: 'var(--accent-glow)' } : undefined}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 ml-auto pulse-dot" />}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-c p-4">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-tertiary">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-p truncate">{profile?.full_name || 'Analyst'}</div>
            <div className="text-xs text-m truncate">{user?.email}</div>
          </div>
          <button onClick={signOut} className="text-m hover:text-red-400 transition-colors p-1" title="Sign Out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-base flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative z-50 h-screen bg-secondary border-r border-c flex flex-col transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ overflow: sidebarOpen ? 'visible' : 'hidden' }}
      >
        {sidebarOpen ? <SidebarContent /> : (
          <div className="flex flex-col items-center py-5 h-full">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center glow-accent mb-4">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {NAV_ITEMS.map((item) => {
              const active = currentPath === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-all', active ? 'text-accent glow-accent' : 'text-s hover:text-p hover:bg-hover-c')}
                  style={active ? { background: 'var(--accent-glow)' } : undefined}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-c">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-s hover:text-p">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block text-s hover:text-p">
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-tertiary">
                <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
                <span className="text-xs text-s font-medium">System Active</span>
                <span className="text-xs text-m font-mono">· AI Online</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-lg bg-tertiary flex items-center justify-center text-s hover:text-p transition-colors"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-hover-c transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                    {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-m" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 card p-2 shadow-xl z-50 fade-in">
                      <div className="px-3 py-2 border-b border-c mb-2">
                        <div className="text-sm font-medium text-p truncate">{profile?.full_name || 'Analyst'}</div>
                        <div className="text-xs text-m truncate">{user?.email}</div>
                      </div>
                      <button onClick={() => { onNavigate('/settings'); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-s hover:text-p hover:bg-hover-c transition-colors">
                        <User className="w-4 h-4" /> Profile & Settings
                      </button>
                      <button onClick={signOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-s hover:text-red-400 hover:bg-hover-c transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
