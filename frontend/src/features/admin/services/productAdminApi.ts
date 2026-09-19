import { adminApiClient } from './adminApiClient';
import type { AdminProduct } from '../../../data/admin';

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface MoodRow {
  id: number;
  name: string;
  slug: string | null;
  color: string | null;
  active: boolean;
}

interface GstRateRow {
  id: number;
  name: string;
  rate_percentage: number | string;
  hsn_code: string;
  is_active: number | boolean;
}

interface MediaAsset {
  id: number;
  url: string;
  originalFilename: string;
  contentType: string;
}

export interface AdminMoodOption {
  id: number;
  name: string;
  color: string | null;
}

export interface AdminGstOption {
  id: number;
  label: string;
}

export interface UploadedImage {
  mediaId: number | null;
  productImageId?: number;
  url: string;
}

export interface CreateProductPayload {
  sku: string;
  name: string;
  categoryId: number;
  subcategoryId: number;
  gstRateId: number;
  description?: string;
  colorName?: string;
  price: number;
  discountPrice?: number | null;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  returnWindowDays: number;
  sizes: { size: string; stockQuantity: number; lowStockThreshold: number; available: boolean }[];
  images: UploadedImage[];
  moodIds: number[];
  publish: boolean;
}

interface ProductSummaryRow {
  id: number;
  sku: string;
  name: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  lowStockThreshold: number;
  primaryMediaId: number | null;
  primaryImageUrl: string | null;
  moodName: string | null;
  moodColor: string | null;
  publicationStatus: string;
}

export type AdminProductStatus = 'Active' | 'Low stock' | 'Out of stock' | 'Draft';

export interface AdminProductRow {
  id: number;
  sku: string;
  name: string;
  price: number;
  mrp: number | null;
  stock: number;
  status: AdminProductStatus;
  image: string | null;
  moodName: string | null;
  moodColor: string | null;
}

function toBool(v: number | boolean): boolean {
  return v === true || v === 1;
}

/** Absolute URL a browser <img> tag can load for a stored media asset. */
export function mediaImageUrl(id: number): string {
  return `${adminApiClient.baseUrl}/media/${id}/content`;
}

