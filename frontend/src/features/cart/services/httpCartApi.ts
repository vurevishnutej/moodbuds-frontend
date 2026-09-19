import type { Cart, CartItem, AddToCartRequest } from '../../../types';
import { apiClient } from '../../../services/api/apiClient';
import type { CartApi, CheckoutApi } from './cartApi';

interface AddCartItemRequest {
  productSlug: string;
  size: string;
  quantity: number;
}

// Convert relative image URLs to absolute URLs
function toAbsoluteUrl(url: string | undefined): string {
  if (!url) return '/placeholder-product.jpg';
  if (url.startsWith('http')) return url;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const origin = baseUrl.split('/api/v1')[0] || window.location.origin;
  return origin + url;
}

/**
 * Convert API CartResponse to frontend Cart format
 */
function mapCartResponse(response: any): Cart {
  const items = response.items?.map((item: any) => ({
    id: String(item.id),
    productId: String(item.productId),
    name: item.productName || 'Product',
    brand: 'MoodBuds',
    price: item.effectiveUnitPrice || item.currentUnitPrice || 0,
    originalPrice: item.currentUnitDiscountPrice ? item.currentUnitPrice : null,
    qty: item.quantity || 0,
    size: item.size || '',
    color: null,
    image: toAbsoluteUrl(item.primaryImageUrl),
    moodId: 'happy',
  })) as CartItem[] || [];

  const totals = response.totals || { sellingSubtotal: 0, gstAmount: 0, grandTotal: 0, productDiscount: 0 };

  return {
    items,
    subtotal: totals.sellingSubtotal || 0,
    savings: totals.productDiscount || 0,
    delivery: 0,
    discount: 0,
    total: totals.grandTotal || 0,
    promoCode: null,
  };
}

/**
 * Real HTTP Cart API implementation
 */
export const httpCartApi: CartApi = {
  /**
   * GET /customer/cart - Get authenticated customer's cart
   */
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<any>('/customer/cart');
    return mapCartResponse(response);
  },

  /**
   * POST /customer/cart/items - Add item to cart
   */
  async addToCart(request: AddToCartRequest): Promise<Cart> {
    const payload: AddCartItemRequest = {
      productSlug: request.product.slug || String(request.product.id),
      size: request.size,
      quantity: request.qty || 1,
    };

    const response = await apiClient.post<any>('/customer/cart/items', payload);
    return mapCartResponse(response);
  },

  /**
   * PATCH /customer/cart/items/{itemId} - Update cart item
   */
  async updateCartItem(request: any): Promise<Cart> {
    const payload: any = {};
    if (request.qty !== undefined) payload.quantity = request.qty;
    if (request.size !== undefined) payload.size = request.size;
    if (request.itemId !== undefined) {
      const response = await apiClient.patch<any>(
        `/customer/cart/items/${request.itemId}`,
        payload
      );
      return mapCartResponse(response);
    }
    throw new Error('itemId is required');
  },

  /**
   * DELETE /customer/cart/items/{itemId} - Remove item from cart
   */
  async removeCartItem(itemId: string): Promise<Cart> {
    const response = await apiClient.delete<any>(`/customer/cart/items/${itemId}`);
    return mapCartResponse(response);
  },

  /**
   * POST /customer/cart - Apply promo code
   */
  async applyPromoCode(code: string): Promise<Cart> {
    try {
      const response = await apiClient.post<any>('/customer/cart/apply-coupon', { code });
      return mapCartResponse(response);
    } catch (error) {
      throw new Error(`Invalid promo code: ${code}`);
    }
  },

  /**
   * DELETE /customer/cart - Clear cart
   */
  async clearCart(): Promise<Cart> {
    const response = await apiClient.delete<any>('/customer/cart');
    return mapCartResponse(response);
  },
};

/**
 * Checkout API for placing orders
 */
export const httpCheckoutApi: CheckoutApi = {
  async checkout(cart: Cart) {
    // This would be handled by the order API
    return {
      success: true,
      orderId: '',
      message: 'Order placed successfully',
    };
  },
};
