import type { Alert, Device, UserSettings } from '../types';

// Empty VITE_API_URL means "same origin" (used by the docker nginx proxy).
// Unset VITE_API_URL falls back to the local backend for `npm run dev`.
const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined;
const API_URL = rawApiUrl === undefined ? 'http://localhost:8000' : rawApiUrl.replace(/\/$/, '');
const TOKEN_KEY = 'netlens_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function formatDetail(body: unknown): string | null {
  const detail = (body as { detail?: unknown }).detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    // FastAPI validation errors: [{ loc: [...], msg: '...' }, ...]
    const msgs = detail.map((d) => {
      if (typeof d === 'string') return d;
      if (d && typeof d === 'object') {
        const loc = (d as { loc?: unknown }).loc;
        const msg = (d as { msg?: unknown }).msg;
        const field = Array.isArray(loc) ? loc.filter((p) => p !== 'body').join('.') : '';
        if (typeof msg === 'string') return field ? `${field}: ${msg}` : msg;
      }
      return JSON.stringify(d);
    });
    return msgs.join('; ') || null;
  }
  return null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(formatDetail(body) || `Request failed (${res.status})`);
  }
  return body as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  signup: (email: string, password: string, full_name: string) =>
    api.post<TokenResponse>('/api/auth/signup', { email, password, full_name }),
  login: (email: string, password: string) =>
    api.post<TokenResponse>('/api/auth/login', { email, password }),
  me: () => api.get<{ user: AppUser; profile: Profile }>('/api/auth/me'),
};

export interface AppUser {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
  phone: string | null;
  organization: string | null;
  created_at: string;
  updated_at: string;
}

export const profileApi = {
  get: () => api.get<Profile>('/api/profiles/me'),
  update: (body: Partial<Pick<Profile, 'full_name' | 'phone' | 'organization' | 'avatar_url'>>) =>
    api.put<Profile>('/api/profiles/me', body),
};

export const settingsApi = {
  get: () => api.get<UserSettings>('/api/settings'),
  update: (body: Partial<UserSettings>) =>
    api.put<UserSettings>('/api/settings', body),
};

export const alertsApi = {
  list: (limit = 100) => api.get<Alert[]>(`/api/alerts?limit=${limit}`),
  create: (body: unknown) => api.post<Alert[]>('/api/alerts', body),
  updateStatus: (id: string, status: string) =>
    api.patch<Alert>(`/api/alerts/${id}`, { status }),
};

export const devicesApi = {
  list: () => api.get<Device[]>('/api/devices'),
  create: (body: unknown) => api.post<Device[]>('/api/devices', body),
};

export { API_URL };
