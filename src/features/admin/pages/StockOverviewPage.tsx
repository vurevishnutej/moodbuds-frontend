import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AdminModuleBar, AdminStats, AdminBody, AdminBadge } from '../components/AdminUI';
import { adminThumb } from '../../../data/admin';
import { formatINR } from '../../../utils/format';
import { ApiError } from '../../../services/api/apiClient';
import { adminQuizService, type AdminSummary } from '../services/adminQuizService';
import {
  adminInventoryService,
  type InventoryOverview,
  type InventoryStatus,
} from '../services/adminInventoryService';

type StockFilter = 'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK';

const EMPTY_OVERVIEW: InventoryOverview = {
  summary: {
    totalProducts: 0, totalSizeVariants: 0, totalUnits: 0, inStockProducts: 0,
    lowStockVariants: 0, outOfStockVariants: 0, stockValue: 0,
  },
  products: [],
};

function statusLabel(status: InventoryStatus): string {
  if (status === 'IN_STOCK') return 'In stock';
  if (status === 'LOW_STOCK') return 'Low stock';
  if (status === 'OUT_OF_STOCK') return 'Out of stock';
  return 'Disabled';
}

function readableError(error: unknown): string {
  if (!(error instanceof Error)) return 'The stockroom lost count for a moment. Please retry.';
  try {
    const body = JSON.parse(error.message) as { detail?: string; message?: string };
    return body.detail || body.message || 'The stockroom could not load inventory right now.';
  } catch {
    return error.message || 'The stockroom could not load inventory right now.';
  }
}

