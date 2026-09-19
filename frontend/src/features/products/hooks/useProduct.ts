import { useEffect, useState } from 'react';
import type { Product } from '../../../types';
import { productService } from '../services/productService';

interface UseProductResult {
  product: Product | null;
  related: Product[];
  loading: boolean;
  error: string | null;
}

export function useProduct(id: string | undefined): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    console.log('[useProduct] Fetching product:', id);
    productService
      .getProductById(id)
      .then(async (p) => {
        if (cancelled) return;
        console.log('[useProduct] Got product:', p);
        if (!p) {
          if (!cancelled) setError(`Product "${id}" not found`);
          return;
        }
        setProduct(p);
        try {
          const rel = await productService.getRelatedProducts(p);
          if (!cancelled) setRelated(rel);
        } catch (relErr) {
          console.error('[useProduct] Failed to fetch related:', relErr);
        }
      })
      .catch((err) => {
        console.error('[useProduct] Error fetching product:', err);
        if (!cancelled) setError('Could not load this product right now.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, related, loading, error };
}
