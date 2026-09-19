import { apiClient } from '../../../services/api/apiClient';
import { adminAuthOptions } from './adminQuizService';

export interface AdminMoodBanner {
  moodId: number;
  moodName: string;
  moodSlug: string;
  color?: string;
  configured: boolean;
  imagePath?: string;
  imageUrl?: string;
  contentType?: string;
  sizeBytes?: number;
  widthPx?: number;
  heightPx?: number;
  updatedAt?: string;
}

export const adminBannerService = {
  list(): Promise<AdminMoodBanner[]> {
    return apiClient.get<AdminMoodBanner[]>('/admin/mood-banners', adminAuthOptions());
  },

  replace(moodId: number, file: File): Promise<AdminMoodBanner> {
    const form = new FormData();
    form.append('file', file);
    return apiClient.putForm<AdminMoodBanner>(`/admin/mood-banners/${moodId}`, form, adminAuthOptions());
  },
};
