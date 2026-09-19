import { COUPONS } from '../../../data/profile';
import { useToast } from '../../../app/providers/ToastProvider';

export function CouponsPage() {
  const toast = useToast();

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`${code} copied`);
    } catch {
      toast.info(code);
    }
  };

  return (
    <div className="prof-panel active">
      <div className="prof-panel-head">
        <div className="prof-panel-title">Coupons</div>
        <div className="prof-panel-sub">Your available discounts and offers</div>
      </div>
      <div className="prof-box">
        <div className="coupon-grid">
          {COUPONS.map((c) => (
            <div className={`coupon-card${c.variant !== 'default' ? ` ${c.variant}` : ''}`} key={c.code}>
              <span className="coupon-badge">{c.badge}</span>
              <div className="coupon-code">{c.code}</div>
              <div className="coupon-desc">{c.description}</div>
              <div className="coupon-validity">{c.validity}</div>
              <button type="button" className="coupon-copy-btn" onClick={() => copyCode(c.code)}>Copy</button>
            </div>
          ))}
          <div
            className="coupon-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 130,
              color: '#ccc',
              fontSize: 12,
              textAlign: 'center',
              padding: 24,
              borderStyle: 'dashed',
            }}
          >
            <div>More coupons unlock<br />with your next order ✦</div>
          </div>
        </div>
      </div>
    </div>
  );
}
