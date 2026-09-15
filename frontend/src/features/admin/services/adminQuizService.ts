import { apiClient } from '../../../services/api/apiClient';

const ADMIN_TOKEN_KEY = 'moodbuds_admin_access_token';
const ADMIN_SUMMARY_KEY = 'moodbuds_admin_summary';

export interface AdminMoodChoice {
  id: number;
  name: string;
  slug: string;
  color?: string;
}

export interface AdminMoodWeight {
  moodId: number;
  moodName: string;
  moodSlug: string;
  color?: string;
  score: number;
}

export interface AdminQuizOption {
  id: number;
  key: string;
  text: string;
  sortOrder: number;
  routesToPath?: string;
  weights: AdminMoodWeight[];
}

export interface AdminQuizQuestion {
  id: number;
  order: number;
  pathKey?: string;
  text: string;
  options: AdminQuizOption[];
}

export interface AdminQuizEditor {
  questionsPerQuiz: number;
  paths: Array<{ key: string; name: string; description?: string }>;
  moods: AdminMoodChoice[];
  questions: AdminQuizQuestion[];
  structure: { valid: boolean; issues: string[] };
}

export interface AdminSummary {
  id: number;
  username: string;
  fullName: string;
  role: string;
  permissions: string[];
}

interface AdminLoginResponse {
  accessToken: string;
  admin: AdminSummary;
}

export interface UpdateAdminQuestionRequest {
  questionText: string;
  options: Array<{
    id: number;
    text: string;
    weights: Array<{ moodId: number; score: number }>;
  }>;
}

export function adminAuthOptions() {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) throw new Error('SUPER_ADMIN login required');
  return { includeAuth: false, headers: { Authorization: `Bearer ${token}` } };
}

export const adminQuizService = {
  currentAdmin(): AdminSummary | null {
    try {
      const value = sessionStorage.getItem(ADMIN_SUMMARY_KEY);
      return value ? JSON.parse(value) as AdminSummary : null;
    } catch {
      return null;
    }
  },

  async login(username: string, password: string): Promise<AdminSummary> {
    const response = await apiClient.post<AdminLoginResponse>(
      '/admin/auth/login',
      { username, password },
      { includeAuth: false },
    );
    if (response.admin.role !== 'SUPER_ADMIN') {
      throw new Error('This workspace is restricted to SUPER_ADMIN accounts.');
    }
    sessionStorage.setItem(ADMIN_TOKEN_KEY, response.accessToken);
    sessionStorage.setItem(ADMIN_SUMMARY_KEY, JSON.stringify(response.admin));
    return response.admin;
  },

  logout() {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_SUMMARY_KEY);
  },

  async getEditor(): Promise<AdminQuizEditor> {
    return apiClient.get<AdminQuizEditor>('/admin/quiz/editor', adminAuthOptions());
  },

  async updateQuestion(questionId: number, request: UpdateAdminQuestionRequest): Promise<AdminQuizEditor> {
    return apiClient.put<AdminQuizEditor>(
      `/admin/quiz/editor/questions/${questionId}`,
      request,
      adminAuthOptions(),
    );
  },
};
