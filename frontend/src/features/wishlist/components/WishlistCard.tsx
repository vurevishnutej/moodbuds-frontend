import { useState } from 'react';
import type { WishlistItem } from '../../../types';
import { formatINR } from '../../../utils/format';
import { CloseIcon } from '../../../components/common/Icons';

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (id: string) => void;
  onMoveToBag: (item: WishlistItem, size: string) => void;
}

export function WishlistCard({ item, onRemove, onMoveToBag }: WishlistCardProps) {
  const [pickedSize, setPickedSize] = useState(item.sizes[0] ?? '');

  return (
    <div className="wl-card">
      <div className="wl-card-media">
        {item.badge && <span className={`wl-badge${item.badge === 'Sale' ? ' low' : ''}`}>{item.badge}</span>}
        <img src={item.image} alt={item.name} loading="lazy" />
        <button type="button" className="wl-remove" aria-label="Remove from wishlist" onClick={() => onRemove(item.id)}>
          <CloseIcon />
        </button>
        <button type="button" className="wl-add-bar" onClick={() => onMoveToBag(item, pickedSize)}>
          Move to bag
        </button>
      </div>
      <div className="wl-card-info">
        <div className="wl-card-brand">{item.brand}</div>
        <div className="wl-card-name">{item.name}</div>
        <div className="wl-card-price-row">
          <span className="wl-card-price">{formatINR(item.price)}</span>
          {item.originalPrice && (
            <>
              <span className="wl-card-was">{formatINR(item.originalPrice)}</span>
              <span className="wl-card-save">Save {formatINR(item.originalPrice - item.price)}</span>
            </>
          )}
        </div>
        <div className="wl-sizes">
          {item.sizes.map((s) => (
            <button
              key={s}
              type="button"
              className={`wl-size${s === pickedSize ? ' picked' : ''}`}
              onClick={() => setPickedSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
