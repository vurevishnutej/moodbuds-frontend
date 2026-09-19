import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SimpleNavbar } from '../../../components/layout/SimpleNavbar';
import { Footer } from '../../../components/layout/Footer';
import { LoadingState, ErrorState } from '../../../components/common/States';
import { BagIcon, HeartIcon } from '../../../components/common/Icons';
import { formatINR, capitalize } from '../../../utils/format';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../../app/providers/CartProvider';
import { useWishlist } from '../../../app/providers/WishlistProvider';
import { useBodyViewClass } from '../../../hooks/useBodyViewClass';
import { ProductAccordion } from '../components/ProductAccordion';
import { ProductCard } from '../components/ProductCard';
import { ProductGallery } from '../components/ProductGallery';
import { ProductReviewsSection } from '../components/ProductReviewsSection';
import { MOOD_MATERIAL } from '../../../data/moodPalette';
import type { MoodId } from '../../../types';

export function ProductDetailsPage() {
  useBodyViewClass('product');
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { product, related, loading, error } = useProduct(productId);
  const { cart, addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  if (loading) return <LoadingState label="Loading product…" />;
  if (error) return <ErrorState message={error} />;
  if (!product) {
    return (
      <div id="not-found">
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 400, marginBottom: 12 }}>Product not found</h2>
        <p><Link to="/">← Back to home</Link></p>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const selectedSize = size ?? product.sizes[Math.min(2, product.sizes.length - 1)];
  const alreadyInBag = cart.items.some((item) => item.productId === product.id && item.size === selectedSize);
  const materialLabel = MOOD_MATERIAL[product.moodId as MoodId];

  const handleAddToCart = async () => {
    if (alreadyInBag) { navigate('/cart'); return; }
    if (adding || !selectedSize) return;
    setAdding(true);
    try { await addToCart(product, selectedSize, product.colors[colorIdx]?.name ?? null, qty); }
    finally { setAdding(false); }
  };

  return (
    <div id="view-product" className="mb-page-fade">
      <SimpleNavbar
        navId="pd-navbar"
        innerClassName="pd-nav-inner"
        backClassName="pd-nav-back"
        logoClassName="pd-nav-logo"
        rightClassName="pd-nav-actions"
        backLabel="Back"
        right={
          <>
            <button
              type="button"
              className="pd-nav-icon"
              aria-label="Wishlist"
              onClick={() => toggleWishlist(product)}
            >
              <HeartIcon filled={wishlisted} size={16} />
            </button>
            <button type="button" className="pd-nav-icon" aria-label="Cart" onClick={() => navigate('/cart')}>
              <BagIcon size={16} />
            </button>
          </>
        }
      />

      <div className="pd-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/mood/${product.moodId}`}>{capitalize(product.moodId)}</Link>
        <span>/</span>
        <span style={{ color: '#888' }}>{product.name}</span>
      </div>

      <div className="pd-body">
        <ProductGallery product={product} />

        <div className="pd-info">
          <div className="pd-info-brand">{product.brand}</div>
          <h1 className="pd-info-name">{product.name}</h1>

          <div className="pd-price-row">
            <span className="pd-price">{formatINR(product.price)}</span>
            {product.originalPrice && <span className="pd-was">{formatINR(product.originalPrice)}</span>}
            {product.originalPrice && (
              <span className="pd-off-badge">{Math.round((1 - product.price / product.originalPrice) * 100)}% off</span>
            )}
          </div>
          <div className="pd-tax">Inclusive of all taxes</div>

          <div className="pd-rating">
            <span className="pd-stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span className="pd-rating-score">{product.rating}</span>
            <span className="pd-rating-count">({product.reviewCount} reviews)</span>
          </div>

          {product.colors.length > 0 && (
            <>
              <span className="pd-sect-label">
                Colour — <span style={{ color: '#000', fontWeight: 600, letterSpacing: 0 }}>{product.colors[colorIdx].name}</span>
              </span>
              <div className="pd-colors">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    className={`pd-color${i === colorIdx ? ' active' : ''}`}
                    style={{ background: c.hex }}
                    aria-label={c.name}
                    onClick={() => setColorIdx(i)}
                  />
                ))}
              </div>
            </>
          )}

          <span className="pd-sect-label" style={{ marginTop: 16 }}>Size</span>
          <div className="pd-sizes">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={`pd-size${selectedSize === s ? ' active' : ''}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <button type="button" className="pd-size-guide">Size guide →</button>

          <div className="pd-qty-row">
            <span className="pd-qty-label">Qty</span>
            <div className="pd-qty-ctrl">
              <button type="button" className="pd-qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <div className="pd-qty-val">{qty}</div>
              <button type="button" className="pd-qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          </div>

          <div className="pd-cta">
            <button type="button" className="pd-btn-cart" disabled={adding || !selectedSize} onClick={() => void handleAddToCart()}>
              {adding ? 'Adding…' : alreadyInBag ? 'Go to bag' : 'Add to bag'}
            </button>
            <button type="button" className="pd-btn-wish" onClick={() => toggleWishlist(product)}>
              <span><HeartIcon size={14} filled={wishlisted} /></span> {wishlisted ? 'Saved' : 'Save to wishlist'}
            </button>
          </div>

          <div className="pd-delivery">
            <div className="pd-del-row"><span className="pd-del-icon">🚚</span> Free delivery on orders above ₹999</div>
            <div className="pd-del-row"><span className="pd-del-icon">↩</span> 30-day hassle-free returns</div>
            <div className="pd-del-row"><span className="pd-del-icon">🔒</span> Secure checkout · 256-bit SSL</div>
          </div>

          <ProductAccordion
            items={[
              { title: 'Product details', body: product.description },
              { title: 'Material & care', body: '100% sustainable fabric. Gentle machine wash. Do not bleach. Hang dry recommended. Iron on low heat.' },
              { title: 'Shipping & returns', body: 'Standard delivery 3–5 days. Express delivery 1–2 days. Free returns within 30 days. Items must be unworn with tags attached.' },
            ]}
          />

          <ProductReviewsSection productSlug={product.id} pageSize={3} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="pd-related">
          <div className="pd-related-head">
            <span className="pd-related-title">You might also like</span>
          </div>
          <div className="pd-related-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} materialLabel={materialLabel} />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
