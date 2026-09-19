import { Link } from 'react-router-dom';
import { MOODS } from '../../../data/moods';

export function MoodPillStrip() {
  return (
    <div id="pill-strip">
      <div className="pill-row" id="pill-row">
        {MOODS.map((m) => (
          <Link key={m.id} className="mood-pill" to={`/mood/${m.id}`}>
            <span className="pill-ico">{m.emoji}</span>
            <span className="pill-lbl">{m.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
