import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./adminApiClient', () => ({
  adminApiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import { adminApiClient } from './adminApiClient';
import { catalogAdminApi } from './catalogAdminApi';

const get = vi.mocked(adminApiClient.get);
const post = vi.mocked(adminApiClient.post);
const patch = vi.mocked(adminApiClient.patch);
const del = vi.mocked(adminApiClient.delete);

function page<T>(content: T[], totalPages = 1) {
  return { content, page: 0, size: 100, totalElements: content.length, totalPages };
}

beforeEach(() => {
  get.mockReset();
  post.mockReset();
  patch.mockReset();
  del.mockReset();
});

describe('catalogAdminApi.listCategories', () => {
  it('maps DB rows to AdminCategory and computes product/subcategory counts', async () => {
    get.mockImplementation(async (path: string) => {
      if (path.startsWith('/admin/categories')) {
        return page([
          { id: 1, name: 'Men', slug: 'men', is_active: 1 },
          { id: 2, name: 'Women', slug: 'women', is_active: 0 },
        ]);
      }
      if (path.startsWith('/admin/subcategories')) {
        return page([
          { id: 10, category_id: 1, name: 'Jeans', slug: 'jeans', is_active: 1 },
          { id: 11, category_id: 1, name: 'T-Shirts', slug: 't-shirts', is_active: 1 },
        ]);
      }
      if (path.startsWith('/admin/products')) {
        return page([
          { id: 100, category_id: 1, subcategory_id: 10 },
          { id: 101, category_id: 1, subcategory_id: 11 },
          { id: 102, category_id: 2, subcategory_id: null },
        ]);
      }
      throw new Error(`unexpected path ${path}`);
    });

    const cats = await catalogAdminApi.listCategories();

    expect(cats).toHaveLength(2);
    const men = cats.find((c) => c.name === 'Men')!;
    expect(men.status).toBe('Active');
    expect(men.subcategoryCount).toBe(2);
    expect(men.products).toBe(2);
    expect(men.image).toContain('1516257984'); // the "men" placeholder photo

    const women = cats.find((c) => c.name === 'Women')!;
    expect(women.status).toBe('Draft'); // is_active: 0
    expect(women.products).toBe(1);
    expect(women.subcategoryCount).toBe(0);
  });

  it('treats is_active as boolean or 0/1 interchangeably', async () => {
    get.mockImplementation(async (path: string) => {
      if (path.startsWith('/admin/categories')) {
        return page([
          { id: 1, name: 'A', slug: 'a', is_active: true },
          { id: 2, name: 'B', slug: 'b', is_active: false },
        ]);
      }
      return page([]);
    });

    const cats = await catalogAdminApi.listCategories();
    expect(cats.find((c) => c.name === 'A')?.status).toBe('Active');
    expect(cats.find((c) => c.name === 'B')?.status).toBe('Draft');
  });

  it('falls back to a generated slug when the backend slug is null', async () => {
    get.mockImplementation(async (path: string) => {
      if (path.startsWith('/admin/categories')) {
        return page([{ id: 5, name: 'Kids Wear', slug: null, is_active: 1 }]);
      }
      return page([]);
    });

    const cats = await catalogAdminApi.listCategories();
    expect(cats[0].slug).toBe('kids-wear');
  });

  it('paginates through every page of a resource', async () => {
    get.mockImplementation(async (path: string) => {
      if (path.startsWith('/admin/categories?page=0')) {
        return page([{ id: 1, name: 'Men', slug: 'men', is_active: 1 }], 2);
      }
      if (path.startsWith('/admin/categories?page=1')) {
        return { content: [{ id: 2, name: 'Women', slug: 'women', is_active: 1 }], page: 1, size: 100, totalElements: 2, totalPages: 2 };
      }
      return page([]);
    });

    const cats = await catalogAdminApi.listCategories();
    expect(cats.map((c) => c.name).sort()).toEqual(['Men', 'Women']);
    expect(get).toHaveBeenCalledWith('/admin/categories?page=0&size=100');
    expect(get).toHaveBeenCalledWith('/admin/categories?page=1&size=100');
  });

  it('does not fail category listing if the products fetch is unauthorized', async () => {
    get.mockImplementation(async (path: string) => {
      if (path.startsWith('/admin/categories')) return page([{ id: 1, name: 'Men', slug: 'men', is_active: 1 }]);
      if (path.startsWith('/admin/subcategories')) return page([]);
      if (path.startsWith('/admin/products')) throw new Error('403 forbidden');
      return page([]);
    });

    const cats = await catalogAdminApi.listCategories();
    expect(cats[0].products).toBe(0);
  });
});

