import { AdminModuleBar, AdminStats, AdminBody, AdminBadge, AdminDemoNote } from '../components/AdminUI';
import { ADMIN_COUPONS } from '../../../data/admin';
import { formatINR } from '../../../utils/format';
import { useToast } from '../../../app/providers/ToastProvider';

export function AdminCouponsPage() {
  const toast = useToast();
  return (
    <>
      <AdminModuleBar
        title="Coupons & Discounts"
        sub="Create and track promo codes"
        actions={<button type="button" className="adm-btn primary" onClick={() => toast.info('New coupon (demo)')}>+ Create coupon</button>}
      />
      <AdminBody>
        <AdminStats
          items={[
            { label: 'Active coupons', value: 7, icon: '🎟️' },
            { label: 'Redemptions (30d)', value: '1,204', delta: '+14%', dir: 'up', icon: '✅' },
            { label: 'Discount given', value: formatINR(184500), icon: '💸' },
            { label: 'Top code', value: 'MOOD300', delta: '312 uses', dir: 'flat', icon: '🔥' },
          ]}
        />
        <div className="adm-coupon-grid">
          {ADMIN_COUPONS.map((c) => (
            <div className="adm-coupon" key={c.code}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div className="adm-coupon-code">{c.code}</div>
                <AdminBadge status={c.status} />
              </div>
              <div className="adm-coupon-desc">{c.desc}</div>
              <div className="adm-coupon-meta"><span>{c.uses} uses</span><span>Valid till {c.validTill}</span></div>
            </div>
          ))}
        </div>
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}
