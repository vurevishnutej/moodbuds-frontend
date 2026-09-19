import { apiClient } from '../../../services/api/apiClient';
import { adminAuthOptions } from '../../admin/services/adminQuizService';

export interface AboutContent {
  title: string;
  headline: string;
  story: string;
  mission: string;
  updatedAt: string;
}

export interface ContactContent {
  title: string;
  intro: string;
  supportEmail: string;
  supportPhone: string;
  supportHours: string;
  registeredAddress: string;
  updatedAt: string;
}

export interface AdminSiteContent {
  about: AboutContent;
  contact: ContactContent;
  updatedBy?: string;
  updatedAt: string;
}

export interface SiteContentDraft {
  about: Pick<AboutContent, 'title' | 'headline' | 'story' | 'mission'>;
  contact: Pick<ContactContent, 'title' | 'intro' | 'supportEmail' | 'supportPhone' | 'supportHours' | 'registeredAddress'>;
}

export const siteContentService = {
  about: () => apiClient.get<AboutContent>('/content/about-us', { includeAuth: false }),
  contact: () => apiClient.get<ContactContent>('/content/contact-us', { includeAuth: false }),
  admin: () => apiClient.get<AdminSiteContent>('/admin/content/about-contact', adminAuthOptions()),
  update: (draft: SiteContentDraft) => apiClient.put<AdminSiteContent>('/admin/content/about-contact', draft, adminAuthOptions()),
};