describe('catalogAdminApi.createCategory / updateCategory', () => {
  it('POSTs isActive as a boolean and maps the created row back', async () => {
    post.mockResolvedValue({ id: 9, name: 'Loungewear', slug: 'loungewear', is_active: 1 });

    const created = await catalogAdminApi.createCategory({ name: 'Loungewear', slug: 'loungewear', status: 'Active' });

    expect(post).toHaveBeenCalledWith('/admin/categories', { name: 'Loungewear', slug: 'loungewear', isActive: true });
    expect(created).toMatchObject({ id: '9', name: 'Loungewear', slug: 'loungewear', status: 'Active', products: 0, subcategoryCount: 0 });
  });

  it('PATCHes only the changed fields on update', async () => {
    await catalogAdminApi.updateCategory('9', { name: 'Loungewear Edit', slug: 'loungewear-edit', status: 'Draft' });

    expect(patch).toHaveBeenCalledWith('/admin/categories/9', {
      name: 'Loungewear Edit',
      slug: 'loungewear-edit',
      isActive: false,
    });
  });

  it('setCategoryActive PATCHes only isActive', async () => {
    await catalogAdminApi.setCategoryActive('9', false);
    expect(patch).toHaveBeenCalledWith('/admin/categories/9', { isActive: false });
  });

  it('deleteCategory calls the DELETE endpoint with the id', async () => {
    await catalogAdminApi.deleteCategory('9');
    expect(del).toHaveBeenCalledWith('/admin/categories/9');
  });
});

describe('catalogAdminApi.listSubcategories', () => {
  it('attaches the parent category name/slug and per-subcategory product counts', async () => {
    get.mockImplementation(async (path: string) => {
      if (path.startsWith('/admin/categories')) return page([{ id: 1, name: 'Men', slug: 'men', is_active: 1 }]);
      if (path.startsWith('/admin/subcategories')) return page([{ id: 10, category_id: 1, name: 'Jeans', slug: 'jeans', is_active: 1 }]);
      if (path.startsWith('/admin/products')) {
        return page([
          { id: 100, category_id: 1, subcategory_id: 10 },
          { id: 101, category_id: 1, subcategory_id: 10 },
          { id: 102, category_id: 1, subcategory_id: null },
        ]);
      }
      return page([]);
    });

    const { subs, categories } = await catalogAdminApi.listSubcategories();

    expect(subs).toHaveLength(1);
    expect(subs[0]).toMatchObject({ id: '10', parentId: '1', parent: 'Men', name: 'Jeans', products: 2, status: 'Active' });
    expect(categories[0].products).toBe(3);
  });
});

describe('catalogAdminApi.createSubcategory / updateSubcategory', () => {
  it('sends categoryId as a number', async () => {
    await catalogAdminApi.createSubcategory({ name: 'Jackets', slug: 'jackets', parentId: '3', status: 'Active' });

    expect(post).toHaveBeenCalledWith('/admin/subcategories', {
      name: 'Jackets',
      slug: 'jackets',
      categoryId: 3,
      isActive: true,
    });
  });

  it('updates with the new parent and status', async () => {
    await catalogAdminApi.updateSubcategory('10', { name: 'Jackets', slug: 'jackets', parentId: '4', status: 'Draft' });

    expect(patch).toHaveBeenCalledWith('/admin/subcategories/10', {
      name: 'Jackets',
      slug: 'jackets',
      categoryId: 4,
      isActive: false,
    });
  });

  it('deleteSubcategory calls the DELETE endpoint with the id', async () => {
    await catalogAdminApi.deleteSubcategory('10');
    expect(del).toHaveBeenCalledWith('/admin/subcategories/10');
  });
});
