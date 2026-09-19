import { mockWishlistApi } from './mockWishlistApi';
import { httpWishlistApi } from './httpWishlistApi';
import type { WishlistApi } from './wishlistApi';

/**
 * Use real API or mock based on VITE_USE_MOCK_API env var
 * Set VITE_USE_MOCK_API=false in .env.local to use real API
 */
const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

/** Swap point for real backend integration. */
export const wishlistService: WishlistApi = useMock ? mockWishlistApi : httpWishlistApi;
