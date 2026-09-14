import { useNavigate } from 'react-router-dom';
import { AdminModuleBar, AdminStats, AdminBody, AdminTable, AdminBadge, AdminMoodBadge, AdminDemoNote } from '../components/AdminUI';
import { ADMIN_PRODUCTS, ADMIN_MOODS, adminThumb } from '../../../data/admin';
import { formatINR } from '../../../utils/format';

export function EditProductsPage() {
  const navigate = useNavigate();
  return (
    <>
      <AdminModuleBar
        title="Edit Products"
        sub="Browse, search and manage your catalog"
        actions={
          <>
            <button className="adm-btn ghost sm" type="button">⬇ Export</button>
            <button className="adm-btn primary" type="button" onClick={() => navigate('/profile/admin/create-product')}>
              + Add product
            </button>
          </>
        }
      />
      <AdminBody>
        <AdminStats
          items={[
            { label: 'Total products', value: 312, delta: '+18 this month', dir: 'up', icon: '🧥' },
            { label: 'Active', value: 287, icon: '✅' },
            { label: 'Low stock', value: 14, delta: 'needs restock', dir: 'down', icon: '⚠️' },
            { label: 'Out of stock', value: 3, icon: '⛔' },
          ]}
        />
        <div className="adm-toolbar">
          <div className="adm-srch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>
            <input placeholder="Search by name, SKU or brand…" />
          </div>
          <select className="adm-select">
            <option>All moods</option>
            {ADMIN_MOODS.map((m) => <option key={m.id}>{m.name}</option>)}
          </select>
          <select className="adm-select">
            <option>All status</option>
            <option>Active</option>
            <option>Low stock</option>
            <option>Out of stock</option>
          </select>
        </div>
        <AdminTable
          rowKey={(p) => p.sku}
          rows={ADMIN_PRODUCTS}
          columns={[
            {
              header: 'Product',
              render: (p, i) => (
                <div className="adm-prod-cell">
                  <img className="adm-thumb" src={adminThumb(i)} loading="lazy" alt="" />
                  <div>
                    <div className="adm-prod-name">{p.name}</div>
                    <div className="adm-prod-sku">{p.sku}</div>
                  </div>
                </div>
              ),
            },
            { header: 'Brand', render: (p) => p.brand },
            { header: 'Mood', render: (p) => {
              const m = ADMIN_MOODS.find((x) => x.id === p.mood)!;
              return <AdminMoodBadge name={m.name} color={m.color} />;
            } },
            { header: 'Price', render: (p) => <span className="adm-strong">{formatINR(p.price)}</span> },
            { header: 'Stock', render: (p) => (p.stock === 0 ? <span className="adm-muted">0</span> : p.stock) },
            { header: 'Status', render: (p) => <AdminBadge status={p.status} /> },
            {
              header: 'Actions',
              render: () => (
                <div className="adm-row-actions">
                  <button type="button" className="adm-ico-btn" title="Edit">✎</button>
                  <button type="button" className="adm-ico-btn danger" title="Delete">🗑</button>
                </div>
              ),
            },
          ]}
        />
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}
