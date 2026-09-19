import { mockWishlistApi } from './mockWishlistApi';
import { httpWishlistApi } from './httpWishlistApi';
import type { WishlistApi } from './wishlistApi';

/**
 * Use real API - backend is ready
 */
const useMock = false;

/** Swap point for real backend integration. */
export const wishlistService: WishlistApi = useMock ? mockWishlistApi : httpWishlistApi;
