import type { Wishlist, WishlistItem, AddToWishlistRequest } from '../../../types';
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
  async getWishlist(): Promise<Wishlist> {
    const response = await apiClient.get<WishlistResponse>('/customer/wishlist');
    return mapWishlistResponse(response);
  },

  /**
   * POST /customer/wishlist/items - Add product to wishlist
   */
  async addToWishlist(request: AddToWishlistRequest): Promise<Wishlist> {
    const payload = {
      productSlug: request.productId, // Assuming productId is the slug
      size: request.size || undefined,
    };

    const response = await apiClient.post<WishlistResponse>(
      '/customer/wishlist/items',
      payload
    );
    return mapWishlistResponse(response);
  },

  /**
   * GET /customer/wishlist/status - Check if product is wishlisted
   */
  async checkWishlistStatus(productSlug: string, size?: string): Promise<boolean> {
    try {
      const params = new URLSearchParams();
      params.set('productSlug', productSlug);
      if (size) params.set('size', size);

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
  async removeFromWishlist(itemId: string): Promise<Wishlist> {
    const response = await apiClient.delete<WishlistResponse>(
      `/customer/wishlist/items/${itemId}`
    );
    return mapWishlistResponse(response);
  },

  /**
   * DELETE /customer/wishlist - Clear entire wishlist
   */
  async clearWishlist(): Promise<Wishlist> {
    const response = await apiClient.delete<WishlistResponse>('/customer/wishlist');
    return mapWishlistResponse(response);
  },

  /**
   * POST /customer/wishlist/items/{itemId}/move-to-cart - Move wishlist item to cart
   */
  async moveToCart(itemId: string, quantity: number = 1): Promise<any> {
    const response = await apiClient.post(
      `/customer/wishlist/items/${itemId}/move-to-cart`,
      { quantity }
    );
    return response;
  },
};
