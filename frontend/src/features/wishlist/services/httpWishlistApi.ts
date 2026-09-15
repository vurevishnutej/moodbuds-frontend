import type { Product, WishlistItem } from '../../../types';
import { apiClient } from '../../../services/api/apiClient';
import type { WishlistApi } from './wishlistApi';

interface WishlistItemResponse {
  id: number;
  productId: string;
  productName: string;
  productBrand: string;
  productImage: string;
  price: number;
  originalPrice?: number;
  size?: string;
  addedAt: string;
}

interface WishlistResponse {
  items: WishlistItemResponse[];
}

interface WishlistStatusResponse {
  isWishlisted: boolean;
}

function mapWishlistResponse(response: WishlistResponse): WishlistItem[] {
  return response.items.map((item) => ({
    id: String(item.id),
    productId: item.productId,
    name: item.productName,
    brand: item.productBrand,
    price: item.price,
    originalPrice: item.originalPrice ?? null,
    sizes: item.size ? [item.size] : [],
    image: item.productImage,
    savedAt: Date.parse(item.addedAt) || Date.now(),
  }));
}

export const httpWishlistApi: WishlistApi = {
  async getWishlist() {
    return mapWishlistResponse(await apiClient.get<WishlistResponse>('/customer/wishlist'));
  },

  async addToWishlist(product: Product) {
    const response = await apiClient.post<WishlistResponse>('/customer/wishlist/items', {
      productSlug: product.id,
    });
    return mapWishlistResponse(response);
  },

  async removeFromWishlist(itemId: string) {
    const response = await apiClient.delete<WishlistResponse>(`/customer/wishlist/items/${itemId}`);
    return mapWishlistResponse(response);
  },

  async isWishlisted(productId: string) {
    try {
      const params = new URLSearchParams({ productSlug: productId });
      const response = await apiClient.get<WishlistStatusResponse>(
        `/customer/wishlist/status?${params.toString()}`,
      );
      return response.isWishlisted;
    } catch {
      return false;
    }
  },
};
