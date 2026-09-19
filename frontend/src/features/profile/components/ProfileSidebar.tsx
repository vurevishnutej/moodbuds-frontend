import { NavLink, useNavigate } from 'react-router-dom';
import { useToast } from '../../../app/providers/ToastProvider';
import { useAuth } from '../../../app/providers/AuthProvider';

const NAV_ITEMS: { to: string; label: string; end?: boolean }[] = [
  { to: '/profile', label: 'Overview', end: true },
  { to: '/profile/info', label: 'Profile' },
];
const NAV_ITEMS_2: { to: string; label: string }[] = [
  { to: '/profile/orders', label: 'Orders' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/profile/addresses', label: 'Addresses' },
];
const NAV_ITEMS_3: { to: string; label: string }[] = [
  { to: '/profile/coupons', label: 'Coupons' },
  { to: '/profile/contact', label: 'Contact Us' },
];

export function ProfileSidebar() {
  const toast = useToast();
  const navigate = useNavigate();
  const { customer, logout } = useAuth();
  const name = customer
    ? `${customer.firstName} ${customer.lastName}`
    : 'Loading...';

  const itemClass = ({ isActive }: { isActive: boolean }) => `prof-nav-item${isActive ? ' active' : ''}`;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <aside className="prof-sidebar">
      <div className="prof-side-user">
        <div className="prof-side-hello">Hello,</div>
        <div className="prof-side-name">{name}</div>
        <div className="prof-side-email">{customer?.email || 'Loading...'}</div>
      </div>
      <div className="prof-side-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={itemClass}>
            <span>{item.label}</span>
            <span className="prof-nav-arrow">›</span>
          </NavLink>
        ))}
        <div className="prof-nav-divider" />
        {NAV_ITEMS_2.map((item) => (
          <NavLink key={item.to} to={item.to} className={itemClass}>
            <span>{item.label}</span>
            <span className="prof-nav-arrow">›</span>
          </NavLink>
        ))}
        <div className="prof-nav-divider" />
        {NAV_ITEMS_3.map((item) => (
          <NavLink key={item.to} to={item.to} className={itemClass}>
            <span>{item.label}</span>
            <span className="prof-nav-arrow">›</span>
          </NavLink>
        ))}
        <div className="prof-nav-divider" />
        <NavLink to="/profile/admin" className={({ isActive }) => `prof-nav-item prof-nav-admin${isActive ? ' active' : ''}`}>
          <span>Admin Panel</span>
          <span className="prof-admin-tag">Admin</span>
          <span className="prof-nav-arrow">›</span>
        </NavLink>
        <div className="prof-nav-divider" />
        <button type="button" className="prof-nav-item prof-nav-logout" onClick={handleLogout}>
          <span>Sign Out</span>
          <span className="prof-nav-arrow">›</span>
        </button>
      </div>
    </aside>
  );
}
