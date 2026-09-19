import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useMoods } from '../../features/moods/hooks/useMoods';
import { moodBannerBackground } from '../../features/moods/utils/moodBanner';
import { useCart } from '../../app/providers/CartProvider';
import { useWishlist } from '../../app/providers/WishlistProvider';
import { useQuizModal } from '../../app/providers/QuizProvider';
import { useAuth } from '../../app/providers/AuthProvider';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { cart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const quiz = useQuizModal();
  const cartCount = cart.items.reduce((s, i) => s + i.qty, 0);
  const { moods } = useMoods();
  const bannerMood = moods.find((m) => m.id === 'party') ?? moods[0];
  const { isAuthenticated, customer, logout } = useAuth();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  return createPortal(
    <div
      className={`mmb-drawer-overlay${isOpen ? ' open' : ''}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mmb-drawer" role="dialog" aria-modal="true" aria-label="Menu">
        <div
          className="mmb-drawer-banner"
          style={{ backgroundImage: bannerMood ? moodBannerBackground(bannerMood) : undefined }}
        >
          <span className="mmb-drawer-banner-ribbon">₹300 OFF</span>
          <button type="button" className="mmb-drawer-close" aria-label="Close menu" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div className="mmb-drawer-banner-text">
            Flat ₹300 off your first order
            <span>Use code MOOD300 at checkout</span>
          </div>
        </div>

        <Link to="/" className="mmb-drawer-link" onClick={onClose}>
          Home <span className="chev">›</span>
        </Link>
        <Link to={moods[0] ? `/mood/${moods[0].id}` : '/'} className="mmb-drawer-link" onClick={onClose}>
          Shop by Mood <span className="chev">›</span>
        </Link>
        <Link to="/wishlist" className="mmb-drawer-link" onClick={onClose}>
          Wishlist
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {wishlistItems.length > 0 && <span className="mmb-drawer-count">{wishlistItems.length}</span>}
            <span className="chev">›</span>
          </span>
        </Link>
        <Link to="/cart" className="mmb-drawer-link" onClick={onClose}>
          Bag
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {cartCount > 0 && <span className="mmb-drawer-count">{cartCount}</span>}
            <span className="chev">›</span>
          </span>
        </Link>

        <div className="mmb-drawer-divider" />

        {isAuthenticated ? <>
        <div className="mmb-drawer-link"><strong>{customer?.firstName} {customer?.lastName}</strong></div>
        <Link to="/profile" className="mmb-drawer-link" onClick={onClose}>
          My Profile <span className="chev">›</span>
        </Link>
        <Link to="/profile/orders" className="mmb-drawer-link" onClick={onClose}>
          My Orders <span className="chev">›</span>
        </Link>
        <Link to="/profile/coupons" className="mmb-drawer-link" onClick={onClose}>
          Coupons <span className="chev">›</span>
        </Link>
        <Link to="/profile/addresses" className="mmb-drawer-link" onClick={onClose}>
          Addresses <span className="chev">›</span>
        </Link>
        <button type="button" className="mmb-drawer-link" onClick={() => { void logout(); onClose(); }}>Sign Out <span className="chev">›</span></button>
        </> : <>
          <Link to="/login" className="mmb-drawer-link" onClick={onClose}>Sign In <span className="chev">›</span></Link>
          <Link to="/register" className="mmb-drawer-link" onClick={onClose}>Create Account <span className="chev">›</span></Link>
        </>}

        <div className="mmb-drawer-divider" />

        <button
          type="button"
          className="mmb-drawer-link"
          onClick={() => {
            onClose();
            quiz.open();
          }}
        >
          Mood Quiz
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <span className="mmb-drawer-badge">NEW</span>
            <span className="chev">›</span>
          </span>
        </button>
        <Link to="/contact-us" className="mmb-drawer-link" onClick={onClose}>
          Contact Us <span className="chev">›</span>
        </Link>
      </div>
    </div>,
    document.body
  );
}
