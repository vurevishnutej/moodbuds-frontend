import type { Order, Address, Coupon, UserProfile } from '../types';

export const USER_PROFILE: UserProfile = {
  firstName: 'Vishnu',
  lastName: 'Reddy',
  email: 'vishnutej@moodbuds.com',
  phone: '+91 98765 43210',
  dob: '1998-06-15',
  gender: 'Male',
  totalSpent: 4297,
  nextTierAt: 5000,
};

export const ORDERS: Order[] = [
  {
    id: '#MBD-240619-001',
    date: '19 Jun 2026',
    status: 'Delivered',
    moodLabel: 'Romantic mood',
    size: 'M',
    color: 'Blush',
    total: 3898,
    items: [
      { name: 'Satin Slip Dress', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=100&h=130&q=80' },
      { name: 'Lace Trim Blouse', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=100&h=130&q=80' },
    ],
  },
  {
    id: '#MBD-240612-002',
    date: '12 Jun 2026',
    status: 'Shipped',
    moodLabel: 'Confident mood',
    size: 'M',
    total: 3499,
    items: [
      { name: 'Structured Blazer', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=100&h=130&q=80' },
    ],
  },
  {
    id: '#MBD-240601-003',
    date: '01 Jun 2026',
    status: 'Processing',
    moodLabel: 'Energetic mood',
    size: 'L',
    total: 899,
    items: [
      { name: 'Performance Running Tee', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=100&h=130&q=80' },
    ],
  },
];

export const ADDRESSES: Address[] = [
  { id: 'addr-1', name: 'Gautham', line: '42, Jubilee Hills Road No. 36, Hyderabad, Telangana 500033', phone: '+91 98765 43210', isDefault: true },
  { id: 'addr-2', name: 'Office', line: 'Level 4, Skyview 10 Tower, Hitech City, Hyderabad 500081', phone: '+91 98765 43210', isDefault: false },
];

export const COUPONS: Coupon[] = [
  { code: 'MOOD300', badge: 'Welcome Offer', description: '₹300 off on your first order above ₹1,499.', validity: 'Valid till 31 Dec 2026', variant: 'default' },
  { code: 'ROMANTIC20', badge: 'Mood Special', description: '20% off on Romantic mood collection.', validity: 'Valid till 30 Jun 2026', variant: 'pink' },
  { code: 'VIP500', badge: 'Loyalty Reward', description: '₹500 off for members with 3+ orders.', validity: 'Valid till 31 Aug 2026', variant: 'gold' },
];
