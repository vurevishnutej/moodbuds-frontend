import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { HomeNavbar } from '../../../components/layout/HomeNavbar';
import { MobileNavbar } from '../../../components/layout/MobileNavbar';
import { Footer } from '../../../components/layout/Footer';
import { LoadingState, EmptyState } from '../../../components/common/States';
import { ProductGrid } from '../components/ProductGrid';
import { useSearch } from '../hooks/useSearch';
import { useBodyViewClass } from '../../../hooks/useBodyViewClass';
import { useIsMobile } from '../../../hooks/useIsMobile';

export function SearchResultsPage() {
  useBodyViewClass('home');
  const isMobile = useIsMobile();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [draft, setDraft] = useState(q);
  const { results, loading } = useSearch(q, 0);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.trim()) setParams({ q: draft.trim() });
  };

  return (
    <div id="view-home" className="mb-page-fade">
      <div className="mb-mobile-shell">
        <MobileNavbar />
      </div>
      <div className="mb-desktop-only" id="page">
        <HomeNavbar />
        <div className="section">
          <div className="sec-head">
            <div>
              <h2 className="sec-title">Results for <em>&ldquo;{q}&rdquo;</em></h2>
              <p className="sec-tagline">{results.length} item{results.length === 1 ? '' : 's'} found</p>
            </div>
          </div>
          {loading && <LoadingState label="Searching…" />}
          {!loading && q && results.length === 0 && (
            <EmptyState title="No matches" subtitle="Try a different search term, or browse by mood instead." />
          )}
          {!loading && results.length > 0 && <ProductGrid products={results} materialLabel="Curated" />}
        </div>
      </div>

      {isMobile && (
        <div style={{ padding: '16px' }}>
          <form onSubmit={submitSearch} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              type="search"
              placeholder="Search products…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              style={{ flex: 1, height: 42, border: '1px solid #e0e0e0', borderRadius: 8, padding: '0 14px', fontSize: 14 }}
              autoFocus
            />
          </form>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, marginBottom: 4 }}>
            Results for &ldquo;{q}&rdquo;
          </h2>
          <p style={{ fontSize: 12, color: '#999', marginBottom: 16 }}>{results.length} item{results.length === 1 ? '' : 's'} found</p>
          {loading && <LoadingState label="Searching…" />}
          {!loading && q && results.length === 0 && (
            <EmptyState title="No matches" subtitle="Try a different search term, or browse by mood instead." />
          )}
          {!loading && results.length > 0 && <ProductGrid products={results} materialLabel="Curated" columns={2} />}
        </div>
      )}
      <Footer />
    </div>
  );
}
