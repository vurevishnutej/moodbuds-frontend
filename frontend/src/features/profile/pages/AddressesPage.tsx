import { useState } from 'react';
import { ADDRESSES } from '../../../data/profile';
import { useToast } from '../../../app/providers/ToastProvider';

export function AddressesPage() {
  const [addresses] = useState(ADDRESSES);
  const toast = useToast();

  return (
    <div className="prof-panel active">
      <div className="prof-panel-head">
        <div className="prof-panel-title">Addresses</div>
        <div className="prof-panel-sub">Manage your delivery addresses</div>
      </div>
      <div className="prof-box">
        <div className="addr-grid">
          {addresses.map((addr) => (
            <div className={`addr-card${addr.isDefault ? ' default' : ''}`} key={addr.id}>
              {addr.isDefault && <span className="addr-default-tag">Default</span>}
              <div className="addr-name">{addr.name}</div>
              <div className="addr-text">
                {addr.line}
                <br />
                {addr.phone}
              </div>
              <div className="addr-actions">
                <button type="button" className="addr-action-btn" onClick={() => toast.info('Edit address (demo)')}>Edit</button>
                {!addr.isDefault && (
                  <button type="button" className="addr-action-btn" onClick={() => toast.success('Set as default')}>
                    Set as default
                  </button>
                )}
                <button type="button" className="addr-action-btn" onClick={() => toast.info('Address removed')}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="addr-add-btn" style={{ marginTop: 4 }} onClick={() => toast.info('Add address (demo)')}>
          + Add new address
        </button>
      </div>
    </div>
  );
}
