import { useQuizModal } from '../../../app/providers/QuizProvider';

const FM_ICONS = ['💫', '✨', '🌙', '💖', '⚡', '🌈', '🌹', '🦋', '👑', '🎵', '☁️', '🌟', '💝', '🎀', '🔥', '😊'];

const FM_POSITIONS = [
  { x: 3, y: 12, s: 18, o: 0.18, r: -12, d: 8, dl: 0 },
  { x: 14, y: 72, s: 14, o: 0.14, r: 8, d: 11, dl: -3 },
  { x: 22, y: 35, s: 22, o: 0.2, r: -5, d: 9, dl: -6 },
  { x: 32, y: 82, s: 16, o: 0.15, r: 15, d: 7, dl: -2 },
  { x: 42, y: 18, s: 20, o: 0.18, r: -20, d: 10, dl: -8 },
  { x: 52, y: 60, s: 14, o: 0.12, r: 6, d: 12, dl: -4 },
  { x: 62, y: 8, s: 18, o: 0.16, r: -8, d: 8, dl: -1 },
  { x: 72, y: 45, s: 24, o: 0.2, r: 18, d: 9, dl: -5 },
  { x: 82, y: 78, s: 16, o: 0.14, r: -14, d: 11, dl: -7 },
  { x: 91, y: 22, s: 20, o: 0.18, r: 10, d: 7, dl: -3 },
  { x: 8, y: 50, s: 12, o: 0.12, r: 25, d: 13, dl: -9 },
  { x: 48, y: 88, s: 18, o: 0.15, r: -6, d: 8, dl: -2 },
  { x: 78, y: 15, s: 14, o: 0.13, r: 12, d: 10, dl: -6 },
  { x: 26, y: 58, s: 20, o: 0.16, r: -18, d: 9, dl: -4 },
  { x: 58, y: 38, s: 12, o: 0.11, r: 8, d: 11, dl: -1 },
  { x: 88, y: 55, s: 16, o: 0.14, r: -10, d: 8, dl: -5 },
];

export function FindYourMood() {
  const quiz = useQuizModal();

  return (
    <div id="find-mood" onClick={() => quiz.open()}>
      <div id="find-mood-wall">
        {FM_POSITIONS.map((p, i) => (
          <span
            key={i}
            className="fm-icon"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              ['--s' as string]: `${p.s}px`,
              ['--o' as string]: p.o,
              ['--d' as string]: `${p.d}s`,
              ['--dl' as string]: `${p.dl}s`,
              ['--r' as string]: `${p.r}deg`,
            }}
          >
            {FM_ICONS[i % FM_ICONS.length]}
          </span>
        ))}
      </div>
      <div className="find-content">
        <div className="find-text">
          <span className="find-eyebrow">Dress the feeling</span>
          <div className="find-title">
            Not sure how
            <br />
            you&apos;re feeling?
          </div>
          <p className="find-sub">
            Your feelings, curated — take our 60-second mood quiz and we&apos;ll build a wardrobe that matches your
            energy right now.
          </p>
        </div>
        <button
          type="button"
          className="find-btn"
          onClick={(e) => {
            e.stopPropagation();
            quiz.open();
          }}
        >
          Find My Mood
          <span className="find-btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}
