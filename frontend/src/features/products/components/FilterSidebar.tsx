import { useEffect, useState } from 'react';
import {
  catalogFilterApi,
  type CatalogCategoryOption,
  type CatalogSubcategoryOption,
} from '../services/catalogFilterApi';

export type PriceRangeId = 'under-999' | '999-1999' | '2000-3999' | '4000-plus';

export interface ListingFilters {
  category: string | null;
  subcategory: string | null;
  priceRange: PriceRangeId | null;
  onSale: boolean;
  isNew: boolean;
  sizes: string[];
}

interface FilterSidebarProps {
  brandName: string;
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}

const SIZE_CHIPS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const PRICE_RANGES: Array<{
  id: PriceRangeId;
  label: string;
  minPrice?: number;
  maxPrice?: number;
}> = [
  { id: 'under-999', label: 'Under ₹999', maxPrice: 998.99 },
  { id: '999-1999', label: '₹999–₹1999', minPrice: 999, maxPrice: 1999 },
  { id: '2000-3999', label: '₹2000–₹3999', minPrice: 2000, maxPrice: 3999 },
  { id: '4000-plus', label: '₹4000+', minPrice: 4000 },
];

export function FilterSidebar({ brandName, filters, onChange }: FilterSidebarProps) {
  const [categories, setCategories] = useState<CatalogCategoryOption[]>([]);
  const [subcategories, setSubcategories] = useState<CatalogSubcategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoadingCategories(true);
    catalogFilterApi.listCategories()
      .then((items) => {
        if (active) setCategories(items);
      })
      .catch(() => {
        if (active) setCatalogError('Categories are unavailable right now.');
      })
      .finally(() => {
        if (active) setLoadingCategories(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setSubcategories([]);
    if (!filters.category) {
      setLoadingSubcategories(false);
      return () => {
        active = false;
      };
    }

    setLoadingSubcategories(true);
    catalogFilterApi.listSubcategories(filters.category)
      .then((items) => {
        if (active) setSubcategories(items);
      })
      .catch(() => {
        if (active) setCatalogError('Subcategories are unavailable right now.');
      })
      .finally(() => {
        if (active) setLoadingSubcategories(false);
      });
    return () => {
      active = false;
    };
  }, [filters.category]);

  const toggleSize = (size: string) => {
    const has = filters.sizes.includes(size);
    onChange({ ...filters, sizes: has ? filters.sizes.filter((item) => item !== size) : [...filters.sizes, size] });
  };

  const hasFilters = Boolean(
    filters.category || filters.subcategory || filters.priceRange || filters.sizes.length || filters.isNew || filters.onSale,
  );

  return (
    <aside className="listing-sidebar">
      <div className="sb-brand-block">
        <span className="sb-brand-kicker">Curated by</span>
        <div className="sb-brand-name">{brandName || '–'}</div>
        <div className="sb-accent-bar" />
      </div>

      <div className="sb-section-title">
        <span>Filter</span>
        {hasFilters && (
          <button
            type="button"
            className="sb-clear"
            onClick={() => onChange({ category: null, subcategory: null, priceRange: null, sizes: [], isNew: false, onSale: false })}
          >
            Clear all
          </button>
        )}
      </div>

      <div className="sb-group">
        <div className="sb-group-head">Category <span>▾</span></div>
        <div className="sb-chip-row">
          <button
            type="button"
            className={`sb-chip${filters.category === null ? ' active' : ''}`}
            onClick={() => onChange({ ...filters, category: null, subcategory: null })}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`sb-chip${filters.category === category.slug ? ' active' : ''}`}
              onClick={() => onChange({ ...filters, category: category.slug, subcategory: null })}
            >
              {category.name}
            </button>
          ))}
          {loadingCategories && <span className="sb-filter-note">Loading…</span>}
        </div>
      </div>

      {filters.category && (
        <div className="sb-group">
          <div className="sb-group-head">Subcategory <span>▾</span></div>
          <div className="sb-chip-row">
            <button
              type="button"
              className={`sb-chip${filters.subcategory === null ? ' active' : ''}`}
              onClick={() => onChange({ ...filters, subcategory: null })}
            >
              All
            </button>
            {subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                type="button"
                className={`sb-chip${filters.subcategory === subcategory.slug ? ' active' : ''}`}
                onClick={() => onChange({ ...filters, subcategory: subcategory.slug })}
              >
                {subcategory.name}
              </button>
            ))}
            {loadingSubcategories && <span className="sb-filter-note">Loading…</span>}
            {!loadingSubcategories && subcategories.length === 0 && (
              <span className="sb-filter-note">No active subcategories</span>
            )}
          </div>
        </div>
      )}

      <div className="sb-group">
        <div className="sb-group-head">Size <span>▾</span></div>
        <div className="sb-size-grid">
          {SIZE_CHIPS.map((size) => (
            <button
              key={size}
              type="button"
              className={`sb-size${filters.sizes.includes(size) ? ' active' : ''}`}
              onClick={() => toggleSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="sb-group">
        <div className="sb-group-head">Price <span>▾</span></div>
        <div className="sb-chip-row">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.id}
              type="button"
              className={`sb-chip${filters.priceRange === range.id ? ' active' : ''}`}
              onClick={() => onChange({ ...filters, priceRange: filters.priceRange === range.id ? null : range.id })}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sb-group">
        <div className="sb-group-head">Availability <span>▾</span></div>
        <div className="sb-chip-row">
          <button
            type="button"
            className={`sb-chip${filters.isNew ? ' active' : ''}`}
            onClick={() => onChange({ ...filters, isNew: !filters.isNew })}
          >
            New Arrivals
          </button>
          <button
            type="button"
            className={`sb-chip${filters.onSale ? ' active' : ''}`}
            onClick={() => onChange({ ...filters, onSale: !filters.onSale })}
          >
            On Sale
          </button>
        </div>
      </div>

      {catalogError && <div className="sb-filter-error">{catalogError}</div>}
    </aside>
  );
}
