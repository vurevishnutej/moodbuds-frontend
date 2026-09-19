import type { Mood, MoodId } from '../types';

/**
 * The 9 MoodBuds moods, in display order.
 * Extracted verbatim from the original HTML's `MOODS` array.
 */
export const MOODS: Mood[] = [
  {
    id: 'happy',
    emoji: '😊',
    title: 'happy',
    subtitle: 'sunshine in everything.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=85&fit=crop&crop=top',
    accentColor: '#FFD93D',
    brand: 'Sunshine Edit',
    offer: 'New Collection',
    gradeOverlay: 'linear-gradient(100deg,rgba(20,14,2,0.45) 0%,rgba(0,0,0,0.06) 55%,rgba(20,14,2,0.38) 100%)',
  },
  {
    id: 'confident',
    emoji: '🦁',
    title: 'confident',
    subtitle: 'dressed like you won.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=85&fit=crop&crop=top',
    accentColor: '#f0d060',
    brand: 'Power Dressing',
    offer: 'Up To 40% Off',
    gradeOverlay: 'linear-gradient(100deg,rgba(16,12,2,0.45) 0%,rgba(0,0,0,0.06) 55%,rgba(16,12,2,0.38) 100%)',
  },
  {
    id: 'cool',
    emoji: '😎',
    title: 'cool',
    subtitle: 'effortless. always.',
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1400&q=85&fit=crop&crop=top',
    accentColor: '#7EB8F0',
    brand: 'Ice Edit',
    offer: 'Shop Now',
    gradeOverlay: 'linear-gradient(100deg,rgba(4,8,16,0.48) 0%,rgba(0,0,0,0.06) 55%,rgba(4,8,16,0.38) 100%)',
  },
  {
    id: 'professional',
    emoji: '💼',
    title: 'professional',
    subtitle: 'sharp. refined. ready.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1400&q=85&fit=crop&crop=top',
    accentColor: '#cccccc',
    brand: 'The Boardroom',
    offer: 'New Arrivals',
    gradeOverlay: 'linear-gradient(100deg,rgba(10,10,10,0.45)0%,rgba(0,0,0,0.06) 55%,rgba(10,10,10,0.38)100%)',
  },
  {
    id: 'party',
    emoji: '🎉',
    title: 'party',
    subtitle: 'tonight deserves this.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&q=85&fit=crop',
    accentColor: '#D070F0',
    brand: 'Night Edit',
    offer: 'Up To 50% Off',
    gradeOverlay: 'linear-gradient(100deg,rgba(10,4,14,0.48) 0%,rgba(0,0,0,0.06) 55%,rgba(10,4,14,0.38) 100%)',
  },
  {
    id: 'energetic',
    emoji: '⚡',
    title: 'energetic',
    subtitle: 'move louder. feel brighter.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=85&fit=crop&crop=top',
    accentColor: '#FF8040',
    brand: 'Active Energy',
    offer: 'New Drop',
    gradeOverlay: 'linear-gradient(100deg,rgba(18,8,2,0.45) 0%,rgba(0,0,0,0.06) 55%,rgba(18,8,2,0.38) 100%)',
  },
  {
    id: 'romantic',
    emoji: '🌹',
    title: 'romantic',
    subtitle: 'soft evenings, slow hearts.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=85&fit=crop&crop=top',
    accentColor: '#F0A0B0',
    brand: 'The Rose Edit',
    offer: 'New Collection',
    gradeOverlay: 'linear-gradient(100deg,rgba(16,5,8,0.45) 0%,rgba(0,0,0,0.06) 55%,rgba(16,5,8,0.38) 100%)',
  },
  {
    id: 'calm',
    emoji: '🌊',
    title: 'calm',
    subtitle: 'stillness is a style.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1400&q=85&fit=crop',
    accentColor: '#70C0D0',
    brand: 'Serenity Edit',
    offer: 'Shop Calm',
    gradeOverlay: 'linear-gradient(100deg,rgba(4,8,14,0.45) 0%,rgba(0,0,0,0.06) 55%,rgba(4,8,14,0.38) 100%)',
  },
  {
    id: 'minimal',
    emoji: '🖤',
    title: 'minimal',
    subtitle: 'quiet confidence.',
    image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=1400&q=85&fit=crop&crop=top',
    accentColor: '#AAAAAA',
    brand: 'Less Is More',
    offer: 'Curated Picks',
    gradeOverlay: 'linear-gradient(100deg,rgba(8,8,8,0.45) 0%,rgba(0,0,0,0.06) 55%,rgba(8,8,8,0.38) 100%)',
  },
];

export const MOOD_IDS: MoodId[] = MOODS.map((m) => m.id);

export function getMoodById(id: string): Mood | undefined {
  return MOODS.find((m) => m.id === id);
}

/** Transition-screen quotes, shown briefly while navigating into a mood. */
export const MOOD_QUOTES: Record<MoodId, string> = {
  happy: 'Happiness is not a mood.\nIt is a wardrobe choice.',
  confident: 'Dress like the outcome\nis already decided.',
  cool: 'The less you try,\nthe better you look.',
  professional: 'Precision is the most\npowerful statement.',
  party: 'Tonight is the only\noccasion you need.',
  energetic: 'Your energy sets\nthe dress code.',
  romantic: 'Some feelings deserve\nan entire outfit.',
  calm: 'Stillness is not emptiness.\nIt is everything, settled.',
  minimal: 'Remove everything\nthat does not belong.',
};
