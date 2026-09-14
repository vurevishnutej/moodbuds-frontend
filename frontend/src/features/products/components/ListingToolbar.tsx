import type { ProductQuery } from '../../../types';

interface ListingToolbarProps {
  count: number;
  sort: NonNullable<ProductQuery['sort']>;
  onSortChange: (sort: NonNullable<ProductQuery['sort']>) => void;
  columns: 2 | 3 | 4;
  onColumnsChange: (columns: 2 | 3 | 4) => void;
}

export function ListingToolbar({ count, sort, onSortChange, columns, onColumnsChange }: ListingToolbarProps) {
  return (
    <div className="toolbar">
      <span className="toolbar-count">
        <strong>{count}</strong> items
      </span>
      <select
        className="sort-select"
        aria-label="Sort products"
        value={sort}
        onChange={(e) => onSortChange(e.target.value as NonNullable<ProductQuery['sort']>)}
      >
        <option value="featured">Featured</option>
        <option value="new">Newest first</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
      <div className="toolbar-spacer" />
      <div className="view-toggle" role="group" aria-label="Grid view">
        {[2, 3, 4].map((c) => (
          <button
            key={c}
            type="button"
            className={`view-btn${columns === c ? ' active' : ''}`}
            title={`${c} columns`}
            onClick={() => onColumnsChange(c as 2 | 3 | 4)}
          >
            <svg viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="6" height="14" />
              <rect x="9" y="1" width="6" height="14" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
