import { useState } from 'react';
import { uniqueId } from '../../../utils/format';
import type { Address } from '../../../types';
import styles from './NewAddressModal.module.css';

interface NewAddressModalProps {
  onAdd: (address: Address) => void;
  onClose: () => void;
}

export function NewAddressModal({ onAdd, onClose }: NewAddressModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '',
    city: '',
    state: '',
    line1: '', // Flat/House
    line2: '', // Area/Street
    landmark: '',
    addressType: 'Home',
    isDefault: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Please enter a name';
    if (!formData.phone.trim()) newErrors.phone = 'Enter a valid 10-digit number';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit number';
    if (!formData.pincode.trim()) newErrors.pincode = 'Enter a valid 6-digit pincode';
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter a valid 6-digit pincode';
    if (!formData.city.trim()) newErrors.city = 'Please enter a city';
    if (!formData.state.trim()) newErrors.state = 'Please enter a state';
    if (!formData.line1.trim()) newErrors.line1 = 'Please enter your house / building';
    if (!formData.line2.trim()) newErrors.line2 = 'Please enter your area / locality';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddressTypeChange = (type: string) => {
    setFormData((prev) => ({ ...prev, addressType: type }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const fullAddress = `${formData.line1}, ${formData.line2}${formData.landmark ? `, ${formData.landmark}` : ''}`;

    const newAddress: Address = {
      id: uniqueId('addr'),
      name: formData.name,
      line: fullAddress,
      phone: formData.phone,
      isDefault: formData.isDefault,
    };

    onAdd(newAddress);
  };

  return (
    <div className={styles.amOverlay} onClick={onClose}>
      <div className={styles.amModal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.amHead}>
          <span className={styles.amTitle} id="am-title">Add a new address</span>
          <button className={styles.amClose} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Scrollable Content */}
        <div className={styles.amScroll}>
          {/* Map Section */}
          <div className={styles.amMapWrap}>
            <div className={styles.amMapFallback}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <span>Map preview unavailable — enter your address below.</span>
            </div>
            <button className={styles.amLocbtn} type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
              </svg>
              Use my current location
            </button>
          </div>

          <div className={styles.amLocNote}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            Drag the pin or tap the map to set your exact location.
          </div>

          {/* Form */}
          <form className={styles.amForm} onSubmit={handleSubmit}>
            {/* Name & Phone */}
            <div className={styles.amField}>
              <label className={styles.amLabel}>Full name</label>
              <input
                className={`${styles.amInput}${errors.name ? ` ${styles.amErr}` : ''}`}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Vishnu Reddy"
              />
              {errors.name && <span className={styles.amErrMsg}>{errors.name}</span>}
            </div>

            <div className={styles.amField}>
              <label className={styles.amLabel}>Phone number</label>
              <input
                className={`${styles.amInput}${errors.phone ? ` ${styles.amErr}` : ''}`}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit mobile number"
              />
              {errors.phone && <span className={styles.amErrMsg}>{errors.phone}</span>}
            </div>

            {/* Pincode & City */}
            <div className={styles.amField}>
              <label className={styles.amLabel}>Pincode</label>
              <input
                className={`${styles.amInput}${errors.pincode ? ` ${styles.amErr}` : ''}`}
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit pincode"
              />
              {errors.pincode && <span className={styles.amErrMsg}>{errors.pincode}</span>}
            </div>

            <div className={styles.amField}>
              <label className={styles.amLabel}>City</label>
              <input
                className={`${styles.amInput}${errors.city ? ` ${styles.amErr}` : ''}`}
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
              {errors.city && <span className={styles.amErrMsg}>{errors.city}</span>}
            </div>

            {/* State (Full Width) */}
            <div className={`${styles.amField} ${styles.amFieldFull}`}>
              <label className={styles.amLabel}>State</label>
              <input
                className={`${styles.amInput}${errors.state ? ` ${styles.amErr}` : ''}`}
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
              />
              {errors.state && <span className={styles.amErrMsg}>{errors.state}</span>}
            </div>

            {/* Address Lines (Full Width) */}
            <div className={`${styles.amField} ${styles.amFieldFull}`}>
              <label className={styles.amLabel}>Flat / House no. / Building</label>
              <input
                className={`${styles.amInput}${errors.line1 ? ` ${styles.amErr}` : ''}`}
                type="text"
                name="line1"
                value={formData.line1}
                onChange={handleChange}
                placeholder="Flat, house no., building, company"
              />
              {errors.line1 && <span className={styles.amErrMsg}>{errors.line1}</span>}
            </div>

            <div className={`${styles.amField} ${styles.amFieldFull}`}>
              <label className={styles.amLabel}>Area / Street / Locality</label>
              <input
                className={`${styles.amInput}${errors.line2 ? ` ${styles.amErr}` : ''}`}
                type="text"
                name="line2"
                value={formData.line2}
                onChange={handleChange}
                placeholder="Area, street, sector, village"
              />
              {errors.line2 && <span className={styles.amErrMsg}>{errors.line2}</span>}
            </div>

            <div className={`${styles.amField} ${styles.amFieldFull}`}>
              <label className={styles.amLabel}>Landmark <span className={styles.amOpt}>(optional)</span></label>
              <input
                className={styles.amInput}
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Nearby landmark"
              />
            </div>

            {/* Address Type */}
            <div className={`${styles.amField} ${styles.amFieldFull}`}>
              <label className={styles.amLabel}>Address type</label>
              <div className={styles.amTypes}>
                {['Home', 'Work', 'Other'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`${styles.amType}${formData.addressType === type ? ` ${styles.amTypeActive}` : ''}`}
                    onClick={() => handleAddressTypeChange(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Checkbox */}
            <label className={`${styles.amField} ${styles.amFieldFull} ${styles.amCheck}`}>
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              <span>Make this my default address</span>
            </label>
          </form>
        </div>

        {/* Footer */}
        <div className={styles.amFoot}>
          <button type="button" className={`${styles.amBtn} ${styles.amBtnGhost}`} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={`${styles.amBtn} ${styles.amBtnSolid}`} onClick={handleSubmit}>
            Save address
          </button>
        </div>
      </div>
    </div>
  );
}
