import { AdminModuleBar, AdminStats, AdminBody, AdminTable, AdminBadge, AdminMoodBadge } from '../components/AdminUI';
import { ADMIN_PRODUCTS, ADMIN_MOODS, adminThumb } from '../../../data/admin';
import { formatINR } from '../../../utils/format';
import { useToast } from '../../../app/providers/ToastProvider';

export function StockOverviewPage() {
  const toast = useToast();
  return (
    <>
      <AdminModuleBar
        title="Stock Overview"
        sub="Monitor inventory health across the catalog"
        actions={<button type="button" className="adm-btn ghost sm">⬇ Export</button>}
      />
      <AdminBody>
        <AdminStats
          items={[
            { label: 'Total SKUs', value: 312, icon: '📦' },
            { label: 'In stock', value: 295, icon: '✅' },
            { label: 'Low stock', value: 14, delta: 'reorder soon', dir: 'down', icon: '⚠️' },
            { label: 'Stock value', value: formatINR(2640000), delta: '+4%', dir: 'up', icon: '💰' },
          ]}
        />
        <div className="adm-toolbar">
          <div className="adm-srch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>
            <input placeholder="Search product or SKU…" />
          </div>
          <select className="adm-select"><option>All</option><option>Low stock</option><option>Out of stock</option></select>
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
            { header: 'Mood', render: (p) => {
              const m = ADMIN_MOODS.find((x) => x.id === p.mood)!;
              return <AdminMoodBadge name={m.name} color={m.color} />;
            } },
            { header: 'Qty', render: (p) => <span className="adm-strong">{p.stock}</span> },
            {
              header: 'Level',
              render: (p) => {
                const pct = Math.min(100, Math.round((p.stock / 64) * 100));
                const color = p.stock === 0 ? '#e5484d' : p.stock <= 8 ? '#ff9f0a' : '#26a541';
                return (
                  <div className="adm-bar" style={{ minWidth: 140 }}>
                    <span style={{ width: `${pct}%`, background: color }} />
                  </div>
                );
              },
            },
            { header: 'Status', render: (p) => <AdminBadge status={p.status} /> },
            {
              header: '',
              render: () => (
                <button type="button" className="adm-btn ghost sm" onClick={() => toast.success('Restock order created')}>
                  Restock
                </button>
              ),
            },
          ]}
        />
      </AdminBody>
    </>
  );
}
