import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminModuleBar, AdminStats, AdminBody, AdminTable, AdminBadge, AdminMoodBadge, AdminConfirmDialog } from '../components/AdminUI';
import { adminThumb } from '../../../data/admin';
import { formatINR } from '../../../utils/format';
import { useToast } from '../../../app/providers/ToastProvider';
import { productAdminApi, type AdminProductRow } from '../services/productAdminApi';
import { ApiError } from '../../../services/api/apiClient';

export function EditProductsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleting, setDeleting] = useState<AdminProductRow | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    productAdminApi
      .listProducts()
      .then((rows) => {
        if (active) setProducts(rows);
      })
      .catch((err) => {
        if (active) toast.error(err instanceof ApiError ? err.message : 'Failed to load products');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moodOptions = useMemo(() => {
    const seen = new Map<string, string>();
    products.forEach((p) => {
      if (p.moodName && !seen.has(p.moodName)) seen.set(p.moodName, p.moodColor ?? '#AAAAAA');
    });
    return [...seen.entries()].map(([name, color]) => ({ name, color }));
  }, [products]);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const q = query.trim().toLowerCase();
        const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
        const matchesMood = moodFilter === 'all' || p.moodName === moodFilter;
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesQuery && matchesMood && matchesStatus;
      }),
    [products, query, moodFilter, statusFilter]
  );

  const stats = useMemo(() => {
    const active = products.filter((p) => p.status === 'Active').length;
    const low = products.filter((p) => p.status === 'Low stock').length;
    const out = products.filter((p) => p.status === 'Out of stock').length;
    return { total: products.length, active, low, out };
  }, [products]);

  return (
    <>
      <AdminModuleBar
        title="Edit Products"
        sub="Browse, search and manage your catalog"
        actions={
          <button className="adm-btn primary" type="button" onClick={() => navigate('/profile/admin/create-product')}>
            + Add product
          </button>
        }
      />
      <AdminBody>
        <AdminStats
          items={[
            { label: 'Total products', value: stats.total, icon: '🧥' },
            { label: 'Active', value: stats.active, icon: '✅' },
            { label: 'Low stock', value: stats.low, dir: stats.low ? 'down' : 'flat', delta: stats.low ? 'needs restock' : undefined, icon: '⚠️' },
            { label: 'Out of stock', value: stats.out, icon: '⛔' },
          ]}
        />
        <div className="adm-toolbar">
          <div className="adm-srch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>
            <input placeholder="Search by name or SKU…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select className="adm-select" value={moodFilter} onChange={(e) => setMoodFilter(e.target.value)}>
            <option value="all">All moods</option>
            {moodOptions.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
          </select>
          <select className="adm-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All status</option>
            <option value="Active">Active</option>
            <option value="Low stock">Low stock</option>
            <option value="Out of stock">Out of stock</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
        <AdminTable
          rowKey={(p) => String(p.id)}
          rows={filtered}
          columns={[
            {
              header: 'Product',
              render: (p, i) => (
                <div className="adm-prod-cell">
                  <img className="adm-thumb" src={p.image || adminThumb(i)} loading="lazy" alt="" />
                  <div>
                    <div className="adm-prod-name">{p.name}</div>
                    <div className="adm-prod-sku">{p.sku}</div>
                  </div>
                </div>
              ),
            },
            { header: 'Mood', render: (p) => (p.moodName ? <AdminMoodBadge name={p.moodName} color={p.moodColor ?? '#AAAAAA'} /> : <span className="adm-muted">—</span>) },
            { header: 'Price', render: (p) => <span className="adm-strong">{formatINR(p.price)}</span> },
            { header: 'Stock', render: (p) => (p.stock === 0 ? <span className="adm-muted">0</span> : p.stock) },
            { header: 'Status', render: (p) => <AdminBadge status={p.status} /> },
            {
              header: 'Actions',
              render: (p) => (
                <div className="adm-row-actions">
                  <button
                    type="button"
                    className="adm-ico-btn"
                    title="Edit"
                    onClick={() => navigate(`/profile/admin/edit-products/${p.id}`)}
                  >
                    ✎
                  </button>
                  <button type="button" className="adm-ico-btn danger" title="Delete" onClick={() => setDeleting(p)}>🗑</button>
                </div>
              ),
            },
          ]}
        />
        {!loading && filtered.length === 0 && (
          <div className="adm-muted" style={{ textAlign: 'center', padding: '32px 0' }}>
            {products.length === 0 ? 'No products yet. Add your first product.' : 'No products match your filters'}
          </div>
        )}
        {loading && <div className="adm-muted" style={{ textAlign: 'center', padding: '32px 0' }}>Loading products…</div>}
      </AdminBody>

      {deleting && (
        <AdminConfirmDialog
          title="Delete product"
          message={`Delete "${deleting.name}" (${deleting.sku})? This can't be undone.`}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            const target = deleting;
            setDeleting(null);
            try {
              await productAdminApi.deleteProduct(target.id);
              setProducts((prev) => prev.filter((p) => p.id !== target.id));
              toast.success(`"${target.name}" deleted`);
            } catch (err) {
              toast.error(err instanceof ApiError ? err.message : 'Failed to delete product');
            }
          }}
        />
      )}
    </>
  );
}
