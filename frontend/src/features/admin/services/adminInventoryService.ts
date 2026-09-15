import { apiClient } from '../../../services/api/apiClient';
import { adminAuthOptions } from './adminQuizService';

export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DISABLED';

export interface InventorySize {
  sizeId: number;
  size: string;
  stockQuantity: number;
  lowStockThreshold: number;
  available: boolean;
  status: InventoryStatus;
}

export interface InventoryProduct {
  productId: number;
  sku: string;
  name: string;
  imageUrl?: string;
  moods: string[];
  totalStock: number;
  stockValue: number;
  status: InventoryStatus;
  sizes: InventorySize[];
}

export interface InventoryOverview {
  summary: {
    totalProducts: number;
    totalSizeVariants: number;
    totalUnits: number;
    inStockProducts: number;
    lowStockVariants: number;
    outOfStockVariants: number;
    stockValue: number;
  };
  products: InventoryProduct[];
}

export const adminInventoryService = {
  overview: () => apiClient.get<InventoryOverview>('/admin/inventory/overview', adminAuthOptions()),
};
