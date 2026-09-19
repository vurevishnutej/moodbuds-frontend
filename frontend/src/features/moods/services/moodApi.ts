import type { Mood } from '../../../types';

/**
 * Mood API contract - defines what mood data looks like
 */
export interface MoodApi {
  getAllMoods(): Promise<Mood[]>;
  getMoodById(id: string): Promise<Mood | null>;
  getMoodBySlug(slug: string): Promise<Mood | null>;
}
