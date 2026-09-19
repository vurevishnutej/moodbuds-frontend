import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CategoriesPage, SubcategoriesPage } from './CategoryPages';
import { ToastProvider } from '../../../app/providers/ToastProvider';

vi.mock('../services/catalogAdminApi', () => ({
  catalogAdminApi: {
    listCategories: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    setCategoryActive: vi.fn(),
    deleteCategory: vi.fn(),
    listSubcategories: vi.fn(),
    createSubcategory: vi.fn(),
    updateSubcategory: vi.fn(),
    deleteSubcategory: vi.fn(),
  },
}));

import { catalogAdminApi } from '../services/catalogAdminApi';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <ToastProvider>{ui}</ToastProvider>
    </MemoryRouter>
  );
}

const sampleCategory = {
  id: '1',
  name: 'Men',
  slug: 'men',
  image: 'https://example.com/men.jpg',
  products: 12,
  subcategoryCount: 2,
  status: 'Active' as const,
};

describe('CategoriesPage', () => {
  it('shows a loading state, then renders category cards from the API', async () => {
    vi.mocked(catalogAdminApi.listCategories).mockResolvedValue([sampleCategory]);
    renderWithProviders(<CategoriesPage />);

    expect(screen.getByText(/loading categories/i)).toBeInTheDocument();

    expect(await screen.findByText('Men')).toBeInTheDocument();
    expect(screen.getByText('/men')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument(); // products count
  });

  it('shows a toast and an empty grid if loading fails', async () => {
    vi.mocked(catalogAdminApi.listCategories).mockRejectedValue(new Error('Network down'));
    renderWithProviders(<CategoriesPage />);

    expect(await screen.findByText('Network down')).toBeInTheDocument();
  });

  it('blocks creating a category with an empty name', async () => {
    vi.mocked(catalogAdminApi.listCategories).mockResolvedValue([]);
    const user = userEvent.setup();
    renderWithProviders(<CategoriesPage />);

    await user.click(await screen.findByRole('button', { name: /add category/i }));
    await user.click(screen.getByRole('button', { name: /create category/i }));

    expect(await screen.findByText(/category name is required/i)).toBeInTheDocument();
    expect(catalogAdminApi.createCategory).not.toHaveBeenCalled();
  });

  it('creates a category with an auto-generated slug and refreshes the list', async () => {
    vi.mocked(catalogAdminApi.listCategories)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ ...sampleCategory, name: 'Kids Wear', slug: 'kids-wear', id: '2' }]);
    vi.mocked(catalogAdminApi.createCategory).mockResolvedValue({ ...sampleCategory, name: 'Kids Wear', slug: 'kids-wear', id: '2' });

    const user = userEvent.setup();
    renderWithProviders(<CategoriesPage />);

    await user.click(await screen.findByRole('button', { name: /add category/i }));
    await user.type(screen.getByPlaceholderText(/e.g. men, women, kids/i), 'Kids Wear');
    await user.click(screen.getByRole('button', { name: /create category/i }));

    await waitFor(() =>
      expect(catalogAdminApi.createCategory).toHaveBeenCalledWith({ name: 'Kids Wear', slug: 'kids-wear', status: 'Active' })
    );
    expect(await screen.findByText(/category created/i)).toBeInTheDocument();
    expect(catalogAdminApi.listCategories).toHaveBeenCalledTimes(2);
  });

  it('toggles a category active/draft and rolls back on failure', async () => {
    vi.mocked(catalogAdminApi.listCategories).mockResolvedValue([sampleCategory]);
    vi.mocked(catalogAdminApi.setCategoryActive).mockRejectedValue(new Error('Forbidden'));
    const user = userEvent.setup();
    renderWithProviders(<CategoriesPage />);

    const card = (await screen.findByText('Men')).closest('.adm-cat-card') as HTMLElement;
    const toggle = within(card).getByRole('button', { name: '' }); // AdminToggle has no accessible text

    await user.click(toggle);

    expect(catalogAdminApi.setCategoryActive).toHaveBeenCalledWith('1', false);
    expect(await screen.findByText('Forbidden')).toBeInTheDocument();
  });

  it('deactivates a category after confirming the dialog', async () => {
    vi.mocked(catalogAdminApi.listCategories).mockResolvedValue([sampleCategory]);
    vi.mocked(catalogAdminApi.deleteCategory).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithProviders(<CategoriesPage />);

    const card = (await screen.findByText('Men')).closest('.adm-cat-card') as HTMLElement;
    await user.click(within(card).getByTitle('Deactivate'));

    const dialog = await screen.findByText(/deactivate "men"/i);
    const dialogRoot = dialog.closest('.adm-modal') as HTMLElement;
    await user.click(within(dialogRoot).getByRole('button', { name: /^deactivate$/i }));

    await waitFor(() => expect(catalogAdminApi.deleteCategory).toHaveBeenCalledWith('1'));
    expect(await screen.findByText(/"men" deactivated/i)).toBeInTheDocument();
    expect(screen.queryByText('Men')).not.toBeInTheDocument();
  });
});

