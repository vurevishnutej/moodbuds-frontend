import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOODS } from '../../data/moods';
import { useCart } from '../../app/providers/CartProvider';
import { useWishlist } from '../../app/providers/WishlistProvider';
import { SearchIcon } from '../common/Icons';
import { ProfileDropdown } from './ProfileDropdown';

export function ListingHeader({ activeMoodId }: { activeMoodId?: string }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { cart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const cartCount = cart.items.reduce((s, i) => s + i.qty, 0);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header id="listing-navbar">
      <div className="header-main">
        <div className="header-inner">
          <nav className="nav-links" aria-label="Main">
            <Link className="nav-link" to="/">Shop <span className="caret">▾</span></Link>
            <Link className="nav-link" to="/">Shop by mood <span className="caret">▾</span></Link>
            <Link className="nav-link" to="/">New arrivals</Link>
          </nav>
          <Link className="logo" to="/">Mood<em>Buds</em></Link>
          <div className="header-right">
            <form className="search-bar" onSubmit={onSearchSubmit}>
              <span className="search-icon" aria-hidden="true"><SearchIcon size={16} /></span>
              <input
                type="search"
                placeholder="Search products…"
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
            <div className="nav-profile-wrap">
              <ProfileDropdown />
            </div>
            <Link className="header-icon" to="/wishlist" title="Wishlist" aria-label="Wishlist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M12 20.5l-1.1-1C5.5 14.8 2 11.5 2 7.5 2 5 4 3 6.5 3c1.7 0 3.4 1 4.5 2.5C12.1 4 13.8 3 15.5 3 18 3 20 5 20 7.5c0 4-3.5 7.3-8.9 11.9L12 20.5z" />
              </svg>
              <span className="icon-badge">{wishlistItems.length || ''}</span>
            </Link>
            <Link className="header-icon" to="/cart" title="Bag" aria-label="Bag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M6 7h12l-1 14H7L6 7z" />
                <path d="M9 7V5a3 3 0 016 0v2" />
              </svg>
              <span className="icon-badge">{cartCount || ''}</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="mood-strip">
        <div className="mood-strip-inner">
          {MOODS.map((m) => (
            <Link
              key={m.id}
              to={`/mood/${m.id}`}
              className={`mood-tab${m.id === activeMoodId ? ' active' : ''}`}
              style={{ ['--tab-line' as string]: m.accentColor }}
            >
              <span className="mood-tab-inner">
                <span className="mood-tab-emoji">{m.emoji}</span>
                <span className="mood-tab-lbl">{m.title}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
