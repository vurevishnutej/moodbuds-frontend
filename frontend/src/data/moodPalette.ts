import type { MoodId } from '../types';

export interface MoodPaletteEntry {
  bg: string;
  surface: string;
  card: string;
  accent: string;
  imgBg: string;
  line: string;
}

export const MOOD_PALETTE: Record<MoodId, MoodPaletteEntry> = {
  happy: { bg: '#faf6ef', surface: '#f5f0e4', card: '#fff', accent: '#e85d04', imgBg: '#ede6d8', line: '#e6ddd0' },
  confident: { bg: '#f6f1e8', surface: '#efe9dc', card: '#fff', accent: '#9a7b2e', imgBg: '#e4dcd0', line: '#ddd4c6' },
  cool: { bg: '#eef4fa', surface: '#e6eef6', card: '#fff', accent: '#2d6aad', imgBg: '#dce6f0', line: '#d0dce8' },
  professional: { bg: '#f4f4f4', surface: '#ececec', card: '#fff', accent: '#444', imgBg: '#e4e4e4', line: '#dcdcdc' },
  party: { bg: '#f9f0fc', surface: '#f3e8f8', card: '#fff', accent: '#9b30d0', imgBg: '#eadcf2', line: '#e0d0ea' },
  energetic: { bg: '#fff6f1', surface: '#ffefe6', card: '#fff', accent: '#e84d00', imgBg: '#ffe8dc', line: '#f0ddd2' },
  romantic: { bg: '#faf0f3', surface: '#f5e8ec', card: '#fff', accent: '#b85c75', imgBg: '#f0e2e8', line: '#e8d6dc' },
  calm: { bg: '#eff8f8', surface: '#e6f2f2', card: '#fff', accent: '#2d9499', imgBg: '#d8ecec', line: '#cce0e0' },
  minimal: { bg: '#f6f6f6', surface: '#eeeeee', card: '#fff', accent: '#333', imgBg: '#e8e8e8', line: '#dedede' },
};

export const MOOD_MATERIAL: Record<MoodId, string> = {
  happy: 'Sunshine blend',
  confident: 'Power weave',
  cool: 'Cool cotton',
  professional: 'Fine cotton',
  party: 'Evening luxe',
  energetic: 'Performance flex',
  romantic: 'Soft satin',
  calm: 'Organic linen',
  minimal: 'Essential cotton',
};
