import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../app/providers/CartProvider';
import { useWishlist } from '../../../app/providers/WishlistProvider';
import type { WishlistItem } from '../../../types';
import { WishlistCard } from '../../wishlist/components/WishlistCard';

export function ProfileWishlistPage() {
  const { items, removeItem, moveToCart } = useWishlist();
  const { refresh: refreshCart } = useCart();
  const navigate = useNavigate();

  const moveToBag = async (item: WishlistItem, size: string) => {
    await moveToCart(item.id, size || item.sizes[0] || '');
    await refreshCart();
  };

  return (
    <div className="prof-panel active">
      <div className="prof-panel-head">
        <div className="prof-panel-title">Wishlist</div>
        <div className="prof-panel-sub">{items.length} saved item{items.length === 1 ? '' : 's'}</div>
      </div>
      <div className="prof-box">
        {items.length === 0 ? (
          <div className="mb-state">
            <div className="mb-state-title">Nothing saved yet</div>
            <div className="mb-state-subtitle">Products you save while browsing will appear here.</div>
            <button type="button" className="mb-state-retry" onClick={() => navigate('/')}>Shop by mood</button>
          </div>
        ) : (
          <div className="prof-wishlist-grid">
            {items.map((item) => (
              <WishlistCard key={item.id} item={item} onRemove={removeItem} onMoveToBag={moveToBag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
