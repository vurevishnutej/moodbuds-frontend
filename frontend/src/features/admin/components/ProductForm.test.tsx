import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductForm } from './ProductForm';
import { ADMIN_PRODUCTS } from '../../../data/admin';

vi.mock('../services/catalogAdminApi', () => ({
  catalogAdminApi: {
    listCategories: vi.fn().mockResolvedValue([
      { id: '1', name: 'Outerwear', slug: 'outerwear', image: '', products: 0, subcategoryCount: 1, status: 'Active' },
      { id: '2', name: 'Dresses', slug: 'dresses', image: '', products: 0, subcategoryCount: 0, status: 'Active' },
    ]),
    listSubcategories: vi.fn().mockResolvedValue({
      subs: [
        { id: '10', parentId: '1', parent: 'Outerwear', name: 'Blazers', slug: 'blazers', image: '', products: 0, status: 'Active' },
      ],
      categories: [],
    }),
  },
}));

vi.mock('../services/productAdminApi', () => ({
  productAdminApi: {
    listMoods: vi.fn().mockResolvedValue([{ id: 1, name: 'Happy', color: '#FFD93D' }]),
    listGstRates: vi.fn().mockResolvedValue([{ id: 1, label: 'GST 12% (12%)' }]),
    uploadProductImages: vi.fn().mockResolvedValue([]),
    createProduct: vi.fn().mockResolvedValue({ id: 1 }),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ProductForm — create mode', () => {
  it('resets the subcategory when the category changes', async () => {
    const user = userEvent.setup();
    render(<ProductForm mode="create" onSubmit={vi.fn()} onCancel={vi.fn()} />);

    // Wait for categories to load from the API.
    await screen.findByRole('option', { name: 'Outerwear' });

    await user.selectOptions(screen.getByLabelText(/^category$/i), 'Outerwear');
    expect(screen.getByRole('option', { name: 'Blazers' })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/^subcategory$/i), 'Blazers');
    expect((screen.getByLabelText(/^subcategory$/i) as HTMLSelectElement).value).toBe('10');

    await user.selectOptions(screen.getByLabelText(/^category$/i), 'Dresses');
    expect((screen.getByLabelText(/^subcategory$/i) as HTMLSelectElement).value).toBe('');
  });

  it('toggles size chips and includes only selected sizes on submit', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ProductForm mode="create" onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByPlaceholderText(/structured blazer/i), 'Test Jacket');
    await user.click(screen.getByRole('button', { name: 'M' }));
    await user.click(screen.getByRole('button', { name: 'L' }));
    await user.click(screen.getByRole('button', { name: 'M' })); // deselect M

    await user.click(screen.getByRole('button', { name: /publish/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [value, publish] = onSubmit.mock.calls[0];
    expect(value.name).toBe('Test Jacket');
    expect(value.sizes).toEqual(['L']);
    expect(publish).toBe(true);
  });

  it('calls onSubmit with publish=false for "Save draft"', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ProductForm mode="create" onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /save draft/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][1]).toBe(false);
  });

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<ProductForm mode="create" onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: /^cancel$/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not show a delete button in create mode', () => {
    render(<ProductForm mode="create" onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /delete product/i })).not.toBeInTheDocument();
  });
});

describe('ProductForm — edit mode', () => {
  const product = ADMIN_PRODUCTS[0]; // Structured Blazer

  it('pre-fills fields from the initial product and locks the SKU', () => {
    render(<ProductForm mode="edit" initial={product} onSubmit={vi.fn()} onCancel={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByDisplayValue(product.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(product.sku)).toBeDisabled();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('calls onDelete when the delete button is clicked', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<ProductForm mode="edit" initial={product} onSubmit={vi.fn()} onCancel={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: /delete product/i }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('pre-selects the sizes already on the product', () => {
    render(<ProductForm mode="edit" initial={product} onSubmit={vi.fn()} onCancel={vi.fn()} onDelete={vi.fn()} />);
    for (const size of product.sizes ?? []) {
      expect(screen.getByRole('button', { name: size })).toHaveClass('on');
    }
  });
});
