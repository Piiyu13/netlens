import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi, getToken, setToken, type AppUser, type Profile } from '../lib/api';

interface AuthContextType {
  user: AppUser | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    if (!getToken()) {
      setUser(null);
      setProfile(null);
      return;
    }
    try {
      const { user: u, profile: p } = await authApi.me();
      setUser(u);
      setProfile(p);
    } catch {
      setToken(null);
      setUser(null);
      setProfile(null);
    }
  };

  useEffect(() => {
    fetchMe().finally(() => setLoading(false));
  }, []);

  const refreshProfile = async () => {
    await fetchMe();
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { access_token } = await authApi.login(email, password);
      setToken(access_token);
      await fetchMe();
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Sign in failed' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { access_token } = await authApi.signup(email, password, fullName);
      setToken(access_token);
      await fetchMe();
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Sign up failed' };
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
