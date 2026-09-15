import { apiClient } from '../../../services/api/apiClient';
import { adminAuthOptions } from './adminQuizService';

export interface AdminMood {
  id: number;
  name: string;
  slug: string;
  emoji: string;
  tagline?: string;
  personalityTagline?: string;
  color: string;
  displayOrder: number;
  active: boolean;
  productCount: number;
  quizWeightCount: number;
  completedResultCount: number;
  bannerConfigured: boolean;
  bannerImageUrl?: string;
}

export interface CreateMoodInput {
  name: string;
  slug?: string;
  emoji: string;
  tagline?: string;
  personalityTagline?: string;
  color: string;
  displayOrder: number;
  active: boolean;
}

export type UpdateMoodInput = Omit<CreateMoodInput, 'slug' | 'active'>;

export const adminMoodService = {
  list: () => apiClient.get<AdminMood[]>('/admin/moods', adminAuthOptions()),
  create: (input: CreateMoodInput) => apiClient.post<AdminMood>('/admin/moods', input, adminAuthOptions()),
  update: (id: number, input: UpdateMoodInput) => apiClient.put<AdminMood>(`/admin/moods/${id}`, input, adminAuthOptions()),
  setActive: (id: number, active: boolean) => apiClient.patch<AdminMood>(`/admin/moods/${id}/status`, { active }, adminAuthOptions()),
};
