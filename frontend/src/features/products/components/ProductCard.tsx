import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../types';
import { formatINR } from '../../../utils/format';
import { useWishlist } from '../../../app/providers/WishlistProvider';
import { HeartIcon } from '../../../components/common/Icons';

interface ProductCardProps {
  product: Product;
  materialLabel: string;
  priority?: boolean;
}

export function ProductCard({ product, materialLabel, priority }: ProductCardProps) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="product-card"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="product-media">
        <span className="product-label">{materialLabel}</span>
        {product.badge && (
          <div className="product-badges">
            <span className={`product-badge ${product.badge.toLowerCase()}`}>{product.badge}</span>
          </div>
        )}
        <div className="product-actions">
          <button
            type="button"
            className="action-btn"
            aria-label="Wishlist"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
          >
            <HeartIcon size={15} filled={wishlisted} />
          </button>
        </div>
        <img
          src={product.image}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
        <div className="product-cart-bar">View product</div>
      </div>
      <div className="product-info">
        <div className="product-label-tag">{product.brand || materialLabel}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-price">
          <strong>{formatINR(product.price)}</strong>
          {product.originalPrice && <span className="price-was">{formatINR(product.originalPrice)}</span>}
          {discountPct !== null && <span className="price-off">{discountPct}% off</span>}
        </div>
      </div>
    </div>
  );
}
