import { adminApiClient } from './adminApiClient';
import type { AdminCategory, AdminSubcategory } from '../../../data/admin';
import { slugify } from '../../../data/admin';

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface CategoryRow {
  id: number;
  name: string;
  slug: string | null;
  is_active: number | boolean;
  created_at?: string;
  updated_at?: string;
}

interface SubcategoryRow extends CategoryRow {
  category_id: number;
}

interface ProductRow {
  id: number;
  category_id: number | null;
  subcategory_id: number | null;
}

const CATEGORY_PLACEHOLDER: Record<string, string> = {
  men: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=300&h=300&q=70',
  women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=300&h=300&q=70',
  kids: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=300&h=300&q=70',
  children: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=300&h=300&q=70',
};
const DEFAULT_PLACEHOLDER =
  'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=300&h=300&q=70';

function placeholderFor(slug: string): string {
  return CATEGORY_PLACEHOLDER[slug] ?? DEFAULT_PLACEHOLDER;
}

function toBool(v: number | boolean): boolean {
  return v === true || v === 1;
}

async function fetchAllPages<T>(resource: string, pageSize = 100): Promise<T[]> {
  const first = await adminApiClient.get<PageResponse<T>>(`/admin/${resource}?page=0&size=${pageSize}`);
  const all = [...first.content];
  for (let p = 1; p < first.totalPages; p++) {
    const next = await adminApiClient.get<PageResponse<T>>(`/admin/${resource}?page=${p}&size=${pageSize}`);
    all.push(...next.content);
  }
  return all;
}

export const catalogAdminApi = {
  async listCategories(): Promise<AdminCategory[]> {
    const [categories, subcategories, products] = await Promise.all([
      fetchAllPages<CategoryRow>('categories'),
      fetchAllPages<SubcategoryRow>('subcategories'),
      fetchAllPages<ProductRow>('products').catch(() => [] as ProductRow[]),
    ]);
    return categories.map((c) => {
      const slug = c.slug ?? slugify(c.name);
      return {
        id: String(c.id),
        name: c.name,
        slug,
        image: placeholderFor(slug),
        products: products.filter((p) => p.category_id === c.id).length,
        subcategoryCount: subcategories.filter((s) => s.category_id === c.id).length,
        status: toBool(c.is_active) ? 'Active' : 'Draft',
      };
    });
  },

  async createCategory(input: { name: string; slug?: string; status: 'Active' | 'Draft' }): Promise<AdminCategory> {
    const created = await adminApiClient.post<CategoryRow>('/admin/categories', {
      name: input.name,
      slug: input.slug,
      isActive: input.status === 'Active',
    });
    const slug = created.slug ?? slugify(created.name);
    return {
      id: String(created.id),
      name: created.name,
      slug,
      image: placeholderFor(slug),
      products: 0,
      subcategoryCount: 0,
      status: toBool(created.is_active) ? 'Active' : 'Draft',
    };
  },

  async updateCategory(
    id: string,
    input: { name: string; slug?: string; status: 'Active' | 'Draft' }
  ): Promise<void> {
    await adminApiClient.patch(`/admin/categories/${id}`, {
      name: input.name,
      slug: input.slug,
      isActive: input.status === 'Active',
    });
  },

  async setCategoryActive(id: string, active: boolean): Promise<void> {
    await adminApiClient.patch(`/admin/categories/${id}`, { isActive: active });
  },

  async deleteCategory(id: string): Promise<void> {
    await adminApiClient.delete(`/admin/categories/${id}`);
  },

  async listSubcategories(): Promise<{ subs: AdminSubcategory[]; categories: AdminCategory[] }> {
    const [categories, subcategories, products] = await Promise.all([
      fetchAllPages<CategoryRow>('categories'),
      fetchAllPages<SubcategoryRow>('subcategories'),
      fetchAllPages<ProductRow>('products').catch(() => [] as ProductRow[]),
    ]);
    const catById = new Map(categories.map((c) => [c.id, c]));
    const subs: AdminSubcategory[] = subcategories.map((s) => {
      const parent = catById.get(s.category_id);
      const slug = s.slug ?? slugify(s.name);
      return {
        id: String(s.id),
        parentId: String(s.category_id),
        parent: parent?.name ?? '—',
        name: s.name,
        slug,
        image: placeholderFor(parent?.slug ?? slug),
        products: products.filter((p) => p.subcategory_id === s.id).length,
        status: toBool(s.is_active) ? 'Active' : 'Draft',
      };
    });
    const cats: AdminCategory[] = categories.map((c) => {
      const slug = c.slug ?? slugify(c.name);
      return {
        id: String(c.id),
        name: c.name,
        slug,
        image: placeholderFor(slug),
        products: products.filter((p) => p.category_id === c.id).length,
        subcategoryCount: subcategories.filter((s) => s.category_id === c.id).length,
        status: toBool(c.is_active) ? 'Active' : 'Draft',
      };
    });
    return { subs, categories: cats };
  },

  async createSubcategory(input: {
    name: string;
    slug?: string;
    parentId: string;
    status: 'Active' | 'Draft';
  }): Promise<void> {
    await adminApiClient.post('/admin/subcategories', {
      name: input.name,
      slug: input.slug,
      categoryId: Number(input.parentId),
      isActive: input.status === 'Active',
    });
  },

  async updateSubcategory(
    id: string,
    input: { name: string; slug?: string; parentId: string; status: 'Active' | 'Draft' }
  ): Promise<void> {
    await adminApiClient.patch(`/admin/subcategories/${id}`, {
      name: input.name,
      slug: input.slug,
      categoryId: Number(input.parentId),
      isActive: input.status === 'Active',
    });
  },

  async deleteSubcategory(id: string): Promise<void> {
    await adminApiClient.delete(`/admin/subcategories/${id}`);
  },
};


