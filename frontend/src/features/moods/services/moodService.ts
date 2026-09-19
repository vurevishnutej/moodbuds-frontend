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
 * Use real API - backend is ready
 */
const useMock = false;

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
