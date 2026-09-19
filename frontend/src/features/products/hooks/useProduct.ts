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
    productService
      .getProductById(id)
      .then(async (p) => {
        if (cancelled) return;
        setProduct(p);
        if (p) {
          const rel = await productService.getRelatedProducts(p);
          if (!cancelled) setRelated(rel);
        }
      })
      .catch(() => {
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
