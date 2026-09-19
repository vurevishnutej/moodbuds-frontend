import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminAuthService } from './adminAuthService';
import { adminTokenManager } from './adminApiClient';
import { ApiError } from '../../../services/api/apiClient';

describe('adminAuthService', () => {
  beforeEach(() => {
    adminTokenManager.clearToken();
  });

  it('stores the token and admin summary on successful login', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          accessToken: 'jwt-token',
          tokenType: 'Bearer',
          expiresAt: '2026-09-16T00:00:00Z',
          admin: { id: 1, username: 'owner', fullName: 'MoodBuds Owner', role: 'SUPER_ADMIN', permissions: ['catalog.manage'] },
        }),
      } as Response)
    );

    const admin = await adminAuthService.login('owner', 'correct-password');

    expect(admin.username).toBe('owner');
    expect(adminTokenManager.getToken()).toBe('jwt-token');
    expect(adminAuthService.isAuthenticated()).toBe(true);
    expect(adminAuthService.currentAdmin()?.role).toBe('SUPER_ADMIN');
  });

  it('does not store a token on invalid credentials', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ detail: 'Invalid username or password' }),
      } as Response)
    );

    await expect(adminAuthService.login('owner', 'wrong')).rejects.toBeInstanceOf(ApiError);
    expect(adminAuthService.isAuthenticated()).toBe(false);
  });

  it('logout clears the stored session', async () => {
    adminTokenManager.setToken('jwt-token');
    adminTokenManager.setAdmin({ id: 1, username: 'owner', fullName: 'Owner', role: 'SUPER_ADMIN', permissions: [] });

    adminAuthService.logout();

    expect(adminAuthService.isAuthenticated()).toBe(false);
    expect(adminAuthService.currentAdmin()).toBeNull();
  });
});
