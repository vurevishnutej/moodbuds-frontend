import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminApiClient, adminTokenManager } from './adminApiClient';
import { ApiError } from '../../../services/api/apiClient';

function mockFetchOnce(response: Partial<Response> & { jsonBody?: unknown }) {
  const { jsonBody, ...rest } = response;
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => jsonBody,
    ...rest,
  } as Response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('adminTokenManager', () => {
  it('stores and retrieves the admin token separately from customer tokens', () => {
    expect(adminTokenManager.isAuthenticated()).toBe(false);
    adminTokenManager.setToken('abc.def.ghi');
    expect(adminTokenManager.getToken()).toBe('abc.def.ghi');
    expect(adminTokenManager.isAuthenticated()).toBe(true);
    expect(localStorage.getItem('moodbuds_access_token')).toBeNull();
  });

  it('stores and retrieves the admin summary as JSON', () => {
    adminTokenManager.setAdmin({ id: 1, username: 'owner', fullName: 'Owner', role: 'SUPER_ADMIN', permissions: ['catalog.manage'] });
    expect(adminTokenManager.getAdmin()).toEqual({
      id: 1,
      username: 'owner',
      fullName: 'Owner',
      role: 'SUPER_ADMIN',
      permissions: ['catalog.manage'],
    });
  });

  it('clears both token and admin info together', () => {
    adminTokenManager.setToken('tok');
    adminTokenManager.setAdmin({ id: 1, username: 'owner', fullName: 'Owner', role: 'SUPER_ADMIN', permissions: [] });
    adminTokenManager.clearToken();
    expect(adminTokenManager.getToken()).toBeNull();
    expect(adminTokenManager.getAdmin()).toBeNull();
  });
});

describe('adminApiClient request wrapper', () => {
  beforeEach(() => {
    adminTokenManager.clearToken();
  });

  it('attaches the Authorization header when a token is present', async () => {
    adminTokenManager.setToken('my-jwt');
    const fetchMock = mockFetchOnce({ jsonBody: { content: [] } });

    await adminApiClient.get('/admin/categories');

    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer my-jwt');
  });

  it('omits the Authorization header when signed out', async () => {
    const fetchMock = mockFetchOnce({ jsonBody: {} });

    await adminApiClient.get('/admin/categories');

    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it('sends JSON bodies on POST/PATCH', async () => {
    const fetchMock = mockFetchOnce({ jsonBody: { id: 1 } });

    await adminApiClient.post('/admin/categories', { name: 'Men', isActive: true });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ name: 'Men', isActive: true });
  });

  it('clears the token and throws ApiError on a 401 response', async () => {
    adminTokenManager.setToken('stale-token');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ detail: 'Token expired' }),
      } as Response)
    );

    await expect(adminApiClient.get('/admin/categories')).rejects.toBeInstanceOf(ApiError);
    expect(adminTokenManager.getToken()).toBeNull();
  });

  it('surfaces the backend detail message on a non-401 error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ detail: 'At least one supported field is required' }),
      } as Response)
    );

    await expect(adminApiClient.post('/admin/categories', {})).rejects.toMatchObject({
      status: 400,
      message: 'At least one supported field is required',
    });
  });

  it('returns undefined for a 204 No Content response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 204, statusText: 'No Content' } as Response)
    );

    await expect(adminApiClient.delete('/admin/categories/1')).resolves.toBeUndefined();
  });
});
