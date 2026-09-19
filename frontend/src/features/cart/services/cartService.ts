import { mockCartApi, mockCheckoutApi } from './mockCartApi';
import { httpCartApi, httpCheckoutApi } from './httpCartApi';
import type { CartApi, CheckoutApi } from './cartApi';

/**
 * Use real API or mock based on VITE_USE_MOCK_API env var
 * Set VITE_USE_MOCK_API=false in .env.local to use real API
 */
const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

/** Swap point for real backend integration. */
export const cartService: CartApi = useMock ? mockCartApi : httpCartApi;
export const checkoutService: CheckoutApi = useMock ? mockCheckoutApi : httpCheckoutApi;
