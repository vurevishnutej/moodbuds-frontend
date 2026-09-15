import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleNavbar } from '../../../components/layout/SimpleNavbar';
import { BagIcon } from '../../../components/common/Icons';
import { useCart } from '../../../app/providers/CartProvider';
import { useWishlist } from '../../../app/providers/WishlistProvider';
import { useToast } from '../../../app/providers/ToastProvider';
import { CartItemRow } from '../components/CartItemRow';
import { PriceSummary } from '../components/PriceSummary';
import { checkoutService } from '../services/cartService';
import { useBodyViewClass } from '../../../hooks/useBodyViewClass';
import type { CartItem } from '../../../types';

export function CartPage() {
  useBodyViewClass('cart');
  const { cart, updateQty, removeItem, applyPromoCode, removePromoCode, refresh } = useCart();
  const { toggleWishlist } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const count = cart.items.reduce((s, i) => s + i.qty, 0);

  const handleMoveToWishlist = async (item: CartItem) => {
    await toggleWishlist({
      id: item.productId,
      name: item.name,
      brand: item.brand,
      moodId: item.moodId ?? 'happy',
      price: item.price,
      originalPrice: item.originalPrice,
      badge: null,
      image: item.image,
      sizes: [item.size],
      colors: [],
      rating: 0,
      reviewCount: 0,
      description: '',
    });
    await removeItem(item.id);
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    const result = await checkoutService.checkout(cart);
    setCheckingOut(false);
    if (result.success) {
      toast.success(`Order placed — ${result.orderId}`);
      await refresh();
      navigate('/profile/orders');
    }
  };

  return (
    <div id="view-cart" className="mb-page-fade">
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
              checkingOut={checkingOut}
            />
          )}
        </div>
      </div>
    </div>
  );
}
