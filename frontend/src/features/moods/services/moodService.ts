import type { Mood, MoodId } from '../../../types';
import { MOODS, getMoodById } from '../../../data/moods';
import { delay } from '../../../utils/format';
import { httpMoodApi } from './httpMoodApi';

export interface MoodApi {
  getMoods(): Promise<Mood[]>;
  getMood(id: MoodId | string): Promise<Mood | null>;
}

const mockMoodApi: MoodApi = {
  async getMoods() {
    await delay(120);
    return MOODS;
  },
  async getMood(id) {
    await delay(80);
    return getMoodById(id) ?? null;
  },
};

/**
 * Use real API or mock based on VITE_USE_MOCK_API env var
 * Set VITE_USE_MOCK_API=false in .env.local to use real API
 */
const useMock = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const moodService: MoodApi = useMock
  ? mockMoodApi
  : {
      async getMoods() {
        return httpMoodApi.getAllMoods();
      },
      async getMood(id) {
        return httpMoodApi.getMoodById(String(id));
      },
    };
