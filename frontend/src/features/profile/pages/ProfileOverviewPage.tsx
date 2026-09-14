import { Link } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { formatINR } from '../../../utils/format';

const TILES = [
  { to: '/profile/orders', name: 'Orders', desc: 'Track and manage your purchases' },
  { to: '/wishlist', name: 'Wishlist', desc: 'Save items for later and quick access' },
  { to: '/profile/coupons', name: 'Coupons', desc: 'View available offers and discounts' },
  { to: '/profile/addresses', name: 'Addresses', desc: 'Manage saved delivery addresses' },
  { to: '/profile/info', name: 'Profile', desc: 'Update your personal information' },
  { to: '/profile/contact', name: 'Contact Us', desc: 'Get help from our support team' },
];

// Demo membership data (can be replaced with real data from API)
const DEMO_SPENT = 4297;
const DEMO_TIER_AT = 5000;

export function ProfileOverviewPage() {
  const { customer } = useAuth();
  const name = customer
    ? `${customer.firstName} ${customer.lastName}`
    : 'User';
  const remaining = Math.max(0, DEMO_TIER_AT - DEMO_SPENT);
  const pct = Math.min(100, (DEMO_SPENT / DEMO_TIER_AT) * 100);

  return (
    <div className="prof-panel active">
      <div className="prof-membership-card">
        <div className="prof-mc-top">
          <div>
            <div className="prof-mc-welcome">Welcome back,</div>
            <div className="prof-mc-name">{name}</div>
          </div>
          <div className="prof-mc-badge">
            <div className="prof-mc-badge-name">MoodBuds</div>
            <div className="prof-mc-badge-tier">Member</div>
          </div>
        </div>
        <div className="prof-mc-perks">
          <div className="prof-mc-perk"><span className="prof-mc-perk-ico">✦</span> Exclusive mood drops before anyone else</div>
          <div className="prof-mc-perk"><span className="prof-mc-perk-ico">↩</span> Free returns on every order</div>
          <div className="prof-mc-perk"><span className="prof-mc-perk-ico">◎</span> Win rewards for order streaks</div>
        </div>
        <div className="prof-mc-progress-label">
          <span>{formatINR(DEMO_SPENT)} spent</span>
          <span>Shop {formatINR(remaining)} more to unlock Elite →</span>
        </div>
        <div className="prof-mc-bar"><div className="prof-mc-bar-fill" style={{ width: `${pct}%` }} /></div>
        <div className="prof-mc-bar-ends"><span>₹0</span><span>{formatINR(DEMO_TIER_AT)}</span></div>
      </div>

      <div className="prof-tiles">
        {TILES.map((tile) => (
          <Link key={tile.to} className="prof-tile" to={tile.to}>
            <div className="prof-tile-ico">◎</div>
            <div className="prof-tile-name">{tile.name}</div>
            <div className="prof-tile-desc">{tile.desc}</div>
            <div className="prof-tile-arrow">›</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
