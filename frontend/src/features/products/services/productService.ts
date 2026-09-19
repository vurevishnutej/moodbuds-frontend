import { mockProductApi } from './mockProductApi';
import { httpProductApi } from './httpProductApi';
import type { ProductApi } from './productApi';

// Use real API - backend is ready
// Toggle back to mock with: const useMock = import.meta.env.VITE_USE_MOCK_API !== 'false';
const useMock = false;

/**
 * Swap point for real backend integration.
 * Currently using real API.
 */
export const productService: ProductApi = useMock ? mockProductApi : httpProductApi;
