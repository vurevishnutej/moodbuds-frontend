import { Link } from 'react-router-dom';
import { MOODS } from '../../../data/moods';

export function MoodCollection() {
  return (
    <div className="section">
      <div className="sec-head">
        <div>
          <h2 className="sec-title">Shop by <em>Mood</em></h2>
          <p className="sec-tagline">Every mood has a style</p>
        </div>
        <a className="sec-see" href="#pill-strip">See All →</a>
      </div>
      <div className="mood-row" id="mood-cards-row">
        {MOODS.map((m) => (
          <Link key={m.id} className="mood-card" to={`/mood/${m.id}`}>
            <div className="mood-card-wrap">
              <img src={m.image.replace('w=1400', 'w=400')} alt={m.title} loading="lazy" />
              <div className="mood-card-shade" />
              <div className="mood-card-info">
                <div className="mood-card-name">{m.title}</div>
                <span className="mood-card-sub">{m.subtitle}</span>
              </div>
            </div>
            <div className="mood-card-line" style={{ background: m.accentColor }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
