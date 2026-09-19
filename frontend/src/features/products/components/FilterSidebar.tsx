export interface ListingFilters {
  onSale: boolean;
  isNew: boolean;
  sizes: string[];
}

interface FilterSidebarProps {
  brandName: string;
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}

const CATEGORY_CHIPS = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories'];
const SIZE_CHIPS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const PRICE_CHIPS = ['Under ₹999', '₹999–₹1999', '₹2000–₹3999', '₹4000+'];

export function FilterSidebar({ brandName, filters, onChange }: FilterSidebarProps) {
  const toggleSize = (size: string) => {
    const has = filters.sizes.includes(size);
    onChange({ ...filters, sizes: has ? filters.sizes.filter((s) => s !== size) : [...filters.sizes, size] });
  };

  return (
    <aside className="listing-sidebar">
      <div className="sb-brand-block">
        <span className="sb-brand-kicker">Curated by</span>
        <div className="sb-brand-name">{brandName || '–'}</div>
        <div className="sb-accent-bar" />
      </div>

      <div className="sb-section-title">Filter</div>

      <div className="sb-group">
        <div className="sb-group-head">Category <span>▾</span></div>
        <div className="sb-chip-row">
          {CATEGORY_CHIPS.map((c, i) => (
            <button key={c} type="button" className={`sb-chip${i === 0 ? ' active' : ''}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="sb-group">
        <div className="sb-group-head">Size <span>▾</span></div>
        <div className="sb-size-grid">
          {SIZE_CHIPS.map((s) => (
            <button
              key={s}
              type="button"
              className={`sb-size${filters.sizes.includes(s) ? ' active' : ''}`}
              onClick={() => toggleSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="sb-group">
        <div className="sb-group-head">Price <span>▾</span></div>
        <div className="sb-chip-row">
          {PRICE_CHIPS.map((c) => (
            <button key={c} type="button" className="sb-chip">
              {c}
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
    </aside>
  );
}
