import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ListingHeader } from '../../../components/layout/ListingHeader';
import { Footer } from '../../../components/layout/Footer';
import { LoadingState, ErrorState } from '../../../components/common/States';
import { getMoodById } from '../../../data/moods';
import { MOOD_MATERIAL } from '../../../data/moodPalette';
import { useMoodPalette } from '../../moods/hooks/useMoodPalette';
import { useBodyViewClass } from '../../../hooks/useBodyViewClass';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/ProductGrid';
import { FilterSidebar, type ListingFilters } from '../components/FilterSidebar';
import { ListingToolbar } from '../components/ListingToolbar';
import { capitalize } from '../../../utils/format';
import type { MoodId, ProductQuery } from '../../../types';

export function ProductListingPage() {
  useBodyViewClass('listing');
  const { moodId } = useParams<{ moodId: string }>();
  const mood = getMoodById(moodId ?? '');
  const [sort, setSort] = useState<NonNullable<ProductQuery['sort']>>('new');
  const [columns, setColumns] = useState<2 | 3 | 4>(4);
  const [filters, setFilters] = useState<ListingFilters>({ onSale: false, isNew: false, sizes: [] });

  useMoodPalette(mood?.id);

  const query: ProductQuery = useMemo(
    () => ({
      moodId: mood?.id,
      sort,
      onSale: filters.onSale || undefined,
      isNew: filters.isNew || undefined,
      sizes: filters.sizes.length ? filters.sizes : undefined,
    }),
    [mood?.id, sort, filters]
  );

  const { products, loading, error, refetch } = useProducts(query);

  if (!mood) {
    return (
      <div id="not-found">
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 400, marginBottom: 12 }}>Mood not found</h2>
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
          <img id="listing-hero-img" src={mood.image} alt={mood.title} loading="eager" />
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