export const productAdminApi = {
  async listMoods(): Promise<AdminMoodOption[]> {
    const res = await adminApiClient.get<MoodRow[]>('/admin/moods');
    return res
      .filter((m) => m.active)
      .map((m) => ({ id: m.id, name: m.name, color: m.color }));
  },

  async listGstRates(): Promise<AdminGstOption[]> {
    const res = await adminApiClient.get<PageResponse<GstRateRow>>('/admin/gst-rates?page=0&size=100');
    return res.content
      .filter((g) => toBool(g.is_active))
      .map((g) => ({ id: g.id, label: `${g.name} (${g.rate_percentage}%)` }));
  },

  async uploadProductImages(files: File[]): Promise<UploadedImage[]> {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    const assets = await adminApiClient.upload<MediaAsset[]>('/admin/media/images?kind=products', form);
    return assets.map((a) => ({ mediaId: a.id, url: mediaImageUrl(a.id) }));
  },

  async listProducts(query = ''): Promise<AdminProductRow[]> {
    const q = query.trim() ? `&q=${encodeURIComponent(query.trim())}` : '';
    const first = await adminApiClient.get<PageResponse<ProductSummaryRow>>(`/admin/products/summary?page=0&size=100${q}`);
    const rows = [...first.content];
    for (let page = 1; page < first.totalPages; page += 1) {
      const next = await adminApiClient.get<PageResponse<ProductSummaryRow>>(`/admin/products/summary?page=${page}&size=100${q}`);
      rows.push(...next.content);
    }
    return rows.map((r) => {
      const sellingPrice = r.discountPrice ?? r.price;
      const mrp = r.discountPrice != null ? r.price : null;
      let status: AdminProductStatus;
      if (r.publicationStatus !== 'PUBLISHED') status = 'Draft';
      else if (r.stock <= 0) status = 'Out of stock';
      else if (r.stock <= r.lowStockThreshold) status = 'Low stock';
      else status = 'Active';
      return {
        id: r.id,
        sku: r.sku,
        name: r.name,
        price: sellingPrice / 100,
        mrp: mrp == null ? null : mrp / 100,
        stock: r.stock,
        status,
        image: r.primaryImageUrl || (r.primaryMediaId != null ? mediaImageUrl(r.primaryMediaId) : null),
        moodName: r.moodName,
        moodColor: r.moodColor,
      };
    });
  },

  async deleteProduct(id: number): Promise<void> {
    await adminApiClient.delete<void>(`/admin/products/${id}`);
  },

  async getProduct(id: number): Promise<AdminProduct> {
    const res = await adminApiClient.get<any>(`/admin/products/${id}/full`);
    // res has structure: { product, sizes, images, moodIds, sizeChart }
    const totalStock = res.sizes && res.sizes.length > 0 ? res.sizes.reduce((sum: number, s: any) => sum + (s.stockQuantity || 0), 0) : 0;
    return {
      id: res.product.id,
      sku: res.product.sku,
      name: res.product.name,
      brand: 'Unknown',
      mood: res.moodIds && res.moodIds.length > 0 ? String(res.moodIds[0]) : 'happy',
      price: Number(res.product.discountPrice ?? res.product.price) / 100,
      stock: totalStock,
      status: res.product.publicationStatus === 'PUBLISHED' ? 'Active' : res.product.publicationStatus === 'DRAFT' ? 'Draft' : 'Out of stock',
      image: res.images && res.images.length > 0 ? (res.images[0].imageUrl || mediaImageUrl(res.images[0].mediaId)) : '/placeholder.png',
      mrp: res.product.discountPrice ? Number(res.product.price) / 100 : undefined,
      description: res.product.description,
      category: 'Unknown',
      subcategory: '',
      sizes: res.sizes ? res.sizes.map((s: any) => s.size) : [],
      sizeStocks: res.sizes ? res.sizes.map((s: any) => ({
        size: s.size,
        stockQuantity: s.stockQuantity,
        lowStockThreshold: s.lowStockThreshold,
        available: s.available,
      })) : [],
      images: res.images ? res.images.map((img: any) => ({
        productImageId: img.id,
        mediaId: img.mediaId ?? null,
        url: img.imageUrl || (img.mediaId != null ? mediaImageUrl(img.mediaId) : ''),
      })) : [],
      // Full edit form fields
      categoryId: res.product.categoryId,
      subcategoryId: res.product.subcategoryId,
      gstRateId: res.product.gstRateId,
      colorName: res.product.colorName,
      moodIds: res.moodIds && Array.isArray(res.moodIds) ? res.moodIds.map(String) : [],
      returnWindowDays: res.product.returnWindowDays || 7,
      featured: res.product.featured || false,
      newArrival: res.product.newArrival || false,
      bestSeller: res.product.bestSeller || false,
    };
  },

  async createProduct(payload: CreateProductPayload): Promise<{ id: number }> {
    const body = {
      product: {
        sku: payload.sku,
        name: payload.name,
        categoryId: payload.categoryId,
        subcategoryId: payload.subcategoryId,
        gstRateId: payload.gstRateId,
        description: payload.description || null,
        colorName: payload.colorName || null,
        price: Math.round(payload.price * 100),
        discountPrice: payload.discountPrice == null ? null : Math.round(payload.discountPrice * 100),
        featured: payload.featured,
        newArrival: payload.newArrival,
        bestSeller: payload.bestSeller,
        returnWindowDays: payload.returnWindowDays,
      },
      sizes: payload.sizes.map((s) => ({
        size: s.size,
        stockQuantity: s.stockQuantity,
        lowStockThreshold: s.lowStockThreshold,
        available: s.available,
      })),
      images: payload.images.map((image, index) => ({
        id: image.productImageId ?? null,
        mediaId: image.mediaId,
        primary: index === 0,
        sortOrder: index,
      })),
      moodIds: payload.moodIds,
      publicationAction: payload.publish ? 'PUBLISH' : 'SAVE_DRAFT',
    };
    const created = await adminApiClient.post<{ product: { id: number } }>('/admin/products/complete', body);
    return { id: created.product.id };
  },

  async updateProduct(id: number, payload: CreateProductPayload): Promise<{ id: number }> {
    const body = {
      product: {
        sku: payload.sku,
        name: payload.name,
        categoryId: payload.categoryId,
        subcategoryId: payload.subcategoryId,
        gstRateId: payload.gstRateId,
        description: payload.description || null,
        colorName: payload.colorName || null,
        price: Math.round(payload.price * 100),
        discountPrice: payload.discountPrice == null ? null : Math.round(payload.discountPrice * 100),
        featured: payload.featured,
        newArrival: payload.newArrival,
        bestSeller: payload.bestSeller,
        returnWindowDays: payload.returnWindowDays,
      },
      sizes: payload.sizes.map((s) => ({
        size: s.size,
        stockQuantity: s.stockQuantity,
        lowStockThreshold: s.lowStockThreshold,
        available: s.available,
      })),
      images: payload.images.map((image, index) => ({
        id: image.productImageId ?? null,
        mediaId: image.mediaId,
        primary: index === 0,
        sortOrder: index,
      })),
      moodIds: payload.moodIds,
      publicationAction: payload.publish ? 'PUBLISH' : 'SAVE_DRAFT',
    };
    const updated = await adminApiClient.put<{ product: { id: number } }>(`/admin/products/${id}/complete`, body);
    return { id: updated.product.id };
  },

  async updateProductSizes(
    id: number,
    sizes: Array<{
      size: string;
      stockQuantity: number;
      lowStockThreshold: number;
      available: boolean;
    }>
  ): Promise<void> {
    await adminApiClient.put(`/admin/products/${id}/sizes`, sizes);
  },
};
