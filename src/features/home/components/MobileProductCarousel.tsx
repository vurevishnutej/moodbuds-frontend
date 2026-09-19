import { Link } from 'react-router-dom';
import type { Product } from '../../../types';
import { formatINR } from '../../../utils/format';

interface MobileProductCarouselProps {
  title: string;
  emphasis: string;
  products: Product[];
  seeAllTo?: string;
}

export function MobileProductCarousel({ title, emphasis, products, seeAllTo }: MobileProductCarouselProps) {
  if (products.length === 0) return null;

  return (
    <div>
      <div className="mmb-section-head">
        <span className="mmb-section-title">
          {title} <em>{emphasis}</em>
        </span>
        {seeAllTo && <Link className="mmb-section-see" to={seeAllTo}>See all</Link>}
      </div>
      <div className="mmb-prod-scroll">
        {products.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="mmb-prod-card">
            <div className="mmb-prod-card-img" style={{ backgroundImage: `url(${p.image})` }}>
              {p.badge && <span className={`mmb-prod-badge ${p.badge.toLowerCase()}`}>{p.badge}</span>}
            </div>
            <div className="mmb-prod-card-brand">{p.brand}</div>
            <div className="mmb-prod-card-name">{p.name}</div>
            <div className="mmb-prod-card-price">
              <strong>{formatINR(p.price)}</strong>
              {p.originalPrice && <s>{formatINR(p.originalPrice)}</s>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
