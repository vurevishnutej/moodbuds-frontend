import type { MoodId, Product, ProductQuery } from '../../../types';
import { apiClient } from '../../../services/api/apiClient';
import type { ProductApi } from './productApi';

interface CategoryRef { name: string }

interface ProductCardResponse {
  id: number;
  slug: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  effectivePrice: number;
  primaryImageUrl?: string | null;
  newArrival: boolean;
  category: CategoryRef;
}

interface ProductDetailResponse extends ProductCardResponse {
  description?: string | null;
  colorName?: string | null;
  images: Array<{ imageUrl: string; primary: boolean }>;
  sizes: Array<{ size: string; inStock: boolean }>;
  moods: Array<{ slug: string }>;
}

interface PageResponse<T> { content: T[] }

const sortForBackend = (sort: ProductQuery['sort']) => sort === 'new' ? 'newest' : sort;

function mapCard(item: ProductCardResponse, moodId: MoodId = 'happy'): Product {
  return {
    id: item.slug,
    name: item.name,
    brand: item.category.name,
    moodId,
    price: item.effectivePrice / 100,
    originalPrice: item.discountPrice != null ? item.price / 100 : null,
    badge: item.discountPrice != null ? 'Sale' : item.newArrival ? 'New' : null,
    image: item.primaryImageUrl || '',
    sizes: [],
    colors: [],
    rating: 0,
    reviewCount: 0,
    description: '',
  };
}

function mapDetail(item: ProductDetailResponse): Product {
  const primaryImage = item.images.find((image) => image.primary)?.imageUrl || item.images[0]?.imageUrl || '';
  return {
    ...mapCard({ ...item, primaryImageUrl: primaryImage }, item.moods[0]?.slug || 'happy'),
    sizes: item.sizes.filter((size) => size.inStock).map((size) => size.size),
    colors: item.colorName ? [{ name: item.colorName, hex: '#cccccc' }] : [],
    description: item.description || '',
  };
}

function mapPage(response: PageResponse<ProductCardResponse>, moodId?: MoodId, onSale?: boolean) {
  const products = response.content.map((item) => mapCard(item, moodId));
  return onSale ? products.filter((product) => product.badge === 'Sale') : products;
}

export const httpProductApi: ProductApi = {
  async getProducts(query?: ProductQuery) {
    const params = new URLSearchParams();
    if (query?.search) params.set('q', query.search);
    if (query?.moodId) params.set('mood', query.moodId);
    if (query?.sort) params.set('sort', sortForBackend(query.sort) || 'newest');
    if (query?.isNew) params.set('newArrival', 'true');
    if (query?.sizes?.[0]) params.set('productSize', query.sizes[0]);
    if (query?.minPrice != null) params.set('minPrice', String(Math.round(query.minPrice * 100)));
    if (query?.maxPrice != null) params.set('maxPrice', String(Math.round(query.maxPrice * 100)));
    params.set('size', '100');

    const response = await apiClient.get<PageResponse<ProductCardResponse>>(`/products?${params.toString()}`);
    return mapPage(response, query?.moodId, query?.onSale);
  },

  async getProductById(id: string) {
    try {
      return mapDetail(await apiClient.get<ProductDetailResponse>(`/products/${id}`));
    } catch {
      return null;
    }
  },

  async getProductsByMood(moodId: MoodId) {
    try {
      const response = await apiClient.get<PageResponse<ProductCardResponse>>(`/moods/${moodId}/products?size=100`);
      return mapPage(response, moodId);
    } catch (error) {
      console.error(`Failed to fetch products for mood ${moodId}:`, error);
      return [];
    }
  },

  async searchProducts(query: string) {
    const params = new URLSearchParams({ q: query, size: '100' });
    return mapPage(await apiClient.get<PageResponse<ProductCardResponse>>(`/products?${params.toString()}`));
  },

  async getRelatedProducts(product: Product, limit = 4) {
    try {
      const response = await apiClient.get<PageResponse<ProductCardResponse>>(
        `/moods/${product.moodId}/products?size=${limit + 1}`,
      );
      return mapPage(response, product.moodId).filter((item) => item.id !== product.id).slice(0, limit);
    } catch {
      return [];
    }
  },
};
