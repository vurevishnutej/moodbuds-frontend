import { useState } from 'react';
import type { Product } from '../../../types';
import { HeartIcon } from '../../../components/common/Icons';
import { useWishlist } from '../../../app/providers/WishlistProvider';

export function ProductGallery({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Use multiple images if available, otherwise repeat primary image
  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : [product.image, product.image, product.image];

  const selectedImage = galleryImages[selectedImageIdx] || galleryImages[0];

  return (
    <div className="pd-gallery">
      <div className="pd-thumbs">
        {galleryImages.map((src, i) => (
          <button
            key={i}
            type="button"
            className={`pd-thumb${i === selectedImageIdx ? ' active' : ''}`}
            onClick={() => setSelectedImageIdx(i)}
          >
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
        <img id="pd-main-img" src={selectedImage} alt={product.name} />
      </div>
    </div>
  );
}
