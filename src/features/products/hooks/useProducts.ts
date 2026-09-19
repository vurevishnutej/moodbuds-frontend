import { useEffect, useState, useCallback } from 'react';
import type { Product, ProductQuery } from '../../../types';
import { productService } from '../services/productService';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(query?: ProductQuery): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const queryKey = JSON.stringify(query ?? {});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    productService
      .getProducts(query)
      .then((result) => {
        if (!cancelled) setProducts(result);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load products right now.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { products, loading, error, refetch };
}
