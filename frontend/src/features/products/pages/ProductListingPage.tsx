import { useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ListingHeader } from '../../../components/layout/ListingHeader';
import { Footer } from '../../../components/layout/Footer';
import { LoadingState, ErrorState } from '../../../components/common/States';
import { useMood } from '../../moods/hooks/useMoods';
import { MOOD_MATERIAL } from '../../../data/moodPalette';
import { useMoodPalette } from '../../moods/hooks/useMoodPalette';
import { useBodyViewClass } from '../../../hooks/useBodyViewClass';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/ProductGrid';
import {
  FilterSidebar,
  PRICE_RANGES,
  type ListingFilters,
  type PriceRangeId,
} from '../components/FilterSidebar';
import { ListingToolbar } from '../components/ListingToolbar';
import { capitalize } from '../../../utils/format';
import type { MoodId, ProductQuery } from '../../../types';

export function ProductListingPage() {
  useBodyViewClass('listing');
  const { moodId } = useParams<{ moodId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mood, loading: moodLoading, error: moodError } = useMood(moodId);
  const [columns, setColumns] = useState<2 | 3 | 4>(4);

  const sortValue = searchParams.get('sort');
  const sort: NonNullable<ProductQuery['sort']> =
    sortValue === 'featured' || sortValue === 'price-asc' || sortValue === 'price-desc' ? sortValue : 'new';
  const priceValue = searchParams.get('price');
  const priceRange = PRICE_RANGES.some((range) => range.id === priceValue)
    ? priceValue as PriceRangeId
    : null;
  const filters: ListingFilters = useMemo(() => ({
    category: searchParams.get('category'),
    subcategory: searchParams.get('subcategory'),
    priceRange,
    sizes: (searchParams.get('sizes') ?? '').split(',').map((size) => size.trim()).filter(Boolean),
    isNew: searchParams.get('new') === 'true',
    onSale: searchParams.get('sale') === 'true',
  }), [priceRange, searchParams]);

  const setFilters = (nextFilters: ListingFilters) => {
    const next = new URLSearchParams(searchParams);
    const setOrDelete = (key: string, value: string | null) => value ? next.set(key, value) : next.delete(key);
    setOrDelete('category', nextFilters.category);
    setOrDelete('subcategory', nextFilters.subcategory);
    setOrDelete('price', nextFilters.priceRange);
    setOrDelete('sizes', nextFilters.sizes.length ? nextFilters.sizes.join(',') : null);
    setOrDelete('new', nextFilters.isNew ? 'true' : null);
    setOrDelete('sale', nextFilters.onSale ? 'true' : null);
    setSearchParams(next);
  };

  const setSort = (nextSort: NonNullable<ProductQuery['sort']>) => {
    const next = new URLSearchParams(searchParams);
    if (nextSort === 'new') next.delete('sort');
    else next.set('sort', nextSort);
    setSearchParams(next);
  };

  useMoodPalette(mood?.id);

  const query: ProductQuery = useMemo(() => {
    const selectedPrice = PRICE_RANGES.find((range) => range.id === filters.priceRange);
    return {
      moodId: mood?.id,
      sort,
      category: filters.category || undefined,
      subcategory: filters.subcategory || undefined,
      onSale: filters.onSale || undefined,
      isNew: filters.isNew || undefined,
      sizes: filters.sizes.length ? filters.sizes : undefined,
      minPrice: selectedPrice?.minPrice,
      maxPrice: selectedPrice?.maxPrice,
    };
  },
    [mood?.id, sort, filters]
  );

  const { products, loading, error, refetch } = useProducts(query);

  if (moodLoading) return <LoadingState label="Finding your mood…" />;

  if (!mood) {
    return (
      <div id="not-found">
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 400, marginBottom: 12 }}>{moodError ? 'Moods are taking a breather' : 'This mood is not available'}</h2>
        <p>
          <Link to="/" style={{ color: 'var(--mood-accent)' }}>← Back to home</Link>
        </p>
      </div>
    );
  }

  const materialLabel = MOOD_MATERIAL[mood.id as MoodId];

  return (
    <div id="view-listing" className="mb-page-fade">
      <div id="listing-page">
        <ListingHeader activeMoodId={mood.id} />

        <div id="listing-hero">
          {mood.image && (
            <img
              id="listing-hero-img"
              src={mood.image}
              alt={mood.title}
              loading="eager"
              onError={(event) => event.currentTarget.remove()}
            />
          )}
          <div id="listing-hero-overlay" />
          <div id="listing-hero-content">
            <span id="listing-hero-kicker">Mood Edit · {capitalize(mood.id)}</span>
            <h1 id="listing-hero-title">{capitalize(mood.title)}</h1>
            <p id="listing-hero-sub">{mood.subtitle}</p>
          </div>
          <div id="listing-hero-stripe" />
        </div>

        <div id="listing-main">
          <div className="breadcrumb-wrap">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="sep">/</span>
              <Link to="/">All Moods</Link>
              <span className="sep">/</span>
              <span className="current">{capitalize(mood.title)} · {mood.brand}</span>
            </nav>
          </div>

          <div className="shop-wrap">
            <FilterSidebar brandName={mood.brand} filters={filters} onChange={setFilters} />
            <div className="listing-products">
              <ListingToolbar
                count={products.length}
                sort={sort}
                onSortChange={setSort}
                columns={columns}
                onColumnsChange={setColumns}
              />
              {loading && <LoadingState label="Loading products…" />}
              {error && <ErrorState message={error} onRetry={refetch} />}
              {!loading && !error && (
                <ProductGrid products={products} materialLabel={materialLabel} columns={columns} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
