import type { Product, ProductQuery } from '../../../types';
import { PRODUCTS } from '../../../data/products';
import { delay } from '../../../utils/format';
import type { ProductApi } from './productApi';

function applyQuery(items: Product[], query?: ProductQuery): Product[] {
  if (!query) return items;
  let out = items;

  if (query.moodId) out = out.filter((p) => p.moodId === query.moodId);
  if (query.onSale) out = out.filter((p) => p.badge === 'Sale');
  if (query.isNew) out = out.filter((p) => p.badge === 'New');
  if (typeof query.minPrice === 'number') out = out.filter((p) => p.price >= query.minPrice!);
  if (typeof query.maxPrice === 'number') out = out.filter((p) => p.price <= query.maxPrice!);
  if (query.sizes?.length) out = out.filter((p) => p.sizes.some((s) => query.sizes!.includes(s)));
  if (query.search) {
    const q = query.search.toLowerCase();
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.moodId.toLowerCase().includes(q)
    );
  }

  switch (query.sort) {
    case 'price-asc':
      out = [...out].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      out = [...out].sort((a, b) => b.price - a.price);
      break;
    case 'new':
      out = [...out].sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
      break;
    default:
      break;
  }

  return out;
}

export const mockProductApi: ProductApi = {
  async getProducts(query) {
    await delay(200);
    return applyQuery(PRODUCTS, query);
  },

  async getProductById(id) {
    await delay(150);
    return PRODUCTS.find((p) => p.id === id) ?? null;
  },

  async getProductsByMood(moodId) {
    await delay(200);
    return PRODUCTS.filter((p) => p.moodId === moodId);
  },

  async searchProducts(query) {
    await delay(200);
    return applyQuery(PRODUCTS, { search: query });
  },

  async getRelatedProducts(product, limit = 4) {
    await delay(150);
    return PRODUCTS.filter((p) => p.moodId === product.moodId && p.id !== product.id).slice(0, limit);
  },
};
