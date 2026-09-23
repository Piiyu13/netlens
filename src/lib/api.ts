import type { Alert, Device, UserSettings } from '../types';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:8000';
const TOKEN_KEY = 'netlens_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
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
    throw new Error((body as { detail?: string }).detail || `Request failed (${res.status})`);
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
