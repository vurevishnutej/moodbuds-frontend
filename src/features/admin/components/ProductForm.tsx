import { useEffect, useMemo, useState } from 'react';
import type { AdminProduct, AdminCategory, AdminSubcategory } from '../../../data/admin';
import { formatINR } from '../../../utils/format';
import { catalogAdminApi } from '../services/catalogAdminApi';
import {
  productAdminApi,
  type AdminGstOption,
  type AdminMoodOption,
  type UploadedImage,
} from '../services/productAdminApi';
import { SizeStockManager, type SizeStock } from './SizeStockManager';

export interface ProductFormValue {
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  gstRateId: string;
  colorName: string;
  moodIds: string[];
  price: string;
  mrp: string;
  stock: string;
  returnWindowDays: string;
  sizes: string[];
  sizeStocks: SizeStock[];
  images: UploadedImage[];
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  status: AdminProduct['status'];
}

function toFormValue(p?: AdminProduct): ProductFormValue {
  // Use actual per-size stocks from backend if available, otherwise create from global stock
  const sizeStocks: SizeStock[] = 
    p?.sizeStocks && p.sizeStocks.length > 0
      ? p.sizeStocks
      : p?.sizes?.map((size) => ({
          size,
          stockQuantity: p?.stock ?? 0,
          lowStockThreshold: 5,
          available: true,
        })) ?? [];

  return {
    sku: p?.sku ?? '',
    name: p?.name ?? '',
    description: p?.description ?? '',
    categoryId: p?.categoryId ? String(p.categoryId) : '',
    subcategoryId: p?.subcategoryId ? String(p.subcategoryId) : '',
    gstRateId: p?.gstRateId ? String(p.gstRateId) : '',
    colorName: p?.colorName ?? '',
    moodIds: p?.moodIds ? p.moodIds.map(String) : [],
    price: p?.price != null ? String(p.price) : '',
    mrp: p?.mrp != null ? String(p.mrp) : '',
    stock: p?.stock != null ? String(p.stock) : '',
    returnWindowDays: p?.returnWindowDays != null ? String(p.returnWindowDays) : '7',
    sizes: p?.sizes ?? [],
    sizeStocks,
    images: p?.images && Array.isArray(p.images) ? p.images.map((img) => ({
      productImageId: img.productImageId,
      mediaId: img.mediaId,
      url: img.url,
    })) : [],
    featured: p?.featured ?? false,
    newArrival: p?.newArrival ?? false,
    bestSeller: p?.bestSeller ?? false,
    status: p?.status ?? 'Active',
  };
}

