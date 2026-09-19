import { useState } from 'react';
import { uniqueId } from '../../../utils/format';
import type { Address } from '../../../types';

interface NewAddressModalProps {
  onAdd: (address: Address) => void;
  onClose: () => void;
}

export function NewAddressModal({ onAdd, onClose }: NewAddressModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    line: '',
    city: '',
    pincode: '',
    state: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.line.trim()) newErrors.line = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newAddress: Address = {
      id: uniqueId('addr'),
      name: formData.name,
      line: formData.line,
      phone: formData.phone,
      isDefault: false,
    };

    onAdd(newAddress);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content address-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Address</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="address-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Vishnu Reddy"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="line">Address</label>
            <input
              id="line"
              type="text"
              name="line"
              value={formData.line}
              onChange={handleChange}
              placeholder="Street address, house number, building"
              className={errors.line ? 'input-error' : ''}
            />
            {errors.line && <span className="error-message">{errors.line}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input
                id="pincode"
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                className={errors.pincode ? 'input-error' : ''}
              />
              {errors.pincode && <span className="error-message">{errors.pincode}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className={errors.city ? 'input-error' : ''}
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className={errors.state ? 'input-error' : ''}
            />
            {errors.state && <span className="error-message">{errors.state}</span>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
