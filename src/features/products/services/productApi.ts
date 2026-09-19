import type { Product, ProductQuery, MoodId } from '../../../types';

/** Contract shared by database-backed product views and hooks. */
export interface ProductApi {
  getProducts(query?: ProductQuery): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductsByMood(moodId: MoodId): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  getRelatedProducts(product: Product, limit?: number): Promise<Product[]>;
}
