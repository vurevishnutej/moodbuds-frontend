const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
const TOKEN_KEY = 'moodbuds_access_token';
const REFRESH_TOKEN_KEY = 'moodbuds_refresh_token';

export class ApiError extends Error {
  status: number;
  body?: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export interface ApiRequestOptions {
  headers?: HeadersInit;
  includeAuth?: boolean;
}

// Token Management
export const tokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(REFRESH_TOKEN_KEY);
  },
};

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  customer: unknown;
}

let refreshInFlight: Promise<boolean> | null = null;

function notifyAuth(type: 'refreshed' | 'expired', customer?: unknown) {
  window.dispatchEvent(new CustomEvent(`moodbuds:auth-${type}`, { detail: customer }));
}

async function refreshCustomerSession(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) return false;
  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/customer/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) throw new Error('Session refresh failed');
      const response = await res.json() as RefreshResponse;
      tokenManager.setTokens(response.accessToken, response.refreshToken);
      notifyAuth('refreshed', response.customer);
      return true;
    } catch {
      tokenManager.clearTokens();
      notifyAuth('expired');
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

async function request<T>(path: string, init?: RequestInit, options?: ApiRequestOptions, retry = true): Promise<T> {
  const headers = new Headers(options?.headers);
  if (init?.body != null && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Add JWT token if available
  const token = tokenManager.getAccessToken();
  if (token && options?.includeAuth !== false) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');

    if (res.status === 401 && retry && options?.includeAuth !== false && !path.startsWith('/customer/auth/')) {
      if (await refreshCustomerSession()) {
        return request<T>(path, init, options, false);
      }
    }

    let parsed: unknown;
    try { parsed = body ? JSON.parse(body) : undefined; } catch { parsed = undefined; }
    const detail = parsed && typeof parsed === 'object' && 'detail' in parsed
      ? String((parsed as { detail?: unknown }).detail)
      : body || res.statusText;
    throw new ApiError(res.status, detail, parsed);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) => request<T>(path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, options),
  postForm: <T>(path: string, body: FormData, options?: ApiRequestOptions) =>
    request<T>(path, { method: 'POST', body }, options),
  putForm: <T>(path: string, body: FormData, options?: ApiRequestOptions) =>
    request<T>(path, { method: 'PUT', body }, options),
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }, options),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, options),
  delete: <T>(path: string, options?: ApiRequestOptions) => request<T>(path, { method: 'DELETE' }, options),
};

export function apiUrl(path: string): string {
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
