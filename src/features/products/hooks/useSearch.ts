import { useEffect, useState } from 'react';
import type { Product } from '../../../types';
import { productService } from '../services/productService';

export function useSearch(query: string, debounceMs = 250) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handle = setTimeout(() => {
      productService.searchProducts(query).then((res) => {
        setResults(res);
        setLoading(false);
      });
    }, debounceMs);
    return () => clearTimeout(handle);
  }, [query, debounceMs]);

  return { results, loading };
}