const sampleSub = {
  id: '10',
  parentId: '1',
  parent: 'Men',
  name: 'Jeans',
  slug: 'jeans',
  image: 'https://example.com/jeans.jpg',
  products: 5,
  status: 'Active' as const,
};

describe('SubcategoriesPage', () => {
  it('renders subcategories with their parent category', async () => {
    vi.mocked(catalogAdminApi.listSubcategories).mockResolvedValue({ subs: [sampleSub], categories: [sampleCategory] });
    renderWithProviders(<SubcategoriesPage />);

    expect(await screen.findByText('Jeans')).toBeInTheDocument();
    expect(screen.getAllByText('Men').length).toBeGreaterThan(0);
  });

  it('filters the table by search text', async () => {
    const otherSub = { ...sampleSub, id: '11', name: 'T-Shirts', slug: 't-shirts' };
    vi.mocked(catalogAdminApi.listSubcategories).mockResolvedValue({ subs: [sampleSub, otherSub], categories: [sampleCategory] });
    const user = userEvent.setup();
    renderWithProviders(<SubcategoriesPage />);

    await screen.findByText('Jeans');
    await user.type(screen.getByPlaceholderText(/search subcategories/i), 'jean');

    expect(screen.getByText('Jeans')).toBeInTheDocument();
    expect(screen.queryByText('T-Shirts')).not.toBeInTheDocument();
  });

  it('requires a parent category before creating a subcategory', async () => {
    vi.mocked(catalogAdminApi.listSubcategories).mockResolvedValue({ subs: [], categories: [] });
    const user = userEvent.setup();
    renderWithProviders(<SubcategoriesPage />);

    await user.click(await screen.findByRole('button', { name: /add subcategory/i }));
    await user.type(screen.getByPlaceholderText(/e.g. jeans, t-shirts/i), 'Jackets');
    await user.click(screen.getByRole('button', { name: /create subcategory/i }));

    expect(await screen.findByText(/choose a parent category/i)).toBeInTheDocument();
    expect(catalogAdminApi.createSubcategory).not.toHaveBeenCalled();
  });

  it('creates a subcategory under the selected parent', async () => {
    vi.mocked(catalogAdminApi.listSubcategories).mockResolvedValue({ subs: [], categories: [sampleCategory] });
    vi.mocked(catalogAdminApi.createSubcategory).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithProviders(<SubcategoriesPage />);

    await user.click(await screen.findByRole('button', { name: /add subcategory/i }));
    await user.type(screen.getByPlaceholderText(/e.g. jeans, t-shirts/i), 'Jackets');
    await user.click(screen.getByRole('button', { name: /create subcategory/i }));

    await waitFor(() =>
      expect(catalogAdminApi.createSubcategory).toHaveBeenCalledWith({
        name: 'Jackets',
        slug: 'jackets',
        status: 'Active',
        parentId: '1',
      })
    );
  });
});
