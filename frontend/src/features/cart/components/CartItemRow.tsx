import type { CartItem } from '../../../types';
import { formatINR } from '../../../utils/format';

interface CartItemRowProps {
  item: CartItem;
  onQtyChange: (itemId: string, qty: number) => void;
  onRemove: (itemId: string) => void;
  onMoveToWishlist: (item: CartItem) => void;
}

export function CartItemRow({ item, onQtyChange, onRemove, onMoveToWishlist }: CartItemRowProps) {
  return (
    <div className="cart-item-row">
      <div className="cart-item-img">
        <img
          src={item.image || '/placeholder-product.jpg'}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
          }}
        />
      </div>
      <div>
        <div className="cart-item-brand">{item.brand}</div>
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-attrs">
          <span className="cart-item-attr">{item.size}</span>
          {item.color && <span className="cart-item-attr">{item.color}</span>}
        </div>
        <div className="cart-item-links">
          <button type="button" className="cart-item-link" onClick={() => onMoveToWishlist(item)}>
            Move to wishlist
          </button>
          <button type="button" className="cart-item-link" onClick={() => onRemove(item.id)}>
            Remove
          </button>
        </div>
      </div>
      <div className="cart-item-right">
        <div className="cart-item-price">{formatINR(item.price)}</div>
        {item.originalPrice && (
          <>
            <div className="cart-item-was">{formatINR(item.originalPrice)}</div>
            <div className="cart-item-save">Save {formatINR((item.originalPrice - item.price) * item.qty)}</div>
          </>
        )}
        <div className="cart-qty">
          <button
            type="button"
            className="cart-qty-btn"
            aria-label="Decrease quantity"
            onClick={() => onQtyChange(item.id, item.qty - 1)}
          >
            −
          </button>
          <span className="cart-qty-val">{item.qty}</span>
          <button
            type="button"
            className="cart-qty-btn"
            aria-label="Increase quantity"
            onClick={() => onQtyChange(item.id, item.qty + 1)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
