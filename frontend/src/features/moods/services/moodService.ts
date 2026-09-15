import type { Mood, MoodId } from '../../../types';
import { httpMoodApi } from './httpMoodApi';

export interface MoodApi {
  getMoods(): Promise<Mood[]>;
  getMood(id: MoodId | string): Promise<Mood | null>;
}

export const moodService: MoodApi = {
  getMoods: () => httpMoodApi.getAllMoods(),
  getMood: (id) => httpMoodApi.getMoodBySlug(String(id)),
};
