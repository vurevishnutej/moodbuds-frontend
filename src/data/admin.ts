export interface AdminMood {
  id: string;
  emoji: string;
  name: string;
  tag: string;
  color: string;
  productCount: number;
  active: boolean;
}

export interface AdminProduct {
  id?: number;
  sku: string;
  name: string;
  brand: string;
  mood: string;
  price: number;
  stock: number;
  status: 'Active' | 'Out of stock' | 'Low stock' | 'Draft';
  image: string;
  mrp?: number;
  description?: string;
  category?: string;
  subcategory?: string;
  sizes?: string[];
  sizeStocks?: Array<{ size: string; stockQuantity: number; lowStockThreshold: number; available: boolean }>;
  images?: Array<{ mediaId: number | null; productImageId?: number; url: string }>;
  categoryId?: number | string;
  subcategoryId?: number | string;
  gstRateId?: number | string;
  colorName?: string;
  moodIds?: (number | string)[];
  returnWindowDays?: number;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  products: number;
  subcategoryCount: number;
  status: 'Active' | 'Draft';
}

export interface AdminSubcategory {
  id: string;
  parentId: string;
  parent: string;
  name: string;
  slug: string;
  image: string;
  products: number;
  status: 'Active' | 'Draft';
}

export function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export interface AdminOrder {
  id: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  payment: 'Paid' | 'COD' | 'Refunded';
  status: 'New' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  mood: string;
}

export const ADMIN_MOODS: AdminMood[] = [
  { id: 'happy', emoji: '😊', name: 'Happy', tag: 'sunshine in everything.', color: '#FFD93D', productCount: 42, active: true },
  { id: 'confident', emoji: '🦁', name: 'Confident', tag: 'dressed like you won.', color: '#f0d060', productCount: 38, active: true },
  { id: 'cool', emoji: '😎', name: 'Cool', tag: 'effortless. always.', color: '#7EB8F0', productCount: 51, active: true },
  { id: 'professional', emoji: '💼', name: 'Professional', tag: 'sharp. refined. ready.', color: '#cbb27a', productCount: 33, active: true },
  { id: 'party', emoji: '🎉', name: 'Party', tag: 'tonight deserves this.', color: '#D070F0', productCount: 47, active: true },
  { id: 'energetic', emoji: '⚡', name: 'Energetic', tag: 'move louder, feel brighter.', color: '#FF8040', productCount: 29, active: false },
  { id: 'romantic', emoji: '🌹', name: 'Romantic', tag: 'soft evenings, slow hearts.', color: '#F0A0B0', productCount: 44, active: true },
  { id: 'calm', emoji: '🌊', name: 'Calm', tag: 'stillness is a style.', color: '#70C0D0', productCount: 36, active: true },
  { id: 'minimal', emoji: '🖤', name: 'Minimal', tag: 'quiet confidence.', color: '#AAAAAA', productCount: 40, active: true },
];

const THUMB_IMAGES = [
  '1594938298603-c8148c4dae35', '1515886657613-9f3515b0c78f', '1596755094514-f87e34085b2c',
  '1544022613-e87ca75a784a', '1566174053879-31528523f8ae', '1542291026-7eec264c27ff',
  '1539533018447-63fcce2678e3', '1503342217505-b0a15ec3261c',
].map((s) => `https://images.unsplash.com/photo-${s}?auto=format&fit=crop&w=120&h=160&q=70`);

export function adminThumb(i: number): string {
  return THUMB_IMAGES[i % THUMB_IMAGES.length];
}

export const ADMIN_ORDERS: AdminOrder[] = [
  { id: 'MBD-100482', customer: 'Gautham', date: '28 Jun 2026', items: 3, total: 7997, payment: 'Paid', status: 'New', mood: 'professional' },
  { id: 'MBD-100481', customer: 'Vishnu Tej', date: '28 Jun 2026', items: 1, total: 2499, payment: 'Paid', status: 'Processing', mood: 'romantic' },
  { id: 'MBD-100480', customer: 'Kishore', date: '27 Jun 2026', items: 2, total: 5798, payment: 'COD', status: 'Shipped', mood: 'cool' },
  { id: 'MBD-100479', customer: 'Mahesh', date: '27 Jun 2026', items: 4, total: 11296, payment: 'Paid', status: 'Delivered', mood: 'party' },
  { id: 'MBD-100478', customer: 'Gautham', date: '26 Jun 2026', items: 1, total: 999, payment: 'Paid', status: 'Delivered', mood: 'happy' },
  { id: 'MBD-100477', customer: 'Vishnu Tej', date: '26 Jun 2026', items: 2, total: 3998, payment: 'Refunded', status: 'Cancelled', mood: 'calm' },
  { id: 'MBD-100476', customer: 'Kishore', date: '25 Jun 2026', items: 1, total: 5299, payment: 'Paid', status: 'Shipped', mood: 'confident' },
];

