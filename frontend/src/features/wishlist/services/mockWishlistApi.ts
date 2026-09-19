import type { WishlistItem, Product } from '../../../types';
import { WISHLIST_SEED } from '../../../data/wishlistSeed';
import { storage, STORAGE_KEYS } from '../../../services/storage/storageService';
import { delay, uniqueId } from '../../../utils/format';
import type { WishlistApi } from './wishlistApi';

function readItems(): WishlistItem[] {
  return storage.get<WishlistItem[]>(STORAGE_KEYS.wishlist, WISHLIST_SEED);
}
function writeItems(items: WishlistItem[]): void {
  storage.set(STORAGE_KEYS.wishlist, items);
}

export const mockWishlistApi: WishlistApi = {
  async getWishlist() {
    await delay(150);
    return readItems();
  },

  async addToWishlist(product: Product) {
    await delay(150);
    const items = readItems();
    if (items.some((i) => i.productId === product.id)) return items;
    items.push({
      id: uniqueId('wl'),
      productId: product.id,
      moodId: product.moodId,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice ?? null,
      badge: product.badge ?? null,
      sizes: product.sizes,
      image: product.image,
      savedAt: Date.now(),
    });
    writeItems(items);
    return items;
  },

  async removeFromWishlist(itemId: string) {
    await delay(120);
    const items = readItems().filter((i) => i.id !== itemId);
    writeItems(items);
    return items;
  },

  async isWishlisted(productId: string) {
    return readItems().some((i) => i.productId === productId);
  },
};
