import { ApiError } from '../../../services/api/apiClient';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const ADMIN_TOKEN_KEY = 'moodbuds_admin_access_token';
const ADMIN_INFO_KEY = 'moodbuds_admin_info';

export interface AdminSummary {
  id: number;
  username: string;
  fullName: string;
  role: string;
  permissions: string[];
}

export const adminTokenManager = {
  getToken: (): string | null => localStorage.getItem(ADMIN_TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(ADMIN_TOKEN_KEY, token),
  clearToken: (): void => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_INFO_KEY);
  },
  isAuthenticated: (): boolean => !!localStorage.getItem(ADMIN_TOKEN_KEY),
  getAdmin: (): AdminSummary | null => {
    const raw = localStorage.getItem(ADMIN_INFO_KEY);
    return raw ? (JSON.parse(raw) as AdminSummary) : null;
  },
  setAdmin: (admin: AdminSummary): void => localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(admin)),
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...init?.headers,
  };
  const token = adminTokenManager.getToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.detail || body.message || message;
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 401) adminTokenManager.clearToken();
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

async function uploadRequest<T>(path: string, formData: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  const token = adminTokenManager.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', body: formData, headers });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.detail || body.message || message;
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 401) adminTokenManager.clearToken();
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const adminApiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, formData: FormData) => uploadRequest<T>(path, formData),
  baseUrl: BASE_URL,
};
