import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { QUIZ_QUESTIONS } from '../../../data/quiz';
import { quizService } from '../services/quizService';
import { useQuizModal } from '../../../app/providers/QuizProvider';
import type { MoodId, QuizOption, QuizResult } from '../../../types';
import { capitalize } from '../../../utils/format';

const LETTERS = ['A', 'B', 'C', 'D'];

export function QuizModal() {
  const { isOpen, close } = useQuizModal();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [chosenOptionId, setChosenOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Partial<Record<MoodId, number>>[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  const reset = () => {
    setStep(0);
    setChosenOptionId(null);
    setAnswers([]);
    setResult(null);
  };

  const handleClose = () => {
    close();
    setTimeout(reset, 250);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('quiz-open');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('quiz-open');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const pick = (option: QuizOption) => {
    if (chosenOptionId) return;
    setChosenOptionId(option.id);
    const nextAnswers = [...answers, option.scores];
    setTimeout(() => {
      setChosenOptionId(null);
      if (step + 1 >= QUIZ_QUESTIONS.length) {
        setAnswers(nextAnswers);
        setResult(quizService.scoreAnswers(nextAnswers));
      } else {
        setAnswers(nextAnswers);
        setStep((s) => s + 1);
      }
    }, 420);
  };

  const progressPct = result ? 100 : (step / QUIZ_QUESTIONS.length) * 100;
  const question = QUIZ_QUESTIONS[step];

  return createPortal(
    <div id="quiz-overlay" className={isOpen ? 'open' : ''}>
      <div id="quiz-progress-track">
        <div id="quiz-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>
      <button id="quiz-close" type="button" onClick={handleClose} aria-label="Close quiz">✕</button>

      {!result && question && (
        <div id="quiz-screen">
          <div id="quiz-inner">
            <div id="quiz-step">{step + 1} of {QUIZ_QUESTIONS.length}</div>
            <div id="quiz-question">{question.question}</div>
            <div id="quiz-options">
              {question.options.map((opt, i) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`quiz-opt${chosenOptionId === opt.id ? ' chosen' : ''}`}
                  onClick={() => pick(opt)}
                >
                  <span className="quiz-opt-letter">{LETTERS[i]}</span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {result && (
        <div id="quiz-result" className="show visible">
          <div id="quiz-result-inner">
            <span id="quiz-result-eyebrow">Your mood is</span>
            <div id="quiz-result-rule" />
            <div id="quiz-result-mood">
              {result.emoji} {capitalize(result.moodId)}
            </div>
            <div id="quiz-result-bottom">
              <p id="quiz-result-line">{result.line}</p>
              <div id="quiz-result-actions">
                <button
                  id="quiz-result-btn"
                  type="button"
                  onClick={() => {
                    handleClose();
                    navigate(`/mood/${result.moodId}`);
                  }}
                >
                  Shop {capitalize(result.moodId)} →
                </button>
                <button id="quiz-retake" type="button" onClick={reset}>
                  Retake quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
