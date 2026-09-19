import { mockCartApi, mockCheckoutApi } from './mockCartApi';
import { httpCartApi, httpCheckoutApi } from './httpCartApi';
import type { CartApi, CheckoutApi } from './cartApi';

/**
 * Use real API - backend is ready
 */
const useMock = false;

/** Using real backend integration. */
export const cartService: CartApi = useMock ? mockCartApi : httpCartApi;
export const checkoutService: CheckoutApi = useMock ? mockCheckoutApi : httpCheckoutApi;
