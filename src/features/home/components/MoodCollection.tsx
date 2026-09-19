import { Link } from 'react-router-dom';
import { useMoods } from '../../moods/hooks/useMoods';
import { moodBannerUrl, useFallbackMoodImage } from '../../moods/utils/moodBanner';

export function MoodCollection() {
  const { moods } = useMoods();
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
        {moods.map((m) => (
          <Link key={m.id} className="mood-card" to={`/mood/${m.id}`}>
            <div className="mood-card-wrap">
              <img
                src={moodBannerUrl(m.id)}
                alt={m.title}
                loading="lazy"
                onError={(event) => m.image ? useFallbackMoodImage(event, m.image.replace('w=1400', 'w=400')) : event.currentTarget.remove()}
              />
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
