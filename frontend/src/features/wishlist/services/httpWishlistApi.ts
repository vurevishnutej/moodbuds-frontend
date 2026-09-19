import type { Product, WishlistItem } from '../../../types';
import { apiClient } from '../../../services/api/apiClient';
import type { WishlistApi } from './wishlistApi';

interface WishlistItemResponse {
  id: number;
  productId: number;
  productSlug: string;
  productName: string;
  primaryImageUrl: string;
  price: number;
  discountPrice?: number | null;
  effectivePrice: number;
  selectedSize?: string | null;
  addedAt: string;
}

interface WishlistResponse {
  items: WishlistItemResponse[];
}

interface WishlistStatusResponse {
  wishlisted: boolean;
}

function mapWishlistResponse(response: WishlistResponse): WishlistItem[] {
  return response.items.map((item) => ({
    id: String(item.id),
    productId: item.productSlug || String(item.productId),
    name: item.productName,
    brand: '',
    price: item.effectivePrice / 100,
    originalPrice: item.discountPrice != null ? item.price / 100 : null,
    sizes: item.selectedSize ? [item.selectedSize] : [],
    image: item.primaryImageUrl,
    savedAt: Date.parse(item.addedAt) || Date.now(),
  }));
}

export const httpWishlistApi: WishlistApi = {
  async getWishlist() {
    return mapWishlistResponse(await apiClient.get<WishlistResponse>('/customer/wishlist'));
  },

  async addToWishlist(product: Product) {
    await apiClient.post<WishlistItemResponse>('/customer/wishlist/items', {
      productSlug: product.id,
    });
    return this.getWishlist();
  },

  async removeFromWishlist(itemId: string) {
    await apiClient.delete<void>(`/customer/wishlist/items/${itemId}`);
    return this.getWishlist();
  },

  async isWishlisted(productId: string) {
    try {
      const params = new URLSearchParams({ productSlug: productId });
      const response = await apiClient.get<WishlistStatusResponse>(
        `/customer/wishlist/status?${params.toString()}`,
      );
      return response.wishlisted;
    } catch {
      return false;
    }
  },
};
