import { apiClient, tokenManager } from '../api/apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
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
}

export interface RefreshRequest {
  refreshToken: string;
}

export const authService = {
  /**
   * Register a new customer account
   */
  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/customer/auth/register', request);
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    // Save customer info to localStorage
    localStorage.setItem('moodbuds_customer', JSON.stringify(response.customer));
    return response;
  },

  /**
   * Login with email and password
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/customer/auth/login', request);
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    // Save customer info to localStorage
    console.log('authService.login: saving customer to localStorage', response.customer);
    localStorage.setItem('moodbuds_customer', JSON.stringify(response.customer));
    return response;
  },

  /**
   * Refresh access token using refresh token
   */
  async refresh(): Promise<AuthResponse> {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiClient.post<AuthResponse>('/customer/auth/refresh', {
        refreshToken,
      });
      tokenManager.setTokens(response.accessToken, response.refreshToken);
      return response;
    } catch (error) {
      // If refresh fails, clear tokens
      tokenManager.clearTokens();
      throw error;
    }
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
    const refreshToken = tokenManager.getRefreshToken();
    try {
      await apiClient.post('/customer/auth/logout-all', { refreshToken });
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
  },
};
