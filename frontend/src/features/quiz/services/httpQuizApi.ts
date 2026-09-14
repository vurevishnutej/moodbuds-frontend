import type { MoodId, QuizResult } from '../../../types';
import { apiClient } from '../../../services/api/apiClient';

/**
 * Backend Quiz Configuration Response
 */
interface QuizConfigResponse {
  questions: QuizQuestion[];
  moods: string[];
  sessionTimeout: number;
}

/**
 * Backend Quiz Question
 */
interface QuizQuestion {
  id: number;
  text: string;
  options: QuizOption[];
  order: number;
}

/**
 * Backend Quiz Option
 */
interface QuizOption {
  id: number;
  text: string;
  order: number;
  weights: Record<string, number>; // mood: weight
}

/**
 * Backend Quiz Session Response
 */
interface QuizSessionResponse {
  sessionId: string;
  sessionToken: string;
  createdAt: string;
  expiresAt: string;
}

/**
 * Backend Quiz Result Response
 */
interface QuizResultResponse {
  sessionId: string;
  recommendedMood: string;
  scores: Record<string, number>;
  recommendations: string[];
}

/**
 * Real HTTP Quiz API implementation
 */
export const httpQuizApi = {
  /**
   * GET /quiz/config - Get quiz configuration and questions
   */
  async getConfig(): Promise<QuizConfigResponse> {
    try {
      return await apiClient.get<QuizConfigResponse>('/quiz/config');
    } catch (error) {
      console.error('Failed to fetch quiz config:', error);
      throw error;
    }
  },

  /**
   * POST /quiz/sessions - Create a new quiz session
   */
  async createSession(): Promise<QuizSessionResponse> {
    try {
      return await apiClient.post<QuizSessionResponse>('/quiz/sessions', {});
    } catch (error) {
      console.error('Failed to create quiz session:', error);
      throw error;
    }
  },

  /**
   * GET /quiz/sessions/{sessionId}/question - Get next question
   */
  async getNextQuestion(sessionId: string, sessionToken: string): Promise<QuizQuestion> {
    try {
      return await apiClient.get<QuizQuestion>(
        `/quiz/sessions/${sessionId}/question`,
        {
          headers: { 'X-Quiz-Session-Token': sessionToken },
        }
      );
    } catch (error) {
      console.error('Failed to fetch next question:', error);
      throw error;
    }
  },

  /**
   * POST /quiz/sessions/{sessionId}/answers - Submit an answer
   */
  async submitAnswer(
    sessionId: string,
    sessionToken: string,
    optionId: number
  ): Promise<any> {
    try {
      return await apiClient.post(
        `/quiz/sessions/${sessionId}/answers`,
        { optionId },
        {
          headers: { 'X-Quiz-Session-Token': sessionToken },
        }
      );
    } catch (error) {
      console.error('Failed to submit answer:', error);
      throw error;
    }
  },

  /**
   * POST /quiz/sessions/{sessionId}/complete - Complete quiz
   */
  async completeQuiz(
    sessionId: string,
    sessionToken: string
  ): Promise<QuizResultResponse> {
    try {
      return await apiClient.post(
        `/quiz/sessions/${sessionId}/complete`,
        {},
        {
          headers: { 'X-Quiz-Session-Token': sessionToken },
        }
      );
    } catch (error) {
      console.error('Failed to complete quiz:', error);
      throw error;
    }
  },

  /**
   * GET /quiz/sessions/{sessionId}/result - Get quiz result
   */
  async getResult(
    sessionId: string,
    sessionToken: string
  ): Promise<QuizResultResponse> {
    try {
      return await apiClient.get<QuizResultResponse>(
        `/quiz/sessions/${sessionId}/result`,
        {
          headers: { 'X-Quiz-Session-Token': sessionToken },
        }
      );
    } catch (error) {
      console.error('Failed to fetch quiz result:', error);
      throw error;
    }
  },
};
