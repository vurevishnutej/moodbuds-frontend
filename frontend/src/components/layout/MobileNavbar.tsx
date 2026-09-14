import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../app/providers/CartProvider';
import { useWishlist } from '../../app/providers/WishlistProvider';
import { MobileMenu } from './MobileMenu';

export function MobileNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const cartCount = cart.items.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <nav className="mmb-navbar">
        <div className="mmb-navbar-left">
          <button
            type="button"
            className="mmb-hamburger"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
          <Link className="mmb-logo" to="/">Mood<em>Buds</em></Link>
        </div>
        <div className="mmb-navbar-actions">
          <Link to="/search" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>
          </Link>
          <Link to="/wishlist" aria-label="Wishlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M12 20.5l-1.1-1C5.5 14.8 2 11.5 2 7.5 2 5 4 3 6.5 3c1.7 0 3.4 1 4.5 2.5C12.1 4 13.8 3 15.5 3 18 3 20 5 20 7.5c0 4-3.5 7.3-8.9 11.9L12 20.5z" /></svg>
            {wishlistItems.length > 0 && <span className="mmb-badge">{wishlistItems.length}</span>}
          </Link>
          <Link to="/cart" aria-label="Bag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M6 7h12l-1 14H7L6 7z" /><path d="M9 7V5a3 3 0 016 0v2" /></svg>
            {cartCount > 0 && <span className="mmb-badge">{cartCount}</span>}
          </Link>
        </div>
      </nav>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
