import type { Product, ProductQuery, MoodId } from '../../../types';

/**
 * Contract the UI depends on. A future `HttpProductApi` implementing this
 * interface can replace `MockProductApi` with zero changes to components.
 */
export interface ProductApi {
  getProducts(query?: ProductQuery): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductsByMood(moodId: MoodId): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  getRelatedProducts(product: Product, limit?: number): Promise<Product[]>;
}
