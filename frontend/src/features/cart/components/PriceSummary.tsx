import { useState } from 'react';
import type { Cart } from '../../../types';
import { formatINR } from '../../../utils/format';

interface PriceSummaryProps {
  cart: Cart;
  onApplyPromo: (code: string) => Promise<boolean>;
  onRemovePromo: () => Promise<void>;
  onCheckout: () => void;
  checkingOut: boolean;
}

export function PriceSummary({ cart, onApplyPromo, onRemovePromo, onCheckout, checkingOut }: PriceSummaryProps) {
  const [promoInput, setPromoInput] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    if (!promoInput.trim() || applying) return;
    setApplying(true);
    const ok = await onApplyPromo(promoInput);
    if (ok) setPromoInput('');
    setApplying(false);
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

      <div className="cart-promo">
        <input
          type="text"
          placeholder="Promo code"
          aria-label="Promo code"
          value={cart.promoCode ?? promoInput}
          disabled={!!cart.promoCode}
          onChange={(e) => setPromoInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        />
        <button type="button" onClick={cart.promoCode ? () => void onRemovePromo() : handleApply} disabled={applying}>
          {cart.promoCode ? 'Remove' : 'Apply'}
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
      <button type="button" className="cart-save-btn">Save bag for later</button>

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
