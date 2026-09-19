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

// Convert relative image URLs to absolute URLs
function toAbsoluteUrl(url: string | undefined): string {
  if (!url) return '/placeholder-product.jpg';
  if (url.startsWith('http')) return url;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const origin = baseUrl.split('/api/v1')[0] || window.location.origin;
  return origin + url;
}

// Transform backend ProductCard to frontend Product
function toProduct(card: any): Product {
  // Extract size strings from size objects if needed
  const sizes = (card.sizes || []).map((s: any) =>
    typeof s === 'string' ? s : s.size
  );

  return {
    id: String(card.id),
    slug: card.slug,
    name: card.name,
    brand: card.brand || 'MoodBuds',
    moodId: 'happy' as MoodId, // Will be enriched if needed
    price: card.effectivePrice || card.price || 0,
    originalPrice: card.discountPrice ? card.price : undefined,
    image: toAbsoluteUrl(card.primaryImageUrl),
    sizes: sizes,
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
   * GET /products/{slug} - Get product detail by slug or id
   * Backend returns full product details including sizes, colors, description, images
   */
  async getProductById(slugOrId: string): Promise<Product | null> {
    try {
      console.log('[httpProductApi] Fetching product:', slugOrId);
      const response = await apiClient.get<any>(`/products/${slugOrId}`);
      console.log('[httpProductApi] Got response:', response);

      // Map backend mood slug to frontend MoodId
      const moodMap: Record<string, MoodId> = {
        'happy': 'happy', 'confident': 'confident', 'cool': 'cool',
        'professional': 'professional', 'party': 'party', 'energetic': 'energetic',
        'romantic': 'romantic', 'calm': 'calm', 'minimal': 'minimal',
      };

      // Parse colors if they come as objects or simple names
      const colors = (response.colors || []).map((c: any) => ({
        name: typeof c === 'string' ? c : c.name || '',
        hex: typeof c === 'string' ? '#999999' : c.hex || '#999999',
      }));

      // Backend returns detailed product with all fields
      // Extract size strings from size objects if needed
      const sizes = (response.sizes || response.availableSizes || []).map((s: any) =>
        typeof s === 'string' ? s : s.size
      );

      // Extract multiple images from backend response
      const images = (response.images || []).map((img: any) =>
        toAbsoluteUrl(img.imageUrl || img.url)
      );

      // Use first image as primary, or primaryImageUrl if no images
      const primaryImage = images.length > 0 ? images[0] : toAbsoluteUrl(response.primaryImageUrl);

      return {
        id: String(response.id),
        slug: response.slug,
        name: response.name,
        brand: response.brand || 'MoodBuds',
        moodId: moodMap[response.moodId] || 'happy',
        price: response.effectivePrice || response.price || 0,
        originalPrice: response.discountPrice ? response.price : undefined,
        image: primaryImage,
        images: images,
        sizes: sizes,
        colors: colors,
        rating: response.rating || 4.5,
        reviewCount: response.reviewCount || 0,
        description: response.description || response.productDescription || '',
      };
    } catch (error) {
      console.error(`Failed to fetch product ${slugOrId}:`, error);
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
