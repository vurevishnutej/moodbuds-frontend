/**
 * Core domain models shared across features.
 * These represent the shape of data the (future) backend API will return.
 */

export type MoodId =
  | 'happy'
  | 'confident'
  | 'cool'
  | 'professional'
  | 'party'
  | 'energetic'
  | 'romantic'
  | 'calm'
  | 'minimal';

export interface Mood {
  id: MoodId;
  emoji: string;
  title: string;
  subtitle: string;
  image: string;
  accentColor: string;
  brand: string;
  offer: string;
  gradeOverlay: string;
}

export interface ProductTag {
  isNew: boolean;
  isSale: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  moodId: MoodId;
  price: number;
  originalPrice?: number | null;
  badge?: 'Sale' | 'New' | null;
  image: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  rating: number;
  reviewCount: number;
  description: string;
}

export interface ProductQuery {
  moodId?: MoodId;
  search?: string;
  onSale?: boolean;
  isNew?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  sort?: 'featured' | 'new' | 'price-asc' | 'price-desc';
}

export interface CartItem {
  id: string;
  productId: string;
  moodId?: MoodId;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  qty: number;
  size: string;
  color?: string | null;
  image: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  moodId?: MoodId;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  badge?: 'Sale' | 'New' | null;
  sizes: string[];
  image: string;
  savedAt: number;
}

export interface Wishlist {
  items: WishlistItem[];
}

export interface AddToWishlistRequest {
  productId: string;
  size?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  savings: number;
  delivery: number;
  discount: number;
  total: number;
  promoCode?: string | null;
}

export interface AddToCartRequest {
  product: Product;
  size: string;
  color?: string | null;
  qty?: number;
}

export interface UpdateCartItemRequest {
  itemId: string;
  qty: number;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  name: string;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  moodLabel: string;
  size: string;
  color?: string;
  total: number;
  items: OrderItem[];
}

export interface Address {
  id: string;
  name: string;
  line: string;
  phone: string;
  isDefault: boolean;
}

export interface Coupon {
  code: string;
  badge: string;
  description: string;
  validity: string;
  variant: 'default' | 'pink' | 'gold';
}

export interface QuizOption {
  id: string;
  text: string;
  scores: Partial<Record<MoodId, number>>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface QuizResult {
  moodId: MoodId;
  emoji: string;
  line: string;
}

export interface CheckoutResult {
  success: boolean;
  orderId: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  totalSpent: number;
  nextTierAt: number;
}
