import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MobileNavbar } from '../../../components/layout/MobileNavbar';
import { MobileFooter } from '../../../components/layout/MobileFooter';
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
  const [imageIdx, setImageIdx] = useState(0);

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
<div className="mb-mobile-shell">
        <MobileNavbar />
        <div style={{ paddingBottom: '16px' }}>
          {/* Product Image Carousel */}
          <div style={{ position: 'relative', width: '100%', backgroundColor: '#f5f5f5' }}>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            )}

            {/* Image Dots Indicator */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
              zIndex: 10,
            }}>
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageIdx(i)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    border: 'none',
                    background: imageIdx === i ? '#8b3a52' : 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s ease',
                  }}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div style={{ padding: '16px' }}>
            {/* Brand and Name */}
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              {product.brand}
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 400, marginBottom: '8px', lineHeight: 1.2, fontFamily: "'Playfair Display',serif" }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#000', marginRight: '8px' }}>
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through', marginRight: '8px' }}>
                  {formatINR(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span style={{ fontSize: '12px', color: '#8b3a52', fontWeight: 600 }}>
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                </span>
              )}
            </div>

            {/* Rating */}
            {product.rating > 0 && (
              <div style={{ marginBottom: '16px', fontSize: '13px' }}>
                <span style={{ color: '#ffc107', marginRight: '4px' }}>
                  {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
                </span>
                <span style={{ color: '#666' }}>({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                  Colour — {product.colors[colorIdx].name}
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.colors.map((c, i) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColorIdx(i)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '4px',
                        background: c.hex,
                        border: i === colorIdx ? '2px solid #8b3a52' : '1px solid #ddd',
                        cursor: 'pointer',
                      }}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                Size
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      background: selectedSize === s ? '#8b3a52' : '#fff',
                      color: selectedSize === s ? '#fff' : '#111',
                      border: selectedSize === s ? 'none' : '1px solid #ddd',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: '13px',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Qty</label>
              <div style={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{
                    width: '32px',
                    height: '32px',
                    border: 'none',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  −
                </button>
                <div style={{ width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 500 }}>
                  {qty}
                </div>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    border: 'none',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={() => void handleAddToCart()}
              disabled={adding || !selectedSize}
              style={{
                width: '100%',
                padding: '12px',
                background: '#8b3a52',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                marginBottom: '8px',
                opacity: adding || !selectedSize ? 0.5 : 1,
              }}
            >
              {adding ? 'Adding…' : alreadyInBag ? 'Go to bag' : 'Add to bag'}
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#fff',
                color: '#8b3a52',
                border: '1.5px solid #8b3a52',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {wishlisted ? '♥ Saved' : '♡ Save to wishlist'}
            </button>

            {/* Delivery Info */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0', fontSize: '12px', color: '#666' }}>
              <div style={{ marginBottom: '8px' }}>🚚 Free delivery on orders above ₹999</div>
              <div style={{ marginBottom: '8px' }}>↩ 30-day hassle-free returns</div>
              <div>🔒 Secure checkout</div>
            </div>
          </div>
        </div>
        <MobileFooter />
      </div>

      <div className="mb-desktop-only">
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
        <div className="pd-left">
          <ProductGallery product={product} />
          <ProductReviewsSection productSlug={product.id} pageSize={3} />
        </div>

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
    </div>
  );
}
