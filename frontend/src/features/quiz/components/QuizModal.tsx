import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useQuizModal } from '../../../app/providers/QuizProvider';
import { capitalize } from '../../../utils/format';
import { quizService } from '../services/quizService';
import type {
  QuizOptionResponse,
  QuizQuestionResponse,
  QuizResultResponse,
} from '../services/httpQuizApi';

const SESSION_STORAGE_KEY = 'moodbuds_quiz_session';
const LETTERS = ['A', 'B', 'C', 'D'];
const MOOD_EMOJI: Record<string, string> = {
  happy: '😊',
  confident: '🦁',
  cool: '😎',
  professional: '💼',
  party: '🎉',
  energetic: '⚡',
  romantic: '🌹',
  calm: '🌊',
  minimal: '🖤',
};

interface StoredQuizSession {
  sessionId: string;
  sessionToken: string;
}

function readStoredSession(): StoredQuizSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<StoredQuizSession>;
    return value.sessionId && value.sessionToken
      ? { sessionId: value.sessionId, sessionToken: value.sessionToken }
      : null;
  } catch {
    return null;
  }
}

export function QuizModal() {
  const { isOpen, close } = useQuizModal();
  const navigate = useNavigate();
  const [session, setSession] = useState<StoredQuizSession | null>(null);
  const [question, setQuestion] = useState<QuizQuestionResponse | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [progressPercent, setProgressPercent] = useState(0);
  const [chosenOptionId, setChosenOptionId] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResultResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearView = () => {
    setSession(null);
    setQuestion(null);
    setAnsweredQuestions(0);
    setTotalQuestions(5);
    setProgressPercent(0);
    setChosenOptionId(null);
    setResult(null);
    setLoading(false);
    setError(null);
  };

  const finishQuiz = async (activeSession: StoredQuizSession) => {
    const completed = await quizService.completeQuiz(activeSession.sessionId, activeSession.sessionToken);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setProgressPercent(100);
    setQuestion(null);
    setResult(completed);
  };

  const startOrResume = async (forceNew = false) => {
    setLoading(true);
    setError(null);
    setResult(null);
    let stored = forceNew ? null : readStoredSession();

    try {
      if (stored) {
        try {
          const progress = await quizService.getProgress(stored.sessionId, stored.sessionToken);
          setSession(stored);
          setAnsweredQuestions(progress.answeredQuestions);
          setTotalQuestions(progress.totalQuestions);
          setProgressPercent(progress.progressPercent);
          if (progress.status === 'COMPLETED') {
            const completed = await quizService.getResult(stored.sessionId, stored.sessionToken);
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
            setResult(completed);
          } else if (progress.status === 'READY_TO_COMPLETE') {
            await finishQuiz(stored);
          } else {
            setQuestion(progress.nextQuestion ?? null);
          }
          return;
        } catch {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
          stored = null;
        }
      }

      const created = await quizService.createSession();
      const activeSession = { sessionId: created.sessionId, sessionToken: created.sessionToken };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(activeSession));
      setSession(activeSession);
      setAnsweredQuestions(created.answeredQuestions);
      setTotalQuestions(created.totalQuestions);
      setProgressPercent(created.progressPercent);
      setQuestion(created.nextQuestion ?? null);
    } catch {
      setError('Our mood-o-meter is taking a tiny coffee break ☕ Give it a moment, then try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    close();
    window.setTimeout(clearView, 250);
  };

  useEffect(() => {
    if (isOpen && !session && !result && !loading) void startOrResume();
    // startOrResume intentionally runs only when a closed modal is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('quiz-open');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('quiz-open');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const pick = async (option: QuizOptionResponse) => {
    if (chosenOptionId !== null || !session || !question) return;
    setChosenOptionId(option.id);
    setError(null);

    try {
      const progress = await quizService.submitAnswer(
        session.sessionId,
        session.sessionToken,
        question.id,
        option.id,
      );
      setAnsweredQuestions(progress.answeredQuestions);
      setTotalQuestions(progress.totalQuestions);
      setProgressPercent(progress.progressPercent);

      if (progress.status === 'READY_TO_COMPLETE') {
        await finishQuiz(session);
      } else {
        setQuestion(progress.nextQuestion ?? null);
      }
    } catch {
      setError('That answer got lost in the vibes ✨ Tap your choice again and we’ll get back on track.');
    } finally {
      setChosenOptionId(null);
    }
  };

  const retake = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    clearView();
    void startOrResume(true);
  };

  const displayedQuestionNumber = Math.min(answeredQuestions + 1, totalQuestions);

  return createPortal(
    <div id="quiz-overlay" className={isOpen ? 'open' : ''}>
      <div id="quiz-progress-track">
        <div id="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>
      <button id="quiz-close" type="button" onClick={handleClose} aria-label="Close quiz">✕</button>

      {(loading || error) && !question && !result && (
        <div id="quiz-screen">
          <div id="quiz-inner">
            <div id="quiz-question">
              {loading ? 'Finding your next question…' : error}
            </div>
            {error && (
              <div id="quiz-options">
                <button className="quiz-opt" type="button" onClick={() => void startOrResume()}>
                  Wake up the mood-o-meter
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!result && question && (
        <div id="quiz-screen">
          <div id="quiz-inner">
            <div id="quiz-step">{displayedQuestionNumber} of {totalQuestions}</div>
            <div id="quiz-question">{question.text}</div>
            <div id="quiz-options">
              {question.options.map((option, index) => (
                <button
                  key={option.id}
                  type="button"
                  className={`quiz-opt${chosenOptionId === option.id ? ' chosen' : ''}`}
                  disabled={chosenOptionId !== null}
                  onClick={() => void pick(option)}
                >
                  <span className="quiz-opt-letter">{option.key || LETTERS[index]}</span>
                  {option.text}
                </button>
              ))}
            </div>
            {error && <div role="alert">{error}</div>}
          </div>
        </div>
      )}

      {result && (
        <div id="quiz-result" className="show visible">
          <div id="quiz-result-inner">
            <span id="quiz-result-eyebrow">Your mood is</span>
            <div id="quiz-result-rule" />
            <div id="quiz-result-mood">
              {MOOD_EMOJI[result.mood.slug] ?? '✨'} {result.mood.name || capitalize(result.mood.slug)}
            </div>
            <div id="quiz-result-bottom">
              <p id="quiz-result-line">
                {result.mood.personalityTagline || result.mood.tagline || 'Your wardrobe match is ready.'}
              </p>
              <div id="quiz-result-actions">
                <button
                  id="quiz-result-btn"
                  type="button"
                  onClick={() => {
                    handleClose();
                    navigate(`/mood/${result.mood.slug}`);
                  }}
                >
                  Shop {result.mood.name} →
                </button>
                <button id="quiz-retake" type="button" onClick={retake}>
                  Retake quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
