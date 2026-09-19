import { apiClient } from '../../../services/api/apiClient';

export interface CatalogCategoryOption {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

export interface CatalogSubcategoryOption {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  categorySlug: string;
  productCount: number;
}

export const catalogFilterApi = {
  listCategories: () => apiClient.get<CatalogCategoryOption[]>('/categories', { includeAuth: false }),
  listSubcategories: (categorySlug: string) =>
    apiClient.get<CatalogSubcategoryOption[]>(
      `/categories/${encodeURIComponent(categorySlug)}/subcategories`,
      { includeAuth: false },
    ),
};
