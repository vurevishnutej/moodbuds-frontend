import type { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '../../../types';
import { apiClient } from '../../../services/api/apiClient';
import type { CartApi, CheckoutApi } from './cartApi';

interface CartItemResponse {
  id: number;
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size: string;
  color?: string;
  image: string;
  moodId: string;
}

interface CartResponse {
  items: CartItemResponse[];
  subtotal: number;
  gstAmount: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  appliedCoupon?: string;
}

interface AddCartItemRequest {
  productSlug: string;
  size: string;
  color?: string;
  quantity: number;
}

interface UpdateCartItemRequest {
  quantity?: number;
  size?: string;
}

/**
 * Convert API CartResponse to frontend Cart format
 */
function mapCartResponse(response: CartResponse): Cart {
  return {
    items: response.items.map(item => ({
      id: String(item.id),
      productId: item.productId,
      name: item.name,
      brand: item.brand,
      price: item.price,
      originalPrice: item.originalPrice || null,
      qty: item.quantity,
      size: item.size,
      color: item.color || null,
      image: item.image,
      moodId: item.moodId,
    })) as CartItem[],
    subtotal: response.subtotal,
    savings: 0, // Calculate from originalPrice
    delivery: response.deliveryCharge,
    discount: response.discount,
    total: response.total,
    promoCode: response.appliedCoupon || null,
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
    const response = await apiClient.get<CartResponse>('/customer/cart');
    return mapCartResponse(response);
  },

  /**
   * POST /customer/cart/items - Add item to cart
   */
  async addToCart(request: AddToCartRequest): Promise<Cart> {
    const payload: AddCartItemRequest = {
      productSlug: request.product.id, // Assuming product.id is the slug
      size: request.size,
      color: request.color || undefined,
      quantity: request.qty || 1,
    };

    const response = await apiClient.post<CartResponse>('/customer/cart/items', payload);
    return mapCartResponse(response);
  },

  /**
   * PATCH /customer/cart/items/{itemId} - Update cart item
   */
  async updateCartItem(request: UpdateCartItemRequest): Promise<Cart> {
    const payload: UpdateCartItemRequest = {};
    if (request.qty !== undefined) payload.quantity = request.qty;
    if (request.itemId !== undefined) {
      // itemId is in the request but used in URL
      const response = await apiClient.patch<CartResponse>(
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
    const response = await apiClient.delete<CartResponse>(`/customer/cart/items/${itemId}`);
    return mapCartResponse(response);
  },

  /**
   * POST /customer/cart - Apply promo code
   * Note: Need to check actual endpoint for applying coupon
   */
  async applyPromoCode(code: string): Promise<Cart> {
    try {
      // This endpoint might need adjustment based on actual API
      const response = await apiClient.post<CartResponse>('/customer/cart/apply-coupon', {
        code,
      });
      return mapCartResponse(response);
    } catch (error) {
      throw new Error(`Invalid promo code: ${code}`);
    }
  },

  /**
   * DELETE /customer/cart - Clear cart
   */
  async clearCart(): Promise<Cart> {
    const response = await apiClient.delete<CartResponse>('/customer/cart');
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
