const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
const TOKEN_KEY = 'moodbuds_access_token';
const REFRESH_TOKEN_KEY = 'moodbuds_refresh_token';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
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
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

async function request<T>(path: string, init?: RequestInit, options?: ApiRequestOptions): Promise<T> {
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

    // Handle 401 - token might be expired
    if (res.status === 401 && token && options?.includeAuth !== false) {
      tokenManager.clearTokens();
      // Could trigger a refresh token flow here if needed
    }

    throw new ApiError(res.status, body || res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) => request<T>(path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, options),
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