export const ADMIN_CATEGORIES = [
  { name: 'Dresses', products: 64, status: 'Active' },
  { name: 'Outerwear', products: 48, status: 'Active' },
  { name: 'Tops', products: 72, status: 'Active' },
  { name: 'Bottoms', products: 39, status: 'Active' },
  { name: 'Footwear', products: 41, status: 'Active' },
  { name: 'Accessories', products: 48, status: 'Active' },
  { name: 'Loungewear', products: 22, status: 'Draft' },
];

export const ADMIN_SUBCATEGORIES = [
  { parent: 'Dresses', name: 'Slip Dresses', products: 18 },
  { parent: 'Dresses', name: 'Mini Dresses', products: 22 },
  { parent: 'Dresses', name: 'Midi Dresses', products: 24 },
  { parent: 'Outerwear', name: 'Blazers', products: 16 },
  { parent: 'Outerwear', name: 'Trench Coats', products: 12 },
  { parent: 'Footwear', name: 'Sneakers', products: 20 },
  { parent: 'Accessories', name: 'Earrings', products: 14 },
];

export const ADMIN_COUPONS = [
  { code: 'MOOD300', desc: '₹300 off on first order above ₹1,499', type: 'Welcome', uses: 312, validTill: '31 Dec 2026', status: 'Active' },
  { code: 'ROMANTIC20', desc: '20% off Romantic collection', type: 'Mood', uses: 88, validTill: '30 Jun 2026', status: 'Active' },
  { code: 'VIP500', desc: '₹500 off for 3+ order members', type: 'Loyalty', uses: 47, validTill: '31 Aug 2026', status: 'Active' },
  { code: 'FLASH10', desc: '10% off everything — flash sale', type: 'Flash', uses: 0, validTill: 'Expired', status: 'Expired' },
];

export const ADMIN_QUIZ_QUESTIONS = [
  { question: 'What\u2019s your vibe today?', options: 4, mapsTo: 'Cool' },
  { question: 'Pick a place you\u2019d rather be', options: 4, mapsTo: 'Calm' },
  { question: 'Choose a colour that calls you', options: 6, mapsTo: 'Romantic' },
  { question: 'Your weekend looks like\u2026', options: 4, mapsTo: 'Party' },
];

export const ADMIN_BANNERS = [
  { title: 'Sunshine Edit — New Collection', mood: 'happy', status: 'Active', placement: 'Hero slide 1' },
  { title: 'Up To 40% Off — Confident', mood: 'confident', status: 'Active', placement: 'Hero slide 2' },
  { title: 'Party Season Drop', mood: 'party', status: 'Scheduled', placement: 'Starts 1 Jul' },
  { title: 'Monsoon Calm Edit', mood: 'calm', status: 'Draft', placement: '—' },
];

export const ADMIN_RETURNS = [
  { id: 'RET-2041', order: 'MBD-100479', item: 'Sequin Mini Dress', reason: 'Size too small', status: 'Pending' },
  { id: 'RET-2040', order: 'MBD-100476', item: 'Power Shoulder Coat', reason: 'Changed mind', status: 'Approved' },
  { id: 'RET-2039', order: 'MBD-100471', item: 'Satin Slip Dress', reason: 'Defective item', status: 'Pending' },
  { id: 'RET-2038', order: 'MBD-100468', item: 'Running Shoes', reason: 'Wrong item sent', status: 'Rejected' },
];

export const ADMIN_REFUNDS = [
  { id: 'RFD-881', order: 'MBD-100477', customer: 'Vishnu Tej', amount: 3998, method: 'UPI', status: 'Pending' },
  { id: 'RFD-880', order: 'MBD-100469', customer: 'Mahesh', amount: 2499, method: 'Card', status: 'Approved' },
  { id: 'RFD-879', order: 'MBD-100461', customer: 'Kishore', amount: 999, method: 'Wallet', status: 'Approved' },
  { id: 'RFD-878', order: 'MBD-100455', customer: 'Gautham', amount: 5299, method: 'COD / Bank', status: 'Pending' },
];

