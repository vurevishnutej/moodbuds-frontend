import type { Cart, CartItem, WishlistItem, AddToCartRequest, UpdateCartItemRequest, CheckoutResult } from '../../../types';
import { CART_SEED } from '../../../data/cartSeed';
import { storage, STORAGE_KEYS } from '../../../services/storage/storageService';
import { delay, uniqueId } from '../../../utils/format';
import type { CartApi, CheckoutApi } from './cartApi';

const FREE_DELIVERY_THRESHOLD = 999;
const STANDARD_DELIVERY_FEE = 99;

const PROMO_CODES: Record<string, { off: number; minOrder: number }> = {
  MOOD300: { off: 300, minOrder: 1499 },
};

function readItems(): CartItem[] {
  return storage.get<CartItem[]>(STORAGE_KEYS.cart, CART_SEED);
}
function writeItems(items: CartItem[]): void {
  storage.set(STORAGE_KEYS.cart, items);
}
function readPromo(): string | null {
  return storage.get<string | null>(STORAGE_KEYS.promo, null);
}
function writePromo(code: string | null): void {
  storage.set(STORAGE_KEYS.promo, code);
}

function computeCart(): Cart {
  const items = readItems();
  const promoCode = readPromo();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const savings = items.reduce((sum, i) => sum + (i.originalPrice ? (i.originalPrice - i.price) * i.qty : 0), 0);
  const delivery = items.length === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;

  let discount = 0;
  if (promoCode && PROMO_CODES[promoCode] && subtotal >= PROMO_CODES[promoCode].minOrder) {
    discount = PROMO_CODES[promoCode].off;
  }

  const total = Math.max(0, subtotal - discount + delivery);

  return { items, subtotal, savings, delivery, discount, total, promoCode };
}

export const mockCartApi: CartApi = {
  async getCart() {
    await delay(150);
    return computeCart();
  },

  async addToCart({ product, size, color, qty = 1 }: AddToCartRequest) {
    await delay(200);
    const items = readItems();
    const existing = items.find((i) => i.productId === product.id && i.size === size && i.color === (color ?? null));
    if (!existing) {
      items.push({
        id: uniqueId('cart'),
        productId: product.id,
        moodId: product.moodId,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        qty,
        size,
        color: color ?? null,
        image: product.image,
      });
    }
    writeItems(items);
    return computeCart();
  },

  async updateCartItem({ itemId, qty }: UpdateCartItemRequest) {
    await delay(150);
    let items = readItems();
    if (qty <= 0) {
      items = items.filter((i) => i.id !== itemId);
    } else {
      items = items.map((i) => (i.id === itemId ? { ...i, qty } : i));
    }
    writeItems(items);
    return computeCart();
  },

  async removeCartItem(itemId: string) {
    await delay(150);
    writeItems(readItems().filter((i) => i.id !== itemId));
    return computeCart();
  },

  async applyPromoCode(code: string) {
    await delay(250);
    const normalized = code.trim().toUpperCase();
    if (!PROMO_CODES[normalized]) {
      throw new Error('Invalid promo code');
    }
    writePromo(normalized);
    return computeCart();
  },

  async moveToWishlist(itemId: string) {
    await delay(150);
    const items = readItems();
    const item = items.find((candidate) => candidate.id === itemId);
    if (!item) return computeCart();
    const wishlist = storage.get<WishlistItem[]>(STORAGE_KEYS.wishlist, []);
    if (!wishlist.some((saved) => saved.productId === item.productId && saved.sizes.includes(item.size))) {
      wishlist.push({
        id: uniqueId('wl'), productId: item.productId, moodId: item.moodId, name: item.name,
        brand: item.brand, price: item.price, originalPrice: item.originalPrice,
        sizes: [item.size], image: item.image, savedAt: Date.now(),
      });
      storage.set(STORAGE_KEYS.wishlist, wishlist);
    }
    writeItems(items.filter((candidate) => candidate.id !== itemId));
    return computeCart();
  },

  async removePromoCode() {
    writePromo(null);
    await delay();
    return computeCart();
  },

  async clearCart() {
    await delay(150);
    writeItems([]);
    writePromo(null);
    return computeCart();
  },
};

export const mockCheckoutApi: CheckoutApi = {
  async checkout(_cart: Cart) {
    await delay(600);
    const result: CheckoutResult = { success: true, orderId: 'MB-DEMO-' + Math.floor(10000 + Math.random() * 89999) };
    await mockCartApi.clearCart();
    return result;
  },
};
