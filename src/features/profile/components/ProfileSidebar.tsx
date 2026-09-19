import { NavLink, useNavigate } from 'react-router-dom';
import { useToast } from '../../../app/providers/ToastProvider';
import { useAuth } from '../../../app/providers/AuthProvider';

const NAV_ITEMS: { to: string; label: string; end?: boolean }[] = [
  { to: '/profile', label: 'Overview', end: true },
  { to: '/profile/orders', label: 'Orders' },
  { to: '/profile/wishlist', label: 'Wishlist' },
  { to: '/profile/addresses', label: 'Addresses' },
  { to: '/profile/coupons', label: 'Coupons' },
  { to: '/profile/info', label: 'Profile' },
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
    } catch {
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
        <button type="button" className="prof-nav-item prof-nav-logout" onClick={handleLogout}>
          <span>Sign Out</span>
          <span className="prof-nav-arrow">›</span>
        </button>
      </div>
    </aside>
  );
}
