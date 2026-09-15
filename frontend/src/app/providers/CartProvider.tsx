import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Cart, Product } from '../../types';
import { cartService } from '../../features/cart/services/cartService';
import { useToast } from './ToastProvider';

const EMPTY_CART: Cart = { items: [], subtotal: 0, savings: 0, delivery: 0, discount: 0, total: 0, promoCode: null };

interface CartContextValue {
  cart: Cart;
  loading: boolean;
  addToCart: (product: Product, size: string, color?: string | null, qty?: number) => Promise<void>;
  updateQty: (itemId: string, qty: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const refresh = useCallback(async () => {
    const next = await cartService.getCart();
    setCart(next);
  }, []);

  useEffect(() => {
    setLoading(true);
    cartService
      .getCart()
      .then(setCart)
      .finally(() => setLoading(false));
  }, []);

  const addToCart = useCallback(
    async (product: Product, size: string, color?: string | null, qty = 1) => {
      const next = await cartService.addToCart({ product, size, color, qty });
      setCart(next);
      toast.success('Added to bag');
    },
    [toast]
  );

  const updateQty = useCallback(async (itemId: string, qty: number) => {
    const next = await cartService.updateCartItem({ itemId, qty });
    setCart(next);
  }, []);

  const removeItem = useCallback(
    async (itemId: string) => {
      const next = await cartService.removeCartItem(itemId);
      setCart(next);
      toast.info('Removed from bag');
    },
    [toast]
  );

  const applyPromoCode = useCallback(
    async (code: string) => {
      try {
        const next = await cartService.applyPromoCode(code);
        setCart(next);
        toast.success(`${code.toUpperCase()} applied`);
        return true;
      } catch (error) {
        let text='That code did not quite fit. Check it and try again.';
        if(error instanceof Error){try{const body=JSON.parse(error.message) as {detail?:string;message?:string};text=body.detail||body.message||text;}catch{/* friendly fallback */}}
        toast.error(text);
        return false;
      }
    },
    [toast]
  );

  const removePromoCode = useCallback(async () => {
    const next=await cartService.removePromoCode(); setCart(next); toast.info('Coupon removed');
  },[toast]);

  const value = useMemo(
    () => ({ cart, loading, addToCart, updateQty, removeItem, applyPromoCode, removePromoCode, refresh }),
    [cart, loading, addToCart, updateQty, removeItem, applyPromoCode, removePromoCode, refresh]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
