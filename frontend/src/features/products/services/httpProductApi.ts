import type { Product, ProductQuery, MoodId } from '../../../types';
import { apiClient } from '../../../services/api/apiClient';
import type { ProductApi } from './productApi';

interface ProductCard {
  id: string | number;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  primaryImageUrl: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
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

// Map frontend sort values to backend sort values
function mapSort(sort?: string): string {
  switch (sort) {
    case 'new':
      return 'newest';
    case 'price-asc':
      return 'price-asc';
    case 'price-desc':
      return 'price-desc';
    default:
      return 'newest';
  }
}

// Transform backend ProductCard to frontend Product
function toProduct(card: any): Product {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  let imageUrl = card.primaryImageUrl || '/placeholder-product.jpg';
  
  // Convert relative URLs to absolute using backend origin (not full base URL which includes /api/v1)
  if (imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
    // Extract origin from base URL (e.g., "http://localhost:8080" from "http://localhost:8080/api/v1")
    const origin = baseUrl.split('/api/v1')[0] || window.location.origin;
    imageUrl = origin + imageUrl;
  }
  
  return {
    id: String(card.id),
    name: card.name,
    brand: card.brand || 'MoodBuds',
    moodId: 'happy' as MoodId, // Will be enriched if needed
    price: card.effectivePrice || card.price || 0,
    originalPrice: card.discountPrice ? card.price : undefined,
    image: imageUrl,
    sizes: [],
    colors: [],
    rating: card.rating || 0,
    reviewCount: card.reviewCount || 0,
    description: '',
  };
}

export const httpProductApi: ProductApi = {
  /**
   * GET /products - Search and filter products
   */
  async getProducts(query?: ProductQuery): Promise<Product[]> {
    const params = new URLSearchParams();
    if (query?.search) params.set('q', query.search);
    if (query?.moodId) params.set('mood', query.moodId);
    if (query?.sort) params.set('sort', mapSort(query.sort));
    if (query?.onSale) params.set('onSale', 'true');
    if (query?.isNew) params.set('newArrival', 'true');

    const queryStr = params.toString();
    const path = queryStr ? `/products?${queryStr}` : '/products';

    const response = await apiClient.get<PageResponse<any>>(path);
    return response.content.map(toProduct);
  },

  /**
   * GET /products/{slug} - Get product detail by slug
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const product = await apiClient.get<any>(`/products/${id}`);
      return toProduct(product);
    } catch (error) {
      return null;
    }
  },

  /**
   * GET /moods/{slug}/products - Get products for a specific mood
   */
  async getProductsByMood(moodId: MoodId): Promise<Product[]> {
    try {
      const response = await apiClient.get<PageResponse<any>>(`/moods/${moodId}/products`);
      return response.content.map(toProduct);
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

    const response = await apiClient.get<PageResponse<any>>(`/products?${params.toString()}`);
    return response.content.map(toProduct);
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
