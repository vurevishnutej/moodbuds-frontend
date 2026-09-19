import type { Address } from '../../../types';

interface AddressSelectionModalProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddNew: () => void;
  onClose: () => void;
}

export function AddressSelectionModal({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  onClose,
}: AddressSelectionModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Select Delivery Address</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="address-list">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`address-card${selectedId === addr.id ? ' selected' : ''}`}
                onClick={() => onSelect(addr.id)}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedId === addr.id}
                  onChange={() => onSelect(addr.id)}
                />
                <div className="address-info">
                  <div className="address-name">{addr.name}</div>
                  <div className="address-line">{addr.line}</div>
                  <div className="address-phone">{addr.phone}</div>
                </div>
                {addr.isDefault && <span className="tag-default">DEFAULT</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onAddNew();
              onClose();
            }}
          >
            Add New Address
          </button>
        </div>
      </div>
    </div>
  );
}