function csvCell(value: string | number | boolean): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export function StockOverviewPage() {
  const [admin, setAdmin] = useState<AdminSummary | null>(() => adminQuizService.currentAdmin());
  const [overview, setOverview] = useState<InventoryOverview>(EMPTY_OVERVIEW);
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StockFilter>('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try { setOverview(await adminInventoryService.overview()); }
    catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        adminQuizService.logout();
        setAdmin(null);
        setOverview(EMPTY_OVERVIEW);
        setError('Your admin session has expired. Sign in again to reopen the stockroom.');
      } else {
        setError(readableError(cause));
      }
    }
    finally { setLoading(false); }
  };

  useEffect(() => { if (admin) void load(); }, [admin]);

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    return overview.products.filter((product) => {
      const matchesSearch = !term || `${product.name} ${product.sku} ${product.moods.join(' ')}`.toLowerCase().includes(term);
      const matchesFilter = filter === 'ALL' || product.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [overview.products, query, filter]);

  const toggleProduct = (productId: number) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const exportInventory = () => {
    const rows = [['Product', 'SKU', 'Size', 'Quantity', 'Low stock threshold', 'Available', 'Status']];
    for (const product of visibleProducts) {
      if (product.sizes.length === 0) rows.push([product.name, product.sku, '', '0', '', 'false', 'Out of stock']);
      for (const size of product.sizes) rows.push([
        product.name, product.sku, size.size, String(size.stockQuantity), String(size.lowStockThreshold),
        String(size.available), statusLabel(size.status),
      ]);
    }
    const csv = rows.map((row) => row.map(csvCell).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'moodbuds-inventory.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!admin) return (
    <>
      <AdminModuleBar title="Stock Overview" sub="Monitor inventory health across the catalog" />
      <AdminBody><div className="adm-card qadm-login-card"><div className="adm-card-body">
        <div className="qadm-login-copy"><div className="qadm-lock">📦</div><div><span className="qadm-eyebrow">Restricted workspace</span><h2>Admin access</h2><p>Sign in to inspect product and size-level inventory.</p></div></div>
        <form className="qadm-login-form" onSubmit={async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault(); const form = new FormData(event.currentTarget); setLoading(true); setError('');
          try { setAdmin(await adminQuizService.login(String(form.get('username')), String(form.get('password')))); }
          catch (cause) { setError(readableError(cause)); } finally { setLoading(false); }
        }}>
          <label className="adm-field"><span>Username</span><input name="username" autoComplete="username" required /></label>
          <label className="adm-field"><span>Password</span><input name="password" type="password" autoComplete="current-password" required /></label>
          {error && <div className="qadm-error">{error}</div>}
          <button className="adm-btn primary" disabled={loading}>{loading ? 'Opening stockroom…' : 'Open stockroom'}</button>
        </form>
      </div></div></AdminBody>
    </>
  );

  const summary = overview.summary;
  return (
    <>
      <AdminModuleBar
        title="Stock Overview"
        sub="Monitor inventory health across products and sizes"
        actions={<button type="button" className="adm-btn ghost sm" onClick={exportInventory} disabled={visibleProducts.length === 0}>⬇ Export</button>}
      />
      <AdminBody>
        <AdminStats items={[
          { label: 'Products', value: summary.totalProducts, icon: '📦' },
          { label: 'Size variants', value: summary.totalSizeVariants, icon: '🏷️' },
          { label: 'Units in stock', value: summary.totalUnits, icon: '✅' },
          { label: 'Stock value', value: formatINR(summary.stockValue / 100), icon: '💰' },
        ]} />
        <div className="iadm-health" aria-label="Inventory alerts">
          <span><b>{summary.inStockProducts}</b> sellable products</span>
          <span className="low"><b>{summary.lowStockVariants}</b> low-stock sizes</span>
          <span className="out"><b>{summary.outOfStockVariants}</b> out-of-stock sizes</span>
        </div>
        <div className="adm-toolbar">
          <div className="adm-srch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product, SKU or mood…" aria-label="Search inventory" />
          </div>
          <select className="adm-select" value={filter} onChange={(event) => setFilter(event.target.value as StockFilter)} aria-label="Filter inventory status">
            <option value="ALL">All products</option><option value="LOW_STOCK">Low stock</option><option value="OUT_OF_STOCK">Out of stock</option>
          </select>
          <button type="button" className="adm-btn ghost sm" onClick={() => void load()} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</button>
        </div>

        {error && <div className="qadm-error iadm-error" role="alert">{error} <button type="button" onClick={() => void load()}>Retry</button></div>}
        {loading && overview.products.length === 0 ? <div className="badm-loading">Counting every size in the stockroom…</div> : visibleProducts.length === 0 ? (
          <div className="iadm-empty"><span>📭</span><b>No inventory matches this view.</b><p>Try another product name or stock filter.</p></div>
        ) : (
          <div className="adm-tablewrap iadm-tablewrap">
            <table className="adm-table iadm-table">
              <thead><tr><th>Product</th><th>Mood</th><th>Total qty</th><th>Status</th><th>Sizes</th></tr></thead>
              <tbody>{visibleProducts.map((product, index) => {
                const isExpanded = expanded.has(product.productId);
                const detailId = `inventory-sizes-${product.productId}`;
                return [
                  <tr className={`iadm-product-row${isExpanded ? ' expanded' : ''}`} key={`product-${product.productId}`}>
                    <td><div className="adm-prod-cell"><img className="adm-thumb" src={product.imageUrl || adminThumb(index)} loading="lazy" alt="" /><div><div className="adm-prod-name">{product.name}</div><div className="adm-prod-sku">{product.sku} · {product.sizes.length} size{product.sizes.length === 1 ? '' : 's'}</div></div></div></td>
                    <td><div className="iadm-moods">{product.moods.length ? product.moods.map((mood) => <span key={mood}>{mood}</span>) : <span className="adm-muted">—</span>}</div></td>
                    <td><span className="adm-strong">{product.totalStock}</span></td>
                    <td><AdminBadge status={statusLabel(product.status)} /></td>
                    <td className="iadm-expand-cell"><button type="button" className={`iadm-expand${isExpanded ? ' open' : ''}`} onClick={() => toggleProduct(product.productId)} aria-expanded={isExpanded} aria-controls={detailId} aria-label={`${isExpanded ? 'Hide' : 'Show'} size stock for ${product.name}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="m7 9 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg></button></td>
                  </tr>,
                  isExpanded && <tr className="iadm-detail-row" key={`sizes-${product.productId}`} id={detailId}><td colSpan={5}><div className="iadm-sizes"><div className="iadm-size-head"><span>Size</span><span>Stock left</span><span>Low-stock at</span><span>Availability</span><span>Status</span></div>{product.sizes.length ? product.sizes.map((size) => <div className="iadm-size" key={size.sizeId}><strong>{size.size}</strong><span className="iadm-size-qty">{size.stockQuantity}</span><span>{size.lowStockThreshold}</span><span>{size.available ? 'Enabled' : 'Disabled'}</span><AdminBadge status={statusLabel(size.status)} /></div>) : <div className="iadm-no-sizes">No sizes are configured for this product.</div>}</div></td></tr>,
                ];
              })}</tbody>
            </table>
          </div>
        )}
      </AdminBody>
    </>
  );
}
