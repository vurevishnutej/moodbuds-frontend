import type { CartItem } from '../types';

/** Extracted from the original HTML's `CART_ITEMS` array. */
export const CART_SEED: CartItem[] = [
  {
    id: 'cart-1', productId: 'romantic-2', moodId: 'romantic', name: 'Satin Slip Dress', brand: 'Blush House',
    price: 2499, originalPrice: 2999, qty: 1, size: 'M', color: 'Blush',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&h=380&q=80',
  },
  {
    id: 'cart-2', productId: 'romantic-1', moodId: 'romantic', name: 'Lace Trim Blouse', brand: 'Petal Studio',
    price: 1399, originalPrice: null, qty: 1, size: 'S', color: 'Ivory',
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=300&h=380&q=80',
  },
  {
    id: 'cart-3', productId: 'romantic-5', moodId: 'romantic', name: 'Pearl Detail Earrings', brand: 'Tender Things',
    price: 799, originalPrice: 999, qty: 1, size: 'One size', color: null,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&h=380&q=80',
  },
];
