import type { MoodId, QuizResult } from '../../../types';
import { QUIZ_QUESTIONS, QUIZ_RESULTS, emptyScoreboard } from '../../../data/quiz';

export interface QuizApi {
  getQuestions(): typeof QUIZ_QUESTIONS;
  scoreAnswers(scoresPerQuestion: Partial<Record<MoodId, number>>[]): QuizResult;
}

export const mockQuizApi: QuizApi = {
  getQuestions() {
    return QUIZ_QUESTIONS;
  },
  scoreAnswers(scoresPerQuestion) {
    const board = emptyScoreboard();
    scoresPerQuestion.forEach((answerScores) => {
      (Object.keys(answerScores) as MoodId[]).forEach((mood) => {
        board[mood] += answerScores[mood] ?? 0;
      });
    });
    let winner: MoodId = 'happy';
    let best = -1;
    (Object.keys(board) as MoodId[]).forEach((mood) => {
      if (board[mood] > best) {
        best = board[mood];
        winner = mood;
      }
    });
    return QUIZ_RESULTS[winner];
  },
};

export const quizService: QuizApi = mockQuizApi;
