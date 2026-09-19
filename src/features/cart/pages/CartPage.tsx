import { useNavigate } from 'react-router-dom';
import { MobileNavbar } from '../../../components/layout/MobileNavbar';
import { MobileFooter } from '../../../components/layout/MobileFooter';
import { SimpleNavbar } from '../../../components/layout/SimpleNavbar';
import { BagIcon } from '../../../components/common/Icons';
import { useCart } from '../../../app/providers/CartProvider';
import { useWishlist } from '../../../app/providers/WishlistProvider';
import { CartItemRow } from '../components/CartItemRow';
import { PriceSummary } from '../components/PriceSummary';
import { useBodyViewClass } from '../../../hooks/useBodyViewClass';
import { formatINR } from '../../../utils/format';
import type { CartItem } from '../../../types';

export function CartPage() {
  useBodyViewClass('cart');
  const { cart, updateQty, removeItem, moveToWishlist, applyPromoCode, removePromoCode } = useCart();
  const { refresh: refreshWishlist } = useWishlist();
  const navigate = useNavigate();

  const count = cart.items.reduce((s, i) => s + i.qty, 0);

  const handleMoveToWishlist = async (item: CartItem) => {
    await moveToWishlist(item.id);
    await refreshWishlist();
  };

  const handleCheckout = () => navigate('/checkout');

  return (
    <div id="view-cart" className="mb-page-fade">
      <div className="mb-mobile-shell">
        <MobileNavbar />
        <div style={{ padding: '16px' }}>
          <h1 style={{ fontSize: '18px', marginBottom: '16px' }}>Your Bag ({count})</h1>

          {cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛍</div>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Your bag is empty</div>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>Looks like you haven't added anything yet.</p>
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  padding: '10px 24px',
                  background: '#8b3a52',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Shop by mood
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div style={{ marginBottom: '16px' }}>
                {cart.items.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    gap: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #f0f0f0',
                    marginBottom: '12px',
                  }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: '#999' }}>{item.brand}</div>
                      <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                        Size: {item.size} {item.color && `• ${item.color}`}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#8b3a52', marginBottom: '8px' }}>
                        {formatINR(item.price)}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                          style={{
                            width: '24px', height: '24px', border: '1px solid #ddd',
                            background: '#fff', cursor: 'pointer', borderRadius: '2px',
                          }}
                        >−</button>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          style={{
                            width: '24px', height: '24px', border: '1px solid #ddd',
                            background: '#fff', cursor: 'pointer', borderRadius: '2px',
                          }}
                        >+</button>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#8b3a52', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleCheckout}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#8b3a52',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
        <MobileFooter />
      </div>

      <div className="mb-desktop-only">
      <div id="cart-page">
        <SimpleNavbar
          navId="cart-navbar"
          innerClassName="cart-nav-inner"
          backClassName="cart-nav-back"
          logoClassName="cart-nav-logo"
          rightClassName="cart-nav-right"
          right={
            <>
              <BagIcon size={15} />
              <span>{count} item{count === 1 ? '' : 's'}</span>
            </>
          }
        />

        <div className="cart-body" id="cart-body">
          <div id="cart-items-col">
            <div className="cart-items-head">
              <span className="cart-items-title">Your bag</span>
              <span className="cart-items-count">{count} item{count === 1 ? '' : 's'}</span>
            </div>

            {cart.items.length === 0 ? (
              <div id="cart-empty">
                <div className="cart-empty-title">Your bag is empty</div>
                <div className="cart-empty-sub">Looks like you haven&apos;t added anything yet.</div>
                <button type="button" className="cart-empty-btn" onClick={() => navigate('/')}>
                  Shop by mood
                </button>
              </div>
            ) : (
              <div id="cart-items-list">
                {cart.items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onQtyChange={updateQty}
                    onRemove={removeItem}
                    onMoveToWishlist={handleMoveToWishlist}
                  />
                ))}
              </div>
            )}
          </div>

          {cart.items.length > 0 && (
            <PriceSummary
              cart={cart}
              onApplyPromo={applyPromoCode}
              onRemovePromo={removePromoCode}
              onCheckout={handleCheckout}
              checkingOut={false}
            />
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
