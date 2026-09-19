import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminModuleBar, AdminStats, AdminBody, AdminTable, AdminBadge, AdminDemoNote } from '../components/AdminUI';
import { ADMIN_ORDERS } from '../../../data/admin';
import { formatINR } from '../../../utils/format';

const TABS = ['All', 'New', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export function OrderListPage() {
  const [tab, setTab] = useState('All');
  const navigate = useNavigate();
  const rows = tab === 'All' ? ADMIN_ORDERS : ADMIN_ORDERS.filter((o) => o.status === tab);

  return (
    <>
      <AdminModuleBar
        title="Orders"
        sub="Track and fulfil every order"
        actions={<button type="button" className="adm-btn ghost sm">⬇ Export</button>}
      />
      <AdminBody>
        <AdminStats
          items={[
            { label: 'Orders today', value: 38, delta: '+12%', dir: 'up', icon: '🛍️' },
            { label: 'Revenue today', value: formatINR(146300), delta: '+8%', dir: 'up', icon: '💰' },
            { label: 'Pending fulfilment', value: 11, delta: 'action needed', dir: 'flat', icon: '⏳' },
            { label: 'Avg. order', value: formatINR(3852), delta: '+3%', dir: 'up', icon: '📈' },
          ]}
        />
        <div className="adm-tabs">
          {TABS.map((t) => (
            <button key={t} type="button" className={`adm-tab${tab === t ? ' on' : ''}`} onClick={() => setTab(t)}>
              {t}
              <span className="cnt">{t === 'All' ? ADMIN_ORDERS.length : ADMIN_ORDERS.filter((o) => o.status === t).length}</span>
            </button>
          ))}
        </div>
        <div className="adm-toolbar">
          <div className="adm-srch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>
            <input placeholder="Search order ID or customer…" />
          </div>
          <select className="adm-select"><option>Last 30 days</option><option>Today</option><option>This week</option></select>
        </div>
        <AdminTable
          rowKey={(o) => o.id}
          rows={rows}
          columns={[
            { header: 'Order', render: (o) => <span className="adm-strong">#{o.id}</span> },
            { header: 'Customer', render: (o) => o.customer },
            { header: 'Date', render: (o) => <span className="adm-muted">{o.date}</span> },
            { header: 'Items', render: (o) => `${o.items} item${o.items > 1 ? 's' : ''}` },
            { header: 'Total', render: (o) => <span className="adm-strong">{formatINR(o.total)}</span> },
            { header: 'Payment', render: (o) => <AdminBadge status={o.payment} /> },
            { header: 'Status', render: (o) => <AdminBadge status={o.status} /> },
            {
              header: '',
              render: () => (
                <button type="button" className="adm-ico-btn" title="View" onClick={() => navigate('/admin/order-details')}>
                  👁
                </button>
              ),
            },
          ]}
        />
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}
