import { apiClient } from '../../../services/api/apiClient';

export interface QuizOptionResponse {
  id: number;
  key: string;
  text: string;
  sortOrder: number;
}

export interface QuizQuestionResponse {
  id: number;
  order: number;
  text: string;
  options: QuizOptionResponse[];
}

export interface QuizConfigResponse {
  totalQuestions: number;
  branchQuestionCount: number;
  universalQuestionCount: number;
  sessionValidityHours: number;
}

export interface QuizProgressResponse {
  sessionId: string;
  status: 'IN_PROGRESS' | 'READY_TO_COMPLETE' | 'COMPLETED';
  answeredQuestions: number;
  totalQuestions: number;
  progressPercent: number;
  startedAt: string;
  completedAt?: string;
  nextQuestion?: QuizQuestionResponse;
}

export interface CreateQuizSessionResponse extends QuizProgressResponse {
  sessionToken: string;
}

export interface QuizMoodResult {
  id: number;
  name: string;
  slug: string;
  tagline?: string;
  personalityTagline?: string;
  bannerImageUrl?: string;
  color?: string;
}

export interface QuizResultResponse {
  sessionId: string;
  status: 'COMPLETED';
  completedAt: string;
  mood: QuizMoodResult;
  scoreBreakdown: Array<{ moodId: number; name: string; slug: string; score: number }>;
  recommendedProducts: Array<{
    id: number;
    sku: string;
    slug: string;
    name: string;
    price: number;
    discountPrice?: number;
    primaryImageUrl?: string;
    availableStock: number;
  }>;
}

const anonymousQuizRequest = { includeAuth: false } as const;

export const httpQuizApi = {
  getConfig: () => apiClient.get<QuizConfigResponse>('/quiz/config', anonymousQuizRequest),

  createSession: () =>
    apiClient.post<CreateQuizSessionResponse>('/quiz/sessions', {}, anonymousQuizRequest),

  getProgress: (sessionId: string, sessionToken: string) =>
    apiClient.get<QuizProgressResponse>(`/quiz/sessions/${sessionId}`, {
      ...anonymousQuizRequest,
      headers: { 'X-Quiz-Session-Token': sessionToken },
    }),

  submitAnswer: (sessionId: string, sessionToken: string, questionId: number, optionId: number) =>
    apiClient.post<QuizProgressResponse>(
      `/quiz/sessions/${sessionId}/answers`,
      { questionId, optionId },
      {
        ...anonymousQuizRequest,
        headers: { 'X-Quiz-Session-Token': sessionToken },
      },
    ),

  completeQuiz: (sessionId: string, sessionToken: string) =>
    apiClient.post<QuizResultResponse>(
      `/quiz/sessions/${sessionId}/complete`,
      {},
      {
        ...anonymousQuizRequest,
        headers: { 'X-Quiz-Session-Token': sessionToken },
      },
    ),

  getResult: (sessionId: string, sessionToken: string) =>
    apiClient.get<QuizResultResponse>(`/quiz/sessions/${sessionId}/result`, {
      ...anonymousQuizRequest,
      headers: { 'X-Quiz-Session-Token': sessionToken },
    }),
};
