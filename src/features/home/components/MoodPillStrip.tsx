import { Link } from 'react-router-dom';
import { useMoods } from '../../moods/hooks/useMoods';

export function MoodPillStrip() {
  const { moods } = useMoods();
  return (
    <div id="pill-strip">
      <div className="pill-row" id="pill-row">
        {moods.map((m) => (
          <Link key={m.id} className="mood-pill" to={`/mood/${m.id}`}>
            <span className="pill-ico">{m.emoji}</span>
            <span className="pill-lbl">{m.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
