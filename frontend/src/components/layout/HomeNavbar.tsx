import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOODS } from '../../data/moods';
import { capitalize } from '../../utils/format';
import { useCart } from '../../app/providers/CartProvider';
import { useWishlist } from '../../app/providers/WishlistProvider';
import { useQuizModal } from '../../app/providers/QuizProvider';
import { useAuth } from '../../app/providers/AuthProvider';
import { ProfileDropdown } from './ProfileDropdown';

const TAGLINES = [
  'Shop the way you feel',
  'Every mood has a style',
  'Feel it. Wear it.',
  'Wear what you feel',
  'Your mood, your look',
  'Your feelings, curated',
  'Dress the feeling',
];

export function HomeNavbar() {
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { cart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const quiz = useQuizModal();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const t = setInterval(() => setTaglineIdx((i) => (i + 1) % TAGLINES.length), 2800);
    return () => clearInterval(t);
  }, []);

  const cartCount = cart.items.reduce((s, i) => s + i.qty, 0);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <nav id="navbar">
      <div className="nav-row1">
        <Link className="logo" to="/">Mood<em>Buds</em></Link>
        <form className="nav-search" onSubmit={onSearchSubmit}>
          <span className="nav-search-icon">🔍</span>
          <span id="search-placeholder" style={{ opacity: query ? 0 : 1 }}>{TAGLINES[taglineIdx]}</span>
          <input
            type="text"
            id="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
        </form>
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <ProfileDropdown />
              <Link className="nav-action" to="/wishlist">
                <span className="nav-action-ico">🤍</span>
                <span className="nav-action-lbl">Wishlist</span>
                {wishlistItems.length > 0 && <span className="cart-badge">{wishlistItems.length}</span>}
              </Link>
              <Link className="nav-action" to="/cart">
                <span className="nav-action-ico">🛍️</span>
                <span className="nav-action-lbl">Bag</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-action nav-auth-link" to="/login">
                <span className="nav-action-lbl">Sign In</span>
              </Link>
              <Link className="nav-action nav-auth-link nav-auth-primary" to="/register">
                <span className="nav-action-lbl">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="nav-row2" id="home-mood-tabs-row">
        {MOODS.map((m) => (
          <Link
            key={m.id}
            to={`/mood/${m.id}`}
            className="mood-tab"
            style={{ ['--tab-line' as string]: m.accentColor }}
            aria-label={`Shop ${capitalize(m.title)} mood`}
          >
            <span className="mood-tab-ico">{m.emoji}</span>
            <span className="mood-tab-lbl">{m.title}</span>
          </Link>
        ))}
        <div className="tabs-spacer" />
        <button id="find-tab" type="button" onClick={() => quiz.open()}>
          <span className="find-tab-ico">✦</span>
          <span className="find-tab-lbl">Find Your Mood</span>
          <span className="find-tab-arrow">↓</span>
        </button>
      </div>
    </nav>
  );
}
