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
          <h1 style={{ fontSize: '18px', marginBottom: '12px' }}>Your Bag ({count})</h1>
          {/* Mobile cart content */}
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
