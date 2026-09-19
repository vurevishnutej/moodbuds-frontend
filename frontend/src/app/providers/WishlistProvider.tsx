import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { WishlistItem, Product } from '../../types';
import { wishlistService } from '../../features/wishlist/services/wishlistService';
import { useToast } from './ToastProvider';
import { useAuth } from './AuthProvider';

interface WishlistContextValue {
  items: WishlistItem[];
  loading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { isAuthenticated, customer } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) { setItems([]); setLoading(false); return; }
    setLoading(true);
    wishlistService.getWishlist().then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  }, [isAuthenticated, customer?.id]);

  const isWishlisted = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  );

  const toggleWishlist = useCallback(
    async (product: Product) => {
      if (!isAuthenticated) { toast.info('Please sign in to save items'); return; }
      const existing = items.find((i) => i.productId === product.id);
      if (existing) {
        const next = await wishlistService.removeFromWishlist(existing.id);
        setItems(next);
        toast.info('Removed from wishlist');
      } else {
        const next = await wishlistService.addToWishlist(product);
        setItems(next);
        toast.success('Saved to wishlist');
      }
    },
    [isAuthenticated, items, toast]
  );

  const removeItem = useCallback(async (itemId: string) => {
    const next = await wishlistService.removeFromWishlist(itemId);
    setItems(next);
  }, []);

  const value = useMemo(
    () => ({ items, loading, isWishlisted, toggleWishlist, removeItem }),
    [items, loading, isWishlisted, toggleWishlist, removeItem]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
