import type { Product } from '../../../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../../../components/common/States';

interface ProductGridProps {
  products: Product[];
  materialLabel: string;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, materialLabel, columns = 4 }: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState title="No products match your filters" subtitle="Try adjusting or clearing your filters." />;
  }

  return (
    <div id="products" className={`cols-${columns}`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} materialLabel={materialLabel} priority={i < 6} />
      ))}
    </div>
  );
}
