import { apiClient } from '../../../services/api/apiClient';
import { adminAuthOptions } from '../../admin/services/adminQuizService';

export interface SocialLink {
  id: number;
  platform: string;
  displayName: string;
  url: string;
  icon: string;
  displayOrder: number;
  enabled: boolean;
  updatedAt: string;
}

export interface SocialLinkInput {
  id: number;
  url: string;
  enabled: boolean;
}

export const socialLinkService = {
  public: () => apiClient.get<SocialLink[]>('/content/social-links', { includeAuth: false }),
  admin: () => apiClient.get<SocialLink[]>('/admin/content/social-links', adminAuthOptions()),
  update: (links: SocialLinkInput[]) => apiClient.put<SocialLink[]>(
    '/admin/content/social-links',
    { links },
    adminAuthOptions(),
  ),
};
