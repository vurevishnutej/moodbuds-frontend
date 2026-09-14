import { useState, useEffect } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useToast } from '../../../app/providers/ToastProvider';

export function ProfileInfoPage() {
  const { customer } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Prefer not to say',
  });

  // Initialize form with customer data
  useEffect(() => {
    if (customer) {
      setForm({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: '',
        dob: '',
        gender: 'Prefer not to say',
      });
    }
  }, [customer]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated');
  };

  return (
    <div className="prof-panel active">
      <div className="prof-panel-head">
        <div className="prof-panel-title">Profile</div>
        <div className="prof-panel-sub">Manage your personal details</div>
      </div>
      <div className="prof-box">
        <div className="prof-box-head">Personal Information</div>
        <form className="prof-form" onSubmit={handleSave}>
          <div className="prof-form-row">
            <div className="prof-field">
              <label>First Name</label>
              <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div className="prof-field">
              <label>Last Name</label>
              <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div className="prof-field">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="prof-form-row">
            <div className="prof-field">
              <label>Mobile Number</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="prof-field">
              <label>Date of Birth</label>
              <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
            </div>
          </div>
          <div className="prof-field">
            <label>Gender</label>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option>Prefer not to say</option>
              <option>Male</option>
              <option>Female</option>
              <option>Non-binary</option>
            </select>
          </div>
          <button className="prof-save-btn" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
