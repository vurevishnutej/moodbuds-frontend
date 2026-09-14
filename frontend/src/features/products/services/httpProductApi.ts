import type { Product, ProductQuery, MoodId } from '../../../types';
import { apiClient } from '../../../services/api/apiClient';
import type { ProductApi } from './productApi';

interface ProductCard {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating: number;
  reviewCount: number;
}

interface ProductDetail extends ProductCard {
  moodId: MoodId;
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  description: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Real HTTP Product API implementation using backend endpoints.
 * Maps frontend ProductQuery to backend query parameters.
 */
export const httpProductApi: ProductApi = {
  /**
   * GET /products - Search and filter products
   */
  async getProducts(query?: ProductQuery): Promise<Product[]> {
    const params = new URLSearchParams();
    if (query?.search) params.set('q', query.search);
    if (query?.moodId) params.set('mood', query.moodId);
    if (query?.sort) params.set('sort', query.sort);
    if (query?.onSale) params.set('onSale', 'true');
    if (query?.isNew) params.set('newArrival', 'true');

    const queryStr = params.toString();
    const path = queryStr ? `/products?${queryStr}` : '/products';

    const response = await apiClient.get<PageResponse<ProductCard>>(path);
    return response.content as unknown as Product[];
  },

  /**
   * GET /products/{slug} - Get product detail by slug
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const product = await apiClient.get<ProductDetail>(`/products/${id}`);
      return product as unknown as Product;
    } catch (error) {
      return null;
    }
  },

  /**
   * GET /moods/{slug}/products - Get products for a specific mood
   */
  async getProductsByMood(moodId: MoodId): Promise<Product[]> {
    try {
      const response = await apiClient.get<PageResponse<ProductCard>>(`/moods/${moodId}/products`);
      return response.content as unknown as Product[];
    } catch (error) {
      console.error(`Failed to fetch products for mood ${moodId}:`, error);
      return [];
    }
  },

  /**
   * GET /products - Search products by query
   */
  async searchProducts(query: string): Promise<Product[]> {
    const params = new URLSearchParams();
    params.set('q', query);

    const response = await apiClient.get<PageResponse<ProductCard>>(`/products?${params.toString()}`);
    return response.content as unknown as Product[];
  },

  /**
   * Note: Backend doesn't have /products/{id}/related endpoint yet.
   * For now, we fetch same mood products as a fallback.
   */
  async getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
    try {
      const response = await apiClient.get<PageResponse<ProductCard>>(
        `/moods/${product.moodId}/products?size=${limit}`
      );
      // Filter out the current product
      return response.content
        .filter((p: ProductCard) => p.id !== product.id)
        .slice(0, limit) as unknown as Product[];
    } catch (error) {
      console.error('Failed to fetch related products:', error);
      return [];
    }
  },
};
