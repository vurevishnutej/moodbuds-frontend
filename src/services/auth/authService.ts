import { apiClient, tokenManager } from '../api/apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobile?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  customer: CustomerInfo;
}

export interface CustomerInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string | null;
  dateOfBirth: string | null;
  gender: 'M' | 'F' | 'OTHER' | 'UNSPECIFIED';
  emailVerified: boolean;
  mobileVerified: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  mobile?: string | null;
  dateOfBirth?: string | null;
  gender?: CustomerInfo['gender'];
}

export interface RefreshRequest {
  refreshToken: string;
}

let sessionRefreshInFlight: Promise<AuthResponse> | null = null;

export const authService = {
  /**
   * Register a new customer account
   */
  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/customer/auth/register', request);
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  /**
   * Login with email and password
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/customer/auth/login', request);
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  /**
   * Refresh access token using refresh token
   */
  async refresh(): Promise<AuthResponse> {
    if (sessionRefreshInFlight) return sessionRefreshInFlight;
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    sessionRefreshInFlight = (async () => {
      try {
      const response = await apiClient.post<AuthResponse>('/customer/auth/refresh', {
        refreshToken,
      }, { includeAuth: false });
        tokenManager.setTokens(response.accessToken, response.refreshToken);
        return response;
      } catch (error) {
        tokenManager.clearTokens();
        localStorage.removeItem('moodbuds_customer');
        throw error;
      } finally {
        sessionRefreshInFlight = null;
      }
    })();
    return sessionRefreshInFlight;
  },

  /**
   * Logout current session
   */
  async logout(): Promise<void> {
    const refreshToken = tokenManager.getRefreshToken();
    try {
      await apiClient.post('/customer/auth/logout', { refreshToken });
    } finally {
      tokenManager.clearTokens();
      localStorage.removeItem('moodbuds_customer');
    }
  },

  /**
   * Logout all sessions
   */
  async logoutAll(): Promise<void> {
    try {
      await apiClient.post('/customer/auth/logout-all');
    } finally {
      tokenManager.clearTokens();
      localStorage.removeItem('moodbuds_customer');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  },

  /**
   * Clear all tokens
   */
  clearAuth(): void {
    tokenManager.clearTokens();
    localStorage.removeItem('moodbuds_customer');
  },

  async restoreSession(): Promise<CustomerInfo | null> {
    if (!tokenManager.getRefreshToken()) return null;
    try {
      const response = await this.refresh();
      return response.customer;
    } catch {
      this.clearAuth();
      return null;
    }
  },

  profile(): Promise<CustomerInfo> {
    return apiClient.get<CustomerInfo>('/customer/profile');
  },

  updateProfile(request: UpdateProfileRequest): Promise<CustomerInfo> {
    return apiClient.patch<CustomerInfo>('/customer/profile', request);
  },
};
