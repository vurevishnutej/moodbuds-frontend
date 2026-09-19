import { apiClient } from '../../../services/api/apiClient';
import { adminAuthOptions } from './adminQuizService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export const adminApiClient = {
  get: <T>(path: string) => apiClient.get<T>(path, adminAuthOptions()),
  post: <T>(path: string, body?: unknown) => apiClient.post<T>(path, body, adminAuthOptions()),
  put: <T>(path: string, body?: unknown) => apiClient.put<T>(path, body, adminAuthOptions()),
  patch: <T>(path: string, body?: unknown) => apiClient.patch<T>(path, body, adminAuthOptions()),
  delete: <T>(path: string) => apiClient.delete<T>(path, adminAuthOptions()),
  upload: <T>(path: string, body: FormData) => apiClient.postForm<T>(path, body, adminAuthOptions()),
  baseUrl: BASE_URL,
};
