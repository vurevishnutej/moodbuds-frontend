import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '../../../services/api/apiClient';
import { AdminModuleBar, AdminBody, AdminDemoNote, AdminConfirmDialog } from '../components/AdminUI';
import { ProductForm, type ProductFormValue } from '../components/ProductForm';
import type { AdminProduct } from '../../../data/admin';
import { productAdminApi } from '../services/productAdminApi';
import { useToast } from '../../../app/providers/ToastProvider';

export function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Product ID is missing');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productAdminApi.getProduct(parseInt(id, 10));
        setProduct(productData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <AdminModuleBar title="Edit Product" sub="Loading..." />
        <AdminBody>
          <div className="adm-card">
            <div className="adm-card-body">Loading product details...</div>
          </div>
        </AdminBody>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <AdminModuleBar title="Edit Product" sub="Product not found" />
        <AdminBody>
          <div className="adm-card">
            <div className="adm-card-body">
              <p className="adm-modal-msg">
                We couldn&apos;t find a product with ID <b>{id}</b>. {error ? `Error: ${error}` : 'It may have been removed.'}
              </p>
              <button type="button" className="adm-btn primary" style={{ marginTop: 12 }} onClick={() => navigate('/profile/admin/edit-products')}>
                ← Back to products
              </button>
            </div>
          </div>
        </AdminBody>
      </>
    );
  }

  const handleSubmit = async (value: ProductFormValue, publish: boolean) => {
    if (saving) return;

    if (!value.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!value.sku.trim()) return toast.error('SKU is required');
    if (!value.categoryId) return toast.error('Please select a category');
    if (!value.subcategoryId) return toast.error('Please select a subcategory');
    if (!value.gstRateId) return toast.error('Please select a GST rate');

    const sellingPrice = Number(value.price);
    if (!sellingPrice || sellingPrice <= 0) return toast.error('Enter a valid price');
    const mrp = Number(value.mrp) || 0;
    const regularPrice = mrp > sellingPrice ? mrp : sellingPrice;
    const discountPrice = mrp > sellingPrice ? sellingPrice : null;

    if (publish) {
      if (value.sizeStocks.length === 0) return toast.error('Add at least one size before publishing');
      if (value.sizeStocks.some((s) => s.stockQuantity <= 0)) {
        return toast.error('All selected sizes must have stock quantity > 0');
      }
      if (value.images.length < 3) return toast.error('Add at least 3 images before publishing');
      if (value.moodIds.length === 0) return toast.error('Select at least one mood before publishing');
    }

    setSaving(true);
    try {
      await productAdminApi.updateProduct(product.id!, {
        sku: value.sku.trim(),
        name: value.name.trim(),
        categoryId: Number(value.categoryId),
        subcategoryId: Number(value.subcategoryId),
        gstRateId: Number(value.gstRateId),
        description: value.description,
        colorName: value.colorName,
        price: regularPrice,
        discountPrice,
        featured: value.featured,
        newArrival: value.newArrival,
        bestSeller: value.bestSeller,
        returnWindowDays: Number(value.returnWindowDays) || 7,
        sizes: value.sizeStocks.map((s) => ({ size: s.size, stockQuantity: s.stockQuantity })),
        imageMediaIds: value.images.map((img) => img.mediaId),
        moodIds: value.moodIds.map(Number),
        publish,
      });
      
      // Update sizes with full details (threshold, availability)
      if (value.sizeStocks.length > 0) {
        await productAdminApi.updateProductSizes(product.id!, value.sizeStocks);
      }
      
      toast.success(publish ? 'Product changes saved ✦' : 'Product saved as draft');
      navigate('/profile/admin/edit-products');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not update the product';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!product?.id) {
        toast.error('Product ID is missing');
        return;
      }
      await productAdminApi.deleteProduct(product.id);
      toast.success(`"${product.name}" deleted`);
      navigate('/profile/admin/edit-products');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete product');
      setConfirmingDelete(false);
    }
  };

  return (
    <>
      <AdminModuleBar title="Edit Product" sub={`Editing "${product.name}" · ${product.sku}`} />
      <AdminBody>
        <ProductForm
          mode="edit"
          initial={product}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/profile/admin/edit-products')}
          onDelete={() => setConfirmingDelete(true)}
        />
        <AdminDemoNote />
      </AdminBody>

      {confirmingDelete && (
        <AdminConfirmDialog
          title="Delete product"
          message={`Delete "${product.name}" (${product.sku})? This can't be undone.`}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
