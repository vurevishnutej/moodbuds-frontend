import type { Mood } from '../../../types';
import { apiClient } from '../../../services/api/apiClient';
import type { MoodApi } from './moodApi';

interface MoodSummary {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  productCount?: number;
}

/**
 * Real HTTP implementation of Mood API
 */
export const httpMoodApi: MoodApi = {
  /**
   * GET /moods - Fetch all active moods
   */
  async getAllMoods(): Promise<Mood[]> {
    try {
      const moods = await apiClient.get<MoodSummary[]>('/moods');
      return moods.map(mood => ({
        id: mood.id,
        name: mood.name,
        slug: mood.slug,
        description: mood.description || '',
        icon: mood.icon || '',
        color: mood.color || '#000000',
      })) as Mood[];
    } catch (error) {
      console.error('Failed to fetch moods:', error);
      return [];
    }
  },

  /**
   * GET /moods/{slug} - Fetch a specific mood by slug
   */
  async getMoodBySlug(slug: string): Promise<Mood | null> {
    try {
      const mood = await apiClient.get<MoodSummary>(`/moods/${slug}`);
      return {
        id: mood.id,
        name: mood.name,
        slug: mood.slug,
        description: mood.description || '',
        icon: mood.icon || '',
        color: mood.color || '#000000',
      } as Mood;
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
