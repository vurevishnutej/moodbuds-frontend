import type { Mood } from '../../../types';
import { getMoodById } from '../../../data/moods';
import { apiClient } from '../../../services/api/apiClient';
import type { MoodApi } from './moodApi';

interface MoodSummary {
  id: number;
  name: string;
  slug: string;
  emoji?: string;
  tagline?: string;
  personalityTagline?: string;
  bannerImageUrl?: string;
  color?: string;
  displayOrder?: number;
  productCount?: number;
}

const DEFAULT_OVERLAY = 'linear-gradient(100deg,rgba(8,8,8,0.45) 0%,rgba(0,0,0,0.06) 55%,rgba(8,8,8,0.38) 100%)';

function toMood(mood: MoodSummary): Mood {
  const existingDesign = getMoodById(mood.slug);
  return {
    id: mood.slug,
    backendId: mood.id,
    emoji: mood.emoji || existingDesign?.emoji || '✦',
    title: mood.name,
    subtitle: mood.tagline || mood.personalityTagline || 'A style for how you feel.',
    image: mood.bannerImageUrl || existingDesign?.image || '',
    accentColor: mood.color || existingDesign?.accentColor || '#6B7280',
    brand: existingDesign?.brand || `${mood.name} Edit`,
    offer: existingDesign?.offer || 'Shop now',
    gradeOverlay: existingDesign?.gradeOverlay || DEFAULT_OVERLAY,
    displayOrder: mood.displayOrder,
    productCount: mood.productCount,
  };
}

/**
 * Real HTTP implementation of Mood API
 */
export const httpMoodApi: MoodApi = {
  /**
   * GET /moods - Fetch all active moods
   */
  async getAllMoods(): Promise<Mood[]> {
    const moods = await apiClient.get<MoodSummary[]>('/moods', { includeAuth: false });
    return moods.map(toMood);
  },

  /**
   * GET /moods/{slug} - Fetch a specific mood by slug
   */
  async getMoodBySlug(slug: string): Promise<Mood | null> {
    try {
      const mood = await apiClient.get<MoodSummary>(`/moods/${slug}`);
      return toMood(mood);
    } catch (error) {
      console.error(`Failed to fetch mood ${slug}:`, error);
      return null;
    }
  },

  /**
   * Note: Backend uses slug, not ID
   * Fallback to slug lookup
   */
  async getMoodById(id: string): Promise<Mood | null> {
    return this.getMoodBySlug(id);
  },
};
