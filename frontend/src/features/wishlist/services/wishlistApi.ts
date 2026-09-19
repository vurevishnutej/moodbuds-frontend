import type { WishlistItem, Product } from '../../../types';

export interface WishlistApi {
  getWishlist(): Promise<WishlistItem[]>;
  addToWishlist(product: Product): Promise<WishlistItem[]>;
  removeFromWishlist(itemId: string): Promise<WishlistItem[]>;
  isWishlisted(productId: string): Promise<boolean>;
}