export const ADMIN_TRACKING = [
  { order: 'MBD-100480', courier: 'Delhivery', awb: 'DL2847561IN', status: 'In transit', location: 'Bengaluru → Mumbai' },
  { order: 'MBD-100476', courier: 'BlueDart', awb: 'BD9981273IN', status: 'Out for delivery', location: 'Mumbai hub' },
  { order: 'MBD-100479', courier: 'Delhivery', awb: 'DL2847002IN', status: 'Delivered', location: 'Chennai' },
  { order: 'MBD-100475', courier: 'XpressBees', awb: 'XB5520198IN', status: 'Picked up', location: 'Hyderabad warehouse' },
];

export const ADMIN_USERS = [
  { name: 'Gautham', email: 'gautham@moodbuds.com', role: 'Super Admin', lastActive: 'Online now', twoFA: true },
  { name: 'Vishnu Tej', email: 'vishnutej@moodbuds.com', role: 'Manager', lastActive: '2 hours ago', twoFA: true },
  { name: 'Kishore', email: 'kishore@moodbuds.com', role: 'Catalog Editor', lastActive: 'Yesterday', twoFA: false },
  { name: 'Mahesh', email: 'mahesh@moodbuds.com', role: 'Support', lastActive: '3 days ago', twoFA: true },
];

export const ADMIN_ROLES = ['Super Admin', 'Manager', 'Catalog', 'Support'];
export const ADMIN_PERMISSIONS: { module: string; grants: boolean[] }[] = [
  { module: 'Products', grants: [true, true, true, false] },
  { module: 'Orders', grants: [true, true, false, true] },
  { module: 'Refunds', grants: [true, true, false, false] },
  { module: 'Moods & Quiz', grants: [true, true, true, false] },
  { module: 'CMS & Banners', grants: [true, true, false, false] },
  { module: 'Coupons', grants: [true, true, false, false] },
  { module: 'Admin & Security', grants: [true, false, false, false] },
];

export const ADMIN_IMPORT_HISTORY = [
  { file: 'products_jun28.csv', rows: '312 rows', status: 'Completed', when: '28 Jun, 14:20' },
  { file: 'inventory_update.csv', rows: '89 rows', status: 'Completed', when: '26 Jun, 09:11' },
  { file: 'moods_relink.csv', rows: '12 rows', status: 'Failed — 3 errors', when: '24 Jun, 18:02' },
];

export const ADMIN_SHIPPING_QUEUE = [
  { column: 'To pack', orders: ['MBD-100482', 'MBD-100483', 'MBD-100484'] },
  { column: 'Ready to ship', orders: ['MBD-100480', 'MBD-100479'] },
  { column: 'Handed to courier', orders: ['MBD-100476', 'MBD-100475', 'MBD-100474'] },
];

/** Dashboard hub: sections -> module keys, mirrors the original SECTIONS array. */
export const ADMIN_SECTIONS: { title: string; modules: string[] }[] = [
  { title: 'Admin Access & Governance', modules: ['admin-accounts', 'roles-permissions'] },
  { title: 'Product Catalog', modules: ['create-product', 'edit-products', 'bulk-import-export'] },
  { title: 'Category Management', modules: ['categories', 'subcategories'] },
  { title: 'Orders', modules: ['order-list', 'order-details'] },
  { title: 'Shipping & Fulfillment', modules: ['shipping-queue', 'tracking-awbs'] },
  { title: 'Returns & Refunds', modules: ['return-requests', 'refund-center'] },
  { title: 'Inventory Control', modules: ['stock-overview'] },
  { title: 'Mood Engine', modules: ['moods'] },
  { title: 'Mood Quiz', modules: ['quiz-management'] },
  { title: 'Homepage & CMS', modules: ['banners', 'about-contact', 'social-links'] },
  { title: 'Coupons & Discounts', modules: ['coupons'] },
];

export const ADMIN_MODULE_LABELS: Record<string, string> = {
  'admin-accounts': 'Admin Accounts & Security',
  'roles-permissions': 'Roles & Permissions',
  'create-product': 'Create Product',
  'edit-products': 'Edit Products',
  'bulk-import-export': 'Bulk Import / Export',
  categories: 'Categories',
  subcategories: 'Subcategories',
  'order-list': 'Order List',
  'order-details': 'Order Details',
  'shipping-queue': 'Shipping Queue',
  'tracking-awbs': 'Tracking & AWBs',
  'return-requests': 'Return Requests',
  'refund-center': 'Refund Center',
  'stock-overview': 'Stock Overview',
  moods: 'Moods',
  'quiz-management': 'Quiz Management',
  banners: 'Banners',
  'about-contact': 'About & Contact',
  'social-links': 'Social Links',
  coupons: 'Coupons',
};
