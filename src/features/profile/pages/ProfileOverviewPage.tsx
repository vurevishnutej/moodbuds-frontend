import { Link } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { HeartIcon, LocationIcon, PackageIcon, TicketIcon, UserIcon } from '../../../components/common/Icons';

const TILES = [
  { to: '/profile/orders', name: 'Orders', desc: 'Track and manage your purchases', icon: PackageIcon, tone: 'orders' },
  { to: '/profile/wishlist', name: 'Wishlist', desc: 'Save items for later and quick access', icon: HeartIcon, tone: 'wishlist' },
  { to: '/profile/coupons', name: 'Coupons', desc: 'View available offers and discounts', icon: TicketIcon, tone: 'coupons' },
  { to: '/profile/addresses', name: 'Addresses', desc: 'Manage saved delivery addresses', icon: LocationIcon, tone: 'addresses' },
  { to: '/profile/info', name: 'Profile', desc: 'Update your personal information', icon: UserIcon, tone: 'profile' },
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
        </div>
      </div>

      <div className="prof-tiles">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link key={tile.to} className="prof-tile" to={tile.to}>
              <div className={`prof-tile-ico ${tile.tone}`} aria-hidden="true"><Icon size={22} /></div>
              <div className="prof-tile-name">{tile.name}</div>
              <div className="prof-tile-desc">{tile.desc}</div>
              <div className="prof-tile-arrow">›</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
