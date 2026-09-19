import { Link } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';

const TILES = [
  { to: '/profile/orders', name: 'Orders', desc: 'Track and manage your purchases' },
  { to: '/wishlist', name: 'Wishlist', desc: 'Save items for later and quick access' },
  { to: '/profile/coupons', name: 'Coupons', desc: 'View available offers and discounts' },
  { to: '/profile/addresses', name: 'Addresses', desc: 'Manage saved delivery addresses' },
  { to: '/profile/info', name: 'Profile', desc: 'Update your personal information' },
  { to: '/profile/contact', name: 'Contact Us', desc: 'Get help from our support team' },
];

export function ProfileOverviewPage() {
  const { customer } = useAuth();
  const name = customer
    ? `${customer.firstName} ${customer.lastName}`
    : 'User';

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
        <div className="prof-mc-progress-label"><span>Your account details and purchases are synced with MoodBuds.</span></div>
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
