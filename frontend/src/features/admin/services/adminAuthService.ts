import { adminApiClient, adminTokenManager, type AdminSummary } from './adminApiClient';

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  admin: AdminSummary;
}

export const adminAuthService = {
  async login(username: string, password: string): Promise<AdminSummary> {
    const res = await adminApiClient.post<LoginResponse>('/admin/auth/login', { username, password });
    adminTokenManager.setToken(res.accessToken);
    adminTokenManager.setAdmin(res.admin);
    return res.admin;
  },
  logout(): void {
    adminTokenManager.clearToken();
  },
  currentAdmin(): AdminSummary | null {
    return adminTokenManager.getAdmin();
  },
  isAuthenticated(): boolean {
    return adminTokenManager.isAuthenticated();
  },
};
