import type { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '../../../types';
import { apiClient } from '../../../services/api/apiClient';
import type { CartApi, CheckoutApi } from './cartApi';

interface CartItemResponse {
  id: number;
  productId: number;
  productSlug: string;
  productName: string;
  primaryImageUrl: string;
  currentUnitPrice: number;
  effectiveUnitPrice: number;
  quantity: number;
  size: string;
}

interface CartResponse {
  cartId: number;
  items: CartItemResponse[];
  totals: { mrpSubtotal:number; productDiscount:number; sellingSubtotal:number; gstAmount:number; grandTotal:number };
}

interface CouponCartResponse { applied:boolean; coupon?:{code:string}|null; totals:{productDiscount:number;sellingSubtotal:number;couponDiscount:number;grandTotal:number}; cart:CartResponse; }

interface AddCartItemRequest {
  productSlug: string;
  size: string;
  color?: string;
  quantity: number;
}

interface UpdateCartItemPayload {
  quantity?: number;
  size?: string;
}

interface MoveToWishlistResponse { cart: CartResponse }

/**
 * Convert API CartResponse to frontend Cart format
 */
function mapCartResponse(response: CartResponse, coupon?: CouponCartResponse): Cart {
  return {
    items: response.items.map(item => ({
      id: String(item.id),
      productId: item.productSlug || String(item.productId),
      name: item.productName,
      brand: '',
      price: item.effectiveUnitPrice / 100,
      originalPrice: item.currentUnitPrice > item.effectiveUnitPrice ? item.currentUnitPrice / 100 : null,
      qty: item.quantity,
      size: item.size,
      color: null,
      image: item.primaryImageUrl,
    })) as CartItem[],
    subtotal: (coupon?.totals.sellingSubtotal ?? response.totals.sellingSubtotal) / 100,
    savings: (coupon?.totals.productDiscount ?? response.totals.productDiscount) / 100,
    delivery: 0,
    discount: (coupon?.totals.couponDiscount ?? 0) / 100,
    total: (coupon?.totals.grandTotal ?? response.totals.grandTotal) / 100,
    promoCode: coupon?.coupon?.code || null,
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
    const response = await apiClient.post<CouponCartResponse>('/customer/cart/coupon/validate');
    return mapCartResponse(response.cart, response);
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
    const payload: UpdateCartItemPayload = {};
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
   * POST /customer/cart/coupon - Apply promo code
   */
  async applyPromoCode(code: string): Promise<Cart> {
    const response = await apiClient.post<CouponCartResponse>('/customer/cart/coupon', {
      code,
    });
    return mapCartResponse(response.cart, response);
  },

  async moveToWishlist(itemId: string): Promise<Cart> {
    const response = await apiClient.post<MoveToWishlistResponse>(
      `/customer/cart/items/${itemId}/move-to-wishlist`,
    );
    return mapCartResponse(response.cart);
  },

  async removePromoCode(): Promise<Cart> {
    const response = await apiClient.delete<CouponCartResponse>('/customer/cart/coupon');
    return mapCartResponse(response.cart, response);
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
  async checkout(_cart: Cart) {
    // This would be handled by the order API
    return {
      success: true,
      orderId: '',
      message: 'Order placed successfully',
    };
  },
};
