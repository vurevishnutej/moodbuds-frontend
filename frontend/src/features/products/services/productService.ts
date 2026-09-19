import { mockProductApi } from './mockProductApi';
import { httpProductApi } from './httpProductApi';
import type { ProductApi } from './productApi';

const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

/**
 * Swap point for real backend integration.
 * Toggle via VITE_USE_MOCK_API in .env, or hardcode once the backend is stable.
 */
export const productService: ProductApi = useMock ? mockProductApi : httpProductApi;
