import { useEffect, useMemo, useState } from 'react';
import { formatINR } from '../../../utils/format';
import { profileService, type CustomerOrderSummary } from '../services/profileService';

type DisplayStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
const FILTERS: ('All' | DisplayStatus)[] = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusOf = (status: string): DisplayStatus => {
  if (status === 'DELIVERED') return 'Delivered';
  if (status === 'SHIPPED' || status === 'OUT_FOR_DELIVERY') return 'Shipped';
  if (status === 'CANCELLED' || status === 'REFUNDED' || status === 'PAYMENT_FAILED') return 'Cancelled';
  return 'Processing';
};

export function OrdersPage() {
  const [filter, setFilter] = useState<'All' | DisplayStatus>('All');
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => { setLoading(true); setError(''); try { setOrders(await profileService.orders()); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not load orders'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const filtered = useMemo(() => filter === 'All' ? orders : orders.filter((order) => statusOf(order.status) === filter), [orders, filter]);

  return <div className="prof-panel active">
    <div className="prof-panel-head"><div className="prof-panel-title">Orders</div><div className="prof-panel-sub">Track and manage purchases stored on your account</div></div>
    <div className="order-filters">{FILTERS.map((item) => <button key={item} type="button" className={`order-filter-btn${filter === item ? ' active' : ''}`} onClick={() => setFilter(item)}>{item}</button>)}</div>
    {loading ? <div className="mb-state"><div className="mb-spinner"/><div>Loading your orders…</div></div> : error ? <div className="mb-state"><div className="mb-state-title">Orders could not be loaded</div><div className="mb-state-subtitle">{error}</div><button className="mb-state-retry" onClick={() => void load()}>Try again</button></div> : filtered.length === 0 ? <div className="mb-state"><div className="mb-state-title">No orders here yet</div><div className="mb-state-subtitle">Orders placed with this account will appear here.</div></div> : filtered.map((order) => {
      const status = statusOf(order.status);
      return <div className="order-card" key={order.orderNumber}>
        <div className="order-card-head"><span className="order-id">{order.orderNumber}</span><span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span><span className={`order-status ${status.toLowerCase()}`}>{status}</span></div>
        <div className="order-items-row"><div className="order-item-imgs">{order.primaryImageUrl && <div className="order-item-img"><img src={order.primaryImageUrl} alt="Order item" /></div>}</div><div className="order-item-info"><div className="order-item-name">{order.itemCount} item{order.itemCount === 1 ? '' : 's'}</div><div className="order-item-meta">Quantity {order.totalQuantity} · {order.paymentMethod.replaceAll('_', ' ')}</div></div><div className="order-total">{formatINR(order.totalAmount / 100)}</div></div>
      </div>;
    })}
  </div>;
}
