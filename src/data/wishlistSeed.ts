import type { WishlistItem } from '../types';

/** Extracted from the original HTML's `WL_ITEMS` array. */
export const WISHLIST_SEED: WishlistItem[] = [
  {
    id: 'wl-101', productId: 'confident-9', moodId: 'confident', name: 'Structured Blazer', brand: 'The Boardroom',
    price: 3499, originalPrice: null, badge: 'New', sizes: ['XS', 'S', 'M', 'L'],
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&h=540&q=80',
    savedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
  {
    id: 'wl-102', productId: 'romantic-2', moodId: 'romantic', name: 'Satin Slip Dress', brand: 'Blush House',
    price: 2499, originalPrice: 2999, badge: 'Sale', sizes: ['XS', 'S', 'M'],
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&h=540&q=80',
    savedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'wl-103', productId: 'calm-1', moodId: 'calm', name: 'Oversized Linen Shirt', brand: 'Still Water',
    price: 1499, originalPrice: 1899, badge: 'Sale', sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&h=540&q=80',
    savedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'wl-104', productId: 'minimal-3', moodId: 'minimal', name: 'Clean Line Trench', brand: 'Form Zero',
    price: 4299, originalPrice: null, badge: null, sizes: ['S', 'M', 'L'],
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=400&h=540&q=80',
    savedAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: 'wl-105', productId: 'party-1', moodId: 'party', name: 'Sequin Mini Dress', brand: 'After Dark',
    price: 2999, originalPrice: null, badge: 'New', sizes: ['XS', 'S', 'M', 'L'],
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&h=540&q=80',
    savedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'wl-106', productId: 'energetic-5', moodId: 'energetic', name: 'Cushioned Running Shoes', brand: 'Stride Co.',
    price: 2999, originalPrice: 3499, badge: 'Sale', sizes: ['6', '7', '8', '9', '10'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&h=540&q=80',
    savedAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
  },
  {
    id: 'wl-107', productId: 'romantic-5', moodId: 'romantic', name: 'Pearl Detail Earrings', brand: 'Tender Things',
    price: 799, originalPrice: 999, badge: null, sizes: ['One size'],
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&h=540&q=80',
    savedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: 'wl-108', productId: 'calm-9', moodId: 'calm', name: 'Organic Cotton Lounge Set', brand: 'Earth Studio',
    price: 1899, originalPrice: null, badge: 'New', sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&h=540&q=80',
    savedAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
];
