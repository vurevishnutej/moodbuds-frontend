import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ListingHeader } from '../../../components/layout/ListingHeader';
import { Footer } from '../../../components/layout/Footer';
import { LoadingState, EmptyState } from '../../../components/common/States';
import { ProductGrid } from '../components/ProductGrid';
import { useSearch } from '../hooks/useSearch';
import { useBodyViewClass } from '../../../hooks/useBodyViewClass';

export function SearchResultsPage() {
  useBodyViewClass('listing');
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [draft, setDraft] = useState(q);
  const { results, loading } = useSearch(q, 0);

  useEffect(() => {
    setDraft(q);
  }, [q]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.trim()) setParams({ q: draft.trim() });
  };

  return (
    <div id="view-listing" className="mb-page-fade">
      <div id="listing-page">
        <ListingHeader />
        <main className="search-results-wrap">
          <div className="search-results-head">
            <div>
              <span className="search-results-kicker">Search MoodBuds</span>
              <h1>Results for <em>&ldquo;{q}&rdquo;</em></h1>
              <p>{results.length} item{results.length === 1 ? '' : 's'} found</p>
            </div>
            <form className="search-results-form" onSubmit={submitSearch}>
              <input
                type="search"
                aria-label="Search products"
                placeholder="Search products…"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <button type="submit" disabled={!draft.trim()}>Search</button>
            </form>
          </div>
          <div className="search-results-products">
            {loading && <LoadingState label="Searching…" />}
            {!loading && q && results.length === 0 && (
              <EmptyState title="No matches" subtitle="Try a different search term, or browse by mood instead." />
            )}
            {!loading && results.length > 0 && (
              <ProductGrid products={results} materialLabel="Curated" columns={4} />
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
