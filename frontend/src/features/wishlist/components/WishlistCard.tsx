import { useEffect, useState } from 'react';
import type { WishlistItem } from '../../../types';
import { formatINR } from '../../../utils/format';
import { CloseIcon } from '../../../components/common/Icons';

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (id: string) => Promise<void>;
  onMoveToBag: (item: WishlistItem, size: string) => Promise<void>;
}

export function WishlistCard({ item, onRemove, onMoveToBag }: WishlistCardProps) {
  const [pickedSize, setPickedSize] = useState(item.sizes[0] ?? '');
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    if (!pickedSize || !item.sizes.includes(pickedSize)) setPickedSize(item.sizes[0] ?? '');
  }, [item.sizes, pickedSize]);

  const moveToBag = async () => {
    if (moving || !pickedSize) return;
    setMoving(true);
    try { await onMoveToBag(item, pickedSize); } finally { setMoving(false); }
  };

  return (
    <div className="wl-card">
      <div className="wl-card-media">
        {item.badge && <span className={`wl-badge${item.badge === 'Sale' ? ' low' : ''}`}>{item.badge}</span>}
        <img src={item.image} alt={item.name} loading="lazy" />
        <button type="button" className="wl-remove" aria-label="Remove from wishlist" onClick={() => onRemove(item.id)}>
          <CloseIcon />
        </button>
        <button type="button" className="wl-add-bar" disabled={moving || !pickedSize} onClick={() => void moveToBag()}>
          {moving ? 'Moving…' : pickedSize ? 'Move to bag' : 'Select a size'}
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
