/**
 * Small typed wrapper around localStorage.
 * Never call `localStorage` directly from components — go through this.
 */

const NAMESPACE = 'mb_';

function key(name: string): string {
  return `${NAMESPACE}${name}`;
}

export const storage = {
  get<T>(name: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key(name));
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(name: string, value: T): void {
    try {
      localStorage.setItem(key(name), JSON.stringify(value));
    } catch {
      // localStorage unavailable (private mode, quota, etc.) — fail silently.
    }
  },

  remove(name: string): void {
    try {
      localStorage.removeItem(key(name));
    } catch {
      // ignore
    }
  },
};

export const STORAGE_KEYS = {
  cart: 'cart',
  wishlist: 'wishlist',
  promo: 'promo',
} as const;
