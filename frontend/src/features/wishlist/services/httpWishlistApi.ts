import type { Wishlist, WishlistItem } from '../../../types';
import { apiClient } from '../../../services/api/apiClient';

interface WishlistItemResponse {
  id: number;
  productId: string;
  productName: string;
  productBrand: string;
  productImage: string;
  price: number;
  size?: string;
  color?: string;
  addedAt: string;
}

interface WishlistResponse {
  items: WishlistItemResponse[];
  totalCount: number;
}

interface WishlistStatusResponse {
  isWishlisted: boolean;
  itemId?: number;
}

/**
 * Convert API WishlistResponse to frontend Wishlist format
 */
function mapWishlistResponse(response: WishlistResponse): Wishlist {
  return {
    items: response.items.map(item => ({
      id: String(item.id),
      productId: item.productId,
      productName: item.productName,
      productBrand: item.productBrand,
      productImage: item.productImage,
      price: item.price,
      size: item.size || null,
      color: item.color || null,
    })) as WishlistItem[],
  };
}

/**
 * Real HTTP Wishlist API implementation
 */
export const httpWishlistApi = {
  /**
   * GET /customer/wishlist - Get authenticated customer's wishlist
   */
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await apiClient.get<WishlistResponse>('/customer/wishlist');
    return mapWishlistResponse(response).items;
  },

  /**
   * POST /customer/wishlist/items - Add product to wishlist
   */
  async addToWishlist(product: any): Promise<WishlistItem[]> {
    const payload = {
      productSlug: product.slug || product.id,
      size: undefined,
    };

    const response = await apiClient.post<WishlistItemResponse>(
      '/customer/wishlist/items',
      payload
    );
    return [{
      id: String(response.id),
      productId: response.productId,
      productName: response.productName,
      productBrand: response.productBrand,
      productImage: response.productImage,
      price: response.price,
      size: response.size || null,
      color: response.color || null,
    }];
  },

  /**
   * GET /customer/wishlist/status - Check if product is wishlisted
   */
  async isWishlisted(productSlug: string): Promise<boolean> {
    try {
      const params = new URLSearchParams();
      params.set('productSlug', productSlug);

      const response = await apiClient.get<WishlistStatusResponse>(
        `/customer/wishlist/status?${params.toString()}`
      );
      return response.isWishlisted;
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
      return false;
    }
  },

  /**
   * DELETE /customer/wishlist/items/{itemId} - Remove from wishlist
   */
  async removeFromWishlist(itemId: string): Promise<WishlistItem[]> {
    const response = await apiClient.delete<WishlistResponse>(
      `/customer/wishlist/items/${itemId}`
    );
    if (!response || !response.items) {
      return [];
    }
    return mapWishlistResponse(response).items;
  },
};
