import type { Cart, AddToCartRequest, UpdateCartItemRequest, CheckoutResult } from '../../../types';

export interface CartApi {
  getCart(): Promise<Cart>;
  addToCart(request: AddToCartRequest): Promise<Cart>;
  updateCartItem(request: UpdateCartItemRequest): Promise<Cart>;
  removeCartItem(itemId: string): Promise<Cart>;
  applyPromoCode(code: string): Promise<Cart>;
  clearCart(): Promise<Cart>;
}

export interface CheckoutApi {
  checkout(cart: Cart): Promise<CheckoutResult>;
}
