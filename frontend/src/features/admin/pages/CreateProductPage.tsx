import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../../../services/api/apiClient';
import { AdminModuleBar, AdminBody } from '../components/AdminUI';
import { ProductForm, type ProductFormValue } from '../components/ProductForm';
import { productAdminApi } from '../services/productAdminApi';
import { useToast } from '../../../app/providers/ToastProvider';

export function CreateProductPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (value: ProductFormValue, publish: boolean) => {
    if (saving) return;

    if (!value.name.trim()) return toast.error('Product name is required');
    if (!value.sku.trim()) return toast.error('SKU is required');
    if (!value.categoryId) return toast.error('Please select a category');
    if (!value.subcategoryId) return toast.error('Please select a subcategory');
    if (!value.gstRateId) return toast.error('Please select a GST rate');

    const sellingPrice = Number(value.price);
    if (!sellingPrice || sellingPrice <= 0) return toast.error('Enter a valid price');
    const mrp = Number(value.mrp) || 0;
    // Backend stores the regular price + an optional lower discount price.
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
      const created = await productAdminApi.createProduct({
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
        await productAdminApi.updateProductSizes(created.id, value.sizeStocks);
      }
      
      toast.success(publish ? 'Product published ✦' : 'Product saved as draft');
      navigate('/profile/admin/edit-products');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not create the product';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminModuleBar title="Create Product" sub="Add a new piece to the catalog" />
      <AdminBody>
        <ProductForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/profile/admin/edit-products')}
        />
      </AdminBody>
    </>
  );
}