export function ProductForm({
  mode,
  initial,
  onSubmit,
  onCancel,
  onDelete,
}: {
  mode: 'create' | 'edit';
  initial?: AdminProduct;
  onSubmit: (value: ProductFormValue, publish: boolean) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [value, setValue] = useState<ProductFormValue>(() => toFormValue(initial));
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [subcategories, setSubcategories] = useState<AdminSubcategory[]>([]);
  const [moods, setMoods] = useState<AdminMoodOption[]>([]);
  const [gstRates, setGstRates] = useState<AdminGstOption[]>([]);
  const [uploading, setUploading] = useState(false);
  const [refError, setRefError] = useState<string | null>(null);

  const set = <K extends keyof ProductFormValue>(key: K, v: ProductFormValue[K]) =>
    setValue((prev) => ({ ...prev, [key]: v }));

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [cats, subsResult, moodList, gstList] = await Promise.all([
          catalogAdminApi.listCategories(),
          catalogAdminApi.listSubcategories(),
          productAdminApi.listMoods(),
          productAdminApi.listGstRates(),
        ]);
        if (!active) return;
        setCategories(cats);
        setSubcategories(subsResult.subs);
        setMoods(moodList);
        setGstRates(gstList);
      } catch (err) {
        if (active) setRefError(err instanceof Error ? err.message : 'Failed to load catalog data');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const subcategoryOptions = useMemo(
    () => subcategories.filter((s) => s.parentId === value.categoryId),
    [subcategories, value.categoryId]
  );

  const toggleMood = (id: string) =>
    setValue((prev) => ({
      ...prev,
      moodIds: prev.moodIds.includes(id) ? prev.moodIds.filter((x) => x !== id) : [...prev.moodIds, id],
    }));

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = Math.max(0, 6 - value.images.length);
    const list = Array.from(files).filter((f) => f.type.startsWith('image/')).slice(0, remaining);
    if (list.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await productAdminApi.uploadProductImages(list);
      setValue((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
    } catch (err) {
      setRefError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) =>
    setValue((prev) => ({ ...prev, images: prev.images.filter((_, imageIndex) => imageIndex !== index) }));

  const priceNum = Number(value.price) || 0;
  const mrpNum = Number(value.mrp) || 0;

  return (
    <>
      {refError && (
        <div className="adm-card" style={{ borderColor: '#e0989a' }}>
          <div className="adm-card-body" style={{ color: '#b4494b' }}>{refError}</div>
        </div>
      )}
      <div className="adm-form-grid">
        <div>
          <div className="adm-card">
            <div className="adm-card-head"><span className="adm-card-title">Product details</span></div>
            <div className="adm-card-body">
              <div className="adm-field">
                <label htmlFor="product-name">Product name</label>
                <input
                  id="product-name"
                  placeholder="e.g. Structured Blazer"
                  value={value.name}
                  onChange={(e) => set('name', e.target.value)}
                />
              </div>
              <div className="adm-field-row">
                <div className="adm-field">
                  <label htmlFor="product-color">Colour</label>
                  <input id="product-color" placeholder="Charcoal" value={value.colorName} onChange={(e) => set('colorName', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label htmlFor="product-sku">SKU</label>
                  <input
                    id="product-sku"
                    placeholder="MB-BLZ-001"
                    value={value.sku}
                    disabled={mode === 'edit'}
                    onChange={(e) => set('sku', e.target.value)}
                  />
                </div>
              </div>
              <div className="adm-field">
                <label htmlFor="product-description">Description</label>
                <textarea
                  id="product-description"
                  placeholder="Describe the piece, fabric, fit…"
                  value={value.description}
                  onChange={(e) => set('description', e.target.value)}
                />
              </div>
              <div className="adm-field">
                <label>Moods</label>
                <div className="adm-chips">
                  {moods.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`adm-chip mood${value.moodIds.includes(String(m.id)) ? ' on' : ''}`}
                      style={value.moodIds.includes(String(m.id)) && m.color ? { background: m.color, color: '#131722' } : undefined}
                      onClick={() => toggleMood(String(m.id))}
                    >
                      {m.name}
                    </button>
                  ))}
                  {moods.length === 0 && <span className="adm-muted">No moods yet — create moods first.</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-head"><span className="adm-card-title">Category</span></div>
            <div className="adm-card-body">
              <div className="adm-field-row">
                <div className="adm-field">
                  <label htmlFor="product-category">Category</label>
                  <select
                    id="product-category"
                    value={value.categoryId}
                    onChange={(e) => {
                      set('categoryId', e.target.value);
                      set('subcategoryId', '');
                    }}
                  >
                    <option value="">Select category…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="adm-field">
                  <label htmlFor="product-subcategory">Subcategory</label>
                  <select
                    id="product-subcategory"
                    value={value.subcategoryId}
                    disabled={!value.categoryId || subcategoryOptions.length === 0}
                    onChange={(e) => set('subcategoryId', e.target.value)}
                  >
                    <option value="">
                      {!value.categoryId ? 'Choose a category first' : subcategoryOptions.length === 0 ? 'No subcategories' : 'Select subcategory…'}
                    </option>
                    {subcategoryOptions.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="adm-field">
                <label htmlFor="product-gst">GST rate</label>
                <select id="product-gst" value={value.gstRateId} onChange={(e) => set('gstRateId', e.target.value)}>
                  <option value="">Select GST rate…</option>
                  {gstRates.map((g) => (
                    <option key={g.id} value={g.id}>{g.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-head"><span className="adm-card-title">Pricing & inventory</span></div>
            <div className="adm-card-body">
              <div className="adm-field-row">
                <div className="adm-field">
                  <label htmlFor="product-price">Price (₹)</label>
                  <input id="product-price" type="number" placeholder="3499" value={value.price} onChange={(e) => set('price', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label htmlFor="product-mrp">MRP (₹)</label>
                  <input id="product-mrp" type="number" placeholder="4299" value={value.mrp} onChange={(e) => set('mrp', e.target.value)} />
                </div>
              </div>
              <div className="adm-field-row">
                <div className="adm-field">
                  <label>Return window (days)</label>
                  <input id="product-return" type="number" placeholder="7" value={value.returnWindowDays} onChange={(e) => set('returnWindowDays', e.target.value)} />
                </div>
              </div>
              <div style={{ padding: '12px 0', borderBottom: '1px solid #ddd', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Total Stock Quantity
                  </span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                    {value.sizeStocks.reduce((sum, s) => sum + s.stockQuantity, 0)}
                  </span>
                </div>
              </div>
            </div>
            <SizeStockManager
              value={value.sizeStocks}
              onChange={(stocks) => {
                set('sizeStocks', stocks);
                set('sizes', stocks.map((s) => s.size));
              }}
            />
            <div style={{ marginTop: '24px' }}>
              <div className="adm-field">
                <label>Flags</label>
                <div className="adm-chips">
                  <button type="button" className={`adm-chip${value.featured ? ' on' : ''}`} onClick={() => set('featured', !value.featured)}>Featured</button>
                  <button type="button" className={`adm-chip${value.newArrival ? ' on' : ''}`} onClick={() => set('newArrival', !value.newArrival)}>New arrival</button>
                  <button type="button" className={`adm-chip${value.bestSeller ? ' on' : ''}`} onClick={() => set('bestSeller', !value.bestSeller)}>Best seller</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="adm-card">
            <div className="adm-card-head"><span className="adm-card-title">Media</span></div>
            <div className="adm-card-body">
              {value.images.length > 0 && (
                <div className="adm-img-strip">
                  {value.images.map((img, i) => (
                    <div className="adm-img-thumb" key={img.productImageId ?? img.mediaId ?? img.url}>
                      <img src={img.url} alt="" />
                      <button type="button" className="adm-img-remove" onClick={() => removeImage(i)} aria-label="Remove image">✕</button>
                      {i === 0 && <span className="adm-img-primary">Cover</span>}
                    </div>
                  ))}
                </div>
              )}
              {value.images.length < 6 && (
                <label className="adm-dropzone" style={{ display: 'block', cursor: 'pointer' }}>
                  <div className="big">⬆</div>
                  {uploading ? 'Uploading…' : <>Drag images here or <b>browse</b></>}
                  <div style={{ fontSize: 11, marginTop: 6, color: '#bbb' }}>PNG / JPG up to 5MB — stored on the server</div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      handleFiles(e.target.files);
                      e.target.value = '';
                    }}
                  />
                </label>
              )}
            </div>
          </div>
          <div className="adm-preview">
            <div className="adm-preview-h">Live preview</div>
            <div className="adm-pv-img">
              {value.images[0] ? <img src={value.images[0].url} alt="" /> : null}
            </div>
            <div className="adm-pv-name">{value.name || 'Product name'}</div>
            <div className="adm-pv-price">
              {formatINR(priceNum)}
              {mrpNum > priceNum && (
                <span style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through', fontWeight: 400, marginLeft: 6 }}>
                  {formatINR(mrpNum)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="adm-form-actions">
        {mode === 'edit' && onDelete ? (
          <button type="button" className="adm-btn ghost danger" onClick={onDelete}>
            🗑 Archive product
          </button>
        ) : (
          <span />
        )}
        <div className="adm-form-actions-right">
          <button type="button" className="adm-btn ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="adm-btn rose" onClick={() => onSubmit(value, false)}>Save draft</button>
          <button type="button" className="adm-btn primary" onClick={() => onSubmit(value, true)}>
            {mode === 'edit' ? 'Save changes' : 'Publish'}
          </button>
        </div>
      </div>
    </>
  );
}
