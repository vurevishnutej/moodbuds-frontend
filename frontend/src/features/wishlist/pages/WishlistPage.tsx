import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleNavbar } from '../../../components/layout/SimpleNavbar';
import { useWishlist } from '../../../app/providers/WishlistProvider';
import { useCart } from '../../../app/providers/CartProvider';
import { WishlistCard } from '../components/WishlistCard';
import { useBodyViewClass } from '../../../hooks/useBodyViewClass';
import type { WishlistItem } from '../../../types';

type SortMode = 'recent' | 'price-asc' | 'price-desc' | 'name';

export function WishlistPage() {
  useBodyViewClass('wishlist');
  const { items, removeItem } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortMode>('recent');

  const sorted = useMemo(() => {
    const out = [...items];
    if (sort === 'price-asc') out.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') out.sort((a, b) => b.price - a.price);
    else if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name));
    else out.sort((a, b) => b.savedAt - a.savedAt);
    return out;
  }, [items, sort]);

  const handleMoveToBag = async (item: WishlistItem, size: string) => {
    await addToCart(
      {
        id: item.productId,
        name: item.name,
        brand: item.brand,
        moodId: item.moodId ?? 'happy',
        price: item.price,
        originalPrice: item.originalPrice,
        badge: item.badge ?? null,
        image: item.image,
        sizes: item.sizes,
        colors: [],
        rating: 0,
        reviewCount: 0,
        description: '',
      },
      size || item.sizes[0] || ''
    );
    await removeItem(item.id);
  };

  return (
    <div id="view-wishlist" className="mb-page-fade">
      <div id="wl-page">
        <SimpleNavbar
          navId="wl-navbar"
          innerClassName="wl-nav-inner"
          backClassName="wl-nav-back"
          logoClassName="wl-nav-logo"
          rightClassName="wl-nav-right"
          right={<span>{items.length} saved</span>}
        />

        <div className="wl-page-head">
          <span className="wl-page-title">Saved items</span>
          <div className="wl-page-meta">
            <span className="wl-page-count">{items.length} item{items.length === 1 ? '' : 's'}</span>
            <select
              className="wl-sort-sel"
              aria-label="Sort wishlist"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
            >
              <option value="recent">Recently saved</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        <div className="wl-body">
          {items.length === 0 ? (
            <div id="wl-empty">
              <div className="wl-empty-icon">♡</div>
              <div className="wl-empty-title">Nothing saved yet</div>
              <div className="wl-empty-sub">
                Items you heart while browsing
                <br />
                will appear here.
              </div>
              <button type="button" className="wl-empty-btn" onClick={() => navigate('/')}>
                Shop by mood
              </button>
            </div>
          ) : (
            <div id="wl-grid">
              {sorted.map((item) => (
                <WishlistCard key={item.id} item={item} onRemove={removeItem} onMoveToBag={handleMoveToBag} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
