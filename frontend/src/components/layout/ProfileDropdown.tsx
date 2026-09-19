import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../app/providers/ToastProvider';
import { useAuth } from '../../app/providers/AuthProvider';

function initialsOf(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useToast();
  const { customer, logout } = useAuth();
  const navigate = useNavigate();

  if (!customer) return null;
  const name = `${customer.firstName} ${customer.lastName}`.trim();
  const email = customer.email;

  const show = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }, []);

  return (
    <div className="nav-profile-wrap" onMouseEnter={show} onMouseLeave={hide}>
      <Link className="nav-action header-icon" to="/profile" aria-label="Profile">
        <span className="nav-action-ico">👤</span>
        <span className="nav-action-lbl">Profile</span>
      </Link>
      <div className={`profile-dropdown${open ? ' open' : ''}`}>
        <div className="pd-user-head">
          <div className="pd-avatar">{initialsOf(name)}</div>
          <div>
            <div className="pd-user-name">{name}</div>
            <div className="pd-user-email">{email}</div>
          </div>
        </div>
        <div className="pd-user-links">
          <Link className="pd-user-link" to="/profile">
            <span className="pd-user-link-ico">◎</span>
            <span className="pd-user-link-lbl">My Profile</span>
            <span className="pd-user-link-arrow">›</span>
          </Link>
          <Link className="pd-user-link" to="/profile/orders">
            <span className="pd-user-link-ico">◎</span>
            <span className="pd-user-link-lbl">My Orders</span>
            <span className="pd-user-link-arrow">›</span>
          </Link>
          <Link className="pd-user-link" to="/wishlist">
            <span className="pd-user-link-ico">♡</span>
            <span className="pd-user-link-lbl">Wishlist</span>
            <span className="pd-user-link-arrow">›</span>
          </Link>
          <Link className="pd-user-link" to="/profile/coupons">
            <span className="pd-user-link-ico">✦</span>
            <span className="pd-user-link-lbl">Coupons</span>
            <span className="pd-user-link-arrow">›</span>
          </Link>
          <div className="pd-user-logout">
            <button
              type="button"
              className="pd-user-link"
              onClick={async () => {
                try {
                  await logout();
                  navigate('/');
                } catch {
                  toast.error('Failed to sign out');
                }
              }}
            >
              <span className="pd-user-link-ico">→</span>
              <span className="pd-user-link-lbl">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
