import { useState } from 'react';
import type { AddressDraft, CustomerAddress } from '../../profile/services/profileService';
import styles from './AddressModal.module.css';

const EMPTY_ADDRESS: AddressDraft = {
  fullName: '',
  mobile: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  addressType: 'HOME',
  defaultAddress: false,
};

interface AddressModalProps {
  address?: CustomerAddress | null;
  saving: boolean;
  onSave: (draft: AddressDraft) => Promise<void>;
  onClose: () => void;
}

export function AddressModal({ address, saving, onSave, onClose }: AddressModalProps) {
  const [draft, setDraft] = useState<AddressDraft>(() => address ? {
    fullName: address.fullName,
    mobile: address.mobile,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 ?? '',
    city: address.city,
    state: address.state,
    country: address.country,
    pincode: address.pincode,
    addressType: address.addressType,
    defaultAddress: address.defaultAddress,
  } : EMPTY_ADDRESS);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave({ ...draft, mobile: draft.mobile.replace(/[\s()-]/g, '') });
  };

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-address-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="checkout-address-title">{address ? 'Edit delivery address' : 'Add a delivery address'}</h2>
          <button type="button" onClick={onClose} aria-label="Close address form">×</button>
        </div>
        <form className={styles.form} onSubmit={(event) => void submit(event)}>
          <label>Full name<input required maxLength={120} value={draft.fullName} onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} /></label>
          <label>Mobile number<input required inputMode="tel" minLength={10} maxLength={20} value={draft.mobile} onChange={(event) => setDraft({ ...draft, mobile: event.target.value })} /></label>
          <label className={styles.full}>Address line 1<input required maxLength={255} value={draft.addressLine1} onChange={(event) => setDraft({ ...draft, addressLine1: event.target.value })} /></label>
          <label className={styles.full}>Address line 2 <span>(optional)</span><input maxLength={255} value={draft.addressLine2 ?? ''} onChange={(event) => setDraft({ ...draft, addressLine2: event.target.value })} /></label>
          <label>City<input required maxLength={100} value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} /></label>
          <label>State<input required maxLength={100} value={draft.state} onChange={(event) => setDraft({ ...draft, state: event.target.value })} /></label>
          <label>PIN code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={draft.pincode} onChange={(event) => setDraft({ ...draft, pincode: event.target.value.replace(/\D/g, '') })} /></label>
          <label>Country<input required maxLength={100} value={draft.country} onChange={(event) => setDraft({ ...draft, country: event.target.value })} /></label>
          <fieldset className={styles.full}>
            <legend>Address type</legend>
            <div className={styles.types}>
              {(['HOME', 'WORK', 'OTHER'] as const).map((type) => (
                <button key={type} type="button" className={draft.addressType === type ? styles.activeType : ''} onClick={() => setDraft({ ...draft, addressType: type })}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </fieldset>
          <label className={`${styles.full} ${styles.checkbox}`}>
            <input type="checkbox" checked={draft.defaultAddress} onChange={(event) => setDraft({ ...draft, defaultAddress: event.target.checked })} />
            Make this my default address
          </label>
          <div className={`${styles.full} ${styles.actions}`}>
            <button type="button" className={styles.cancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.save} disabled={saving}>{saving ? 'Saving…' : 'Save address'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
