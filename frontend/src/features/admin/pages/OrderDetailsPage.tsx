import { AdminModuleBar, AdminBody, AdminBadge, AdminMoodBadge, AdminDemoNote } from '../components/AdminUI';
import { ADMIN_ORDERS, ADMIN_MOODS, adminThumb } from '../../../data/admin';
import { formatINR } from '../../../utils/format';
import { useToast } from '../../../app/providers/ToastProvider';

const LINES: [string, string, string, number][] = [
  ['Structured Blazer', 'The Boardroom', 'M', 3499],
  ['Sunshine Knit Tee', 'Sunshine Edit', 'L', 999],
  ['Pearl Detail Earrings', 'Tender Things', 'One size', 799],
];

const TIMELINE: [string, string, 'done' | 'now' | ''][] = [
  ['Order placed', '28 Jun 2026, 14:18', 'done'],
  ['Payment confirmed', '28 Jun 2026, 14:18', 'done'],
  ['Packed', '28 Jun 2026, 16:40', 'done'],
  ['Shipped', 'Awaiting pickup', 'now'],
  ['Out for delivery', '—', ''],
  ['Delivered', '—', ''],
];

export function OrderDetailsPage() {
  const order = ADMIN_ORDERS[0];
  const mood = ADMIN_MOODS.find((m) => m.id === order.mood)!;
  const toast = useToast();

  return (
    <>
      <AdminModuleBar
        title={`Order #${order.id}`}
        sub={`Placed 28 Jun 2026 · ${order.customer}`}
        actions={
          <>
            <button type="button" className="adm-btn ghost sm" onClick={() => toast.info('Invoice downloading…')}>Invoice</button>
            <button type="button" className="adm-btn ghost sm" onClick={() => toast.info('Refund flow (demo)')}>Refund</button>
            <button type="button" className="adm-btn primary" onClick={() => toast.success('Marked as shipped ✦')}>Mark shipped</button>
          </>
        }
      />
      <AdminBody>
        <div className="adm-cols">
          <div>
            <div className="adm-card">
              <div className="adm-card-head">
                <span className="adm-card-title">Items ({LINES.length})</span>
                <AdminMoodBadge name={mood.name} color={mood.color} />
              </div>
              <div className="adm-card-body">
                {LINES.map((l, i) => (
                  <div className="adm-line" key={l[0]}>
                    <img className="adm-line-img" src={adminThumb(i)} alt="" />
                    <div style={{ flex: 1 }}>
                      <div className="adm-prod-name">{l[0]}</div>
                      <div className="adm-prod-sku">{l[1]} · Size {l[2]}</div>
                    </div>
                    <div className="adm-strong">{formatINR(l[3])}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="adm-card">
              <div className="adm-card-head">
                <span className="adm-card-title">Fulfilment timeline</span>
                <AdminBadge status="Shipped" />
              </div>
              <div className="adm-card-body">
                <div className="adm-timeline">
                  {TIMELINE.map((t) => (
                    <div className={`adm-tl-item ${t[2]}`} key={t[0]}>
                      <div className="adm-tl-title">{t[0]}</div>
                      <div className="adm-tl-time">{t[1]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="adm-card">
              <div className="adm-card-head"><span className="adm-card-title">Customer</span></div>
              <div className="adm-card-body">
                <div className="adm-info-row"><span className="k">Name</span><span className="v">{order.customer}</span></div>
                <div className="adm-info-row"><span className="k">Email</span><span className="v">gautham@email.com</span></div>
                <div className="adm-info-row"><span className="k">Phone</span><span className="v">+91 98765 43210</span></div>
                <div className="adm-info-row"><span className="k">Ship to</span><span className="v">42, MG Road,<br />Bengaluru 560001</span></div>
              </div>
            </div>
            <div className="adm-card">
              <div className="adm-card-head">
                <span className="adm-card-title">Payment</span>
                <AdminBadge status="Paid" />
              </div>
              <div className="adm-card-body">
                <div className="adm-info-row"><span className="k">Subtotal</span><span className="v">{formatINR(5297)}</span></div>
                <div className="adm-info-row"><span className="k">Discount (MOOD300)</span><span className="v" style={{ color: '#26a541' }}>−{formatINR(300)}</span></div>
                <div className="adm-info-row"><span className="k">Shipping</span><span className="v">Free</span></div>
                <div className="adm-info-row"><span className="k" style={{ fontWeight: 700, color: '#131722' }}>Total</span><span className="v" style={{ fontSize: 16 }}>{formatINR(order.total)}</span></div>
              </div>
            </div>
          </div>
        </div>
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}
