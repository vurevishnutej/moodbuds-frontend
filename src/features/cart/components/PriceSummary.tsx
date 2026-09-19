import { useEffect, useState } from 'react';
import type { Cart } from '../../../types';
import { formatINR } from '../../../utils/format';
import { couponOffer, couponService, type CustomerCoupon } from '../../coupons/services/couponService';

interface PriceSummaryProps {
  cart: Cart;
  onApplyPromo: (code: string) => Promise<boolean>;
  onRemovePromo: () => Promise<void>;
  onCheckout: () => void;
  checkingOut: boolean;
}

export function PriceSummary({ cart, onApplyPromo, onRemovePromo, onCheckout, checkingOut }: PriceSummaryProps) {
  const [promoInput, setPromoInput] = useState('');
  const [applyingCode, setApplyingCode] = useState('');
  const [coupons, setCoupons] = useState<CustomerCoupon[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(true);
  const [couponsError, setCouponsError] = useState(false);

  const loadCoupons = async () => {
    setCouponsLoading(true);
    setCouponsError(false);
    try { setCoupons(await couponService.available()); }
    catch { setCouponsError(true); }
    finally { setCouponsLoading(false); }
  };

  useEffect(() => { void loadCoupons(); }, []);

  const handleApply = async (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized || applyingCode) return;
    setApplyingCode(normalized);
    const ok = await onApplyPromo(normalized);
    if (ok) setPromoInput('');
    setApplyingCode('');
  };

  const handleRemove = async () => {
    if (applyingCode) return;
    setApplyingCode(cart.promoCode || 'REMOVE');
    try { await onRemovePromo(); } finally { setApplyingCode(''); }
  };

  return (
    <div className="cart-summary" id="cart-summary-col">
      <div className="cart-sum-label">Order summary</div>

      <div className="cart-sum-row">
        <span>Subtotal</span>
        <span>{formatINR(cart.subtotal)}</span>
      </div>
      <div className="cart-sum-row">
        <span>Delivery</span>
        <span>{cart.delivery === 0 ? 'Free' : formatINR(cart.delivery)}</span>
      </div>
      {cart.savings > 0 && (
        <div className="cart-sum-row saving">
          <span>You save</span>
          <span>{formatINR(cart.savings)}</span>
        </div>
      )}
      {cart.discount > 0 && (
        <div className="cart-sum-row saving">
          <span>Promo ({cart.promoCode})</span>
          <span>−{formatINR(cart.discount)}</span>
        </div>
      )}

      <div className="cart-coupons">
        <div className="cart-coupons-head">
          <span>Available coupons</span>
          {!couponsLoading && <span>{coupons.length}</span>}
        </div>
        {couponsLoading ? (
          <div className="cart-coupons-state">Finding your offers…</div>
        ) : couponsError ? (
          <button type="button" className="cart-coupons-retry" onClick={() => void loadCoupons()}>Couldn&apos;t load offers · Retry</button>
        ) : coupons.length === 0 ? (
          <div className="cart-coupons-state">No account offers available right now.</div>
        ) : (
          <div className="cart-coupon-list">
            {coupons.map((coupon) => {
              const applied = cart.promoCode === coupon.code;
              const missingPaise = Math.max(0, coupon.minOrderValue - Math.round(cart.subtotal * 100));
              const eligible = missingPaise === 0;
              return (
                <div className={`cart-coupon-card${applied ? ' applied' : ''}`} key={coupon.code}>
                  <div className="cart-coupon-copy">
                    <div className="cart-coupon-code">
                      {coupon.code}
                      {coupon.audience === 'ASSIGNED_USERS' && <span>Just for you</span>}
                    </div>
                    <div className="cart-coupon-offer">{coupon.description || couponOffer(coupon)}</div>
                    <div className={`cart-coupon-meta${eligible ? '' : ' short'}`}>
                      {eligible
                        ? `${couponOffer(coupon)}${coupon.validUntil ? ` · Expires ${new Date(coupon.validUntil).toLocaleDateString('en-IN')}` : ''}`
                        : `Add ${formatINR(missingPaise / 100)} more to use this coupon`}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-coupon-apply"
                    disabled={!eligible || !!applyingCode}
                    onClick={() => void (applied ? handleRemove() : handleApply(coupon.code))}
                  >
                    {applyingCode === coupon.code ? 'Applying…' : applied ? 'Remove' : 'Apply'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="cart-promo">
        <input
          type="text"
          placeholder="Promo code"
          aria-label="Promo code"
          value={cart.promoCode ?? promoInput}
          disabled={!!cart.promoCode}
          onChange={(e) => setPromoInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void handleApply(promoInput)}
        />
        <button type="button" onClick={() => void (cart.promoCode ? handleRemove() : handleApply(promoInput))} disabled={!!applyingCode}>
          {applyingCode ? 'Please wait' : cart.promoCode ? 'Remove' : 'Apply'}
        </button>
      </div>

      <div className="cart-sum-divider" />
      <div className="cart-sum-total">
        <span className="cart-sum-total-label">Total</span>
        <span className="cart-sum-total-val">{formatINR(cart.total)}</span>
      </div>
      <div className="cart-tax-note">Inclusive of all taxes</div>

      <button type="button" className="cart-checkout-btn" onClick={onCheckout} disabled={checkingOut}>
        {checkingOut ? 'Placing order…' : 'Proceed to checkout'}
      </button>

      <div className="cart-trust">
        <div className="cart-trust-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M5 12h14M5 12l4-4M5 12l4 4" />
            <rect x="1" y="3" width="22" height="18" rx="1" />
          </svg>
          Free delivery on orders above ₹999
        </div>
        <div className="cart-trust-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0" />
            <path d="M12 8v4l3 3" />
          </svg>
          30-day free returns
        </div>
        <div className="cart-trust-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Secure checkout · 256-bit SSL
        </div>
      </div>
    </div>
  );
}
