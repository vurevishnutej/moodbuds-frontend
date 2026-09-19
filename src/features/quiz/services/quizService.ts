import { httpQuizApi } from './httpQuizApi';

/** The backend owns question routing, answer persistence, and mood scoring. */
export const quizService = httpQuizApi;
