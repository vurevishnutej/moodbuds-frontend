import { useMemo, useState } from 'react';
import { ORDERS } from '../../../data/profile';
import { formatINR } from '../../../utils/format';
import type { OrderStatus } from '../../../types';
import { useToast } from '../../../app/providers/ToastProvider';

const FILTERS: ('All' | OrderStatus)[] = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export function OrdersPage() {
  const [filter, setFilter] = useState<'All' | OrderStatus>('All');
  const toast = useToast();

  const filtered = useMemo(
    () => (filter === 'All' ? ORDERS : ORDERS.filter((o) => o.status === filter)),
    [filter]
  );

  return (
    <div className="prof-panel active">
      <div className="prof-panel-head">
        <div className="prof-panel-title">Orders</div>
        <div className="prof-panel-sub">Track, return or buy things again</div>
      </div>

      <div className="order-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`order-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.map((order) => (
        <div className="order-card" key={order.id}>
          <div className="order-card-head">
            <span className="order-id">{order.id}</span>
            <span className="order-date">{order.date}</span>
            <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
          </div>
          <div className="order-items-row">
            <div className="order-item-imgs">
              {order.items.map((item, i) => (
                <div className="order-item-img" key={i}>
                  <img src={item.image} alt={item.name} />
                </div>
              ))}
            </div>
            <div className="order-item-info">
              <div className="order-item-name">
                {order.items[0]?.name}
                {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}
              </div>
              <div className="order-item-meta">
                {order.moodLabel} · Size {order.size}
                {order.color ? ` · ${order.color}` : ''}
              </div>
            </div>
            <div className="order-total">{formatINR(order.total)}</div>
          </div>
          <div className="order-actions">
            {order.status === 'Delivered' && (
              <>
                <button type="button" className="order-btn primary" onClick={() => toast.info('Thanks for the feedback!')}>Rate &amp; Review</button>
                <button type="button" className="order-btn outline" onClick={() => toast.success('Items re-added to your bag')}>Reorder</button>
                <button type="button" className="order-btn outline" onClick={() => toast.info('Downloading invoice…')}>Invoice</button>
              </>
            )}
            {order.status === 'Shipped' && (
              <>
                <button type="button" className="order-btn primary" onClick={() => toast.info('Opening tracking…')}>Track Order</button>
                <button type="button" className="order-btn outline" onClick={() => toast.info('Cancellation requested')}>Cancel</button>
              </>
            )}
            {order.status === 'Processing' && (
              <button type="button" className="order-btn outline" onClick={() => toast.info('Order cancelled')}>Cancel Order</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
