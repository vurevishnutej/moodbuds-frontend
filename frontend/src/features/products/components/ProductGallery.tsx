import type { Product } from '../../../types';
import { HeartIcon } from '../../../components/common/Icons';
import { useWishlist } from '../../../app/providers/WishlistProvider';

export function ProductGallery({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="pd-gallery">
      <div className="pd-thumbs">
        {[product.image, product.image, product.image].map((src, i) => (
          <button key={i} type="button" className={`pd-thumb${i === 0 ? ' active' : ''}`}>
            <img src={src} alt={`${product.name} thumbnail ${i + 1}`} />
          </button>
        ))}
      </div>
      <div className="pd-main-img">
        {product.badge && <span className="pd-img-badge">{product.badge}</span>}
        <button
          type="button"
          className="pd-img-wish"
          aria-label="Add to wishlist"
          onClick={() => toggleWishlist(product)}
        >
          <HeartIcon filled={wishlisted} />
        </button>
        <img id="pd-main-img" src={product.image} alt={product.name} />
      </div>
    </div>
  );
}
