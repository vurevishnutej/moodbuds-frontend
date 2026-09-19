import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoods } from '../../moods/hooks/useMoods';
import { capitalize } from '../../../utils/format';
import { moodBannerUrl, useFallbackMoodImage } from '../../moods/utils/moodBanner';

const AUTOPLAY_MS = 5500;
const SLIDE_TAGLINES = [
  'Shop the way you feel',
  'Wear what you feel',
  'Feel it. Wear it.',
  'Your feelings, curated',
  'Dress the feeling',
  'Every mood has a style',
  'Your mood, your look',
  'Shop the way you feel',
  'Dress the feeling',
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const navigate = useNavigate();
  const { moods, loading, error, refresh } = useMoods();

  const goTo = useCallback((n: number) => {
    if (moods.length) setCurrent((n + moods.length) % moods.length);
  }, [moods.length]);

  useEffect(() => {
    if (paused || moods.length < 2) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % moods.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, moods.length]);

  useEffect(() => {
    if (current >= moods.length) setCurrent(0);
  }, [current, moods.length]);

  if (loading && moods.length === 0) return <div id="hero" className="mood-catalog-state">Choosing today&apos;s moods…</div>;
  if (error && moods.length === 0) return <div id="hero" className="mood-catalog-state"><span>{error}</span><button type="button" onClick={() => void refresh()}>Try again</button></div>;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
  };

  return (
    <div
      id="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div id="slides">
        {moods.map((m, i) => (
          <div
            key={m.id}
            className={`slide${i === current ? ' active' : ''}`}
            onClick={() => navigate(`/mood/${m.id}`)}
          >
            <img
              src={moodBannerUrl(m.id)}
              alt={m.title}
              loading={i === 0 ? 'eager' : 'lazy'}
              onError={(event) => m.image ? useFallbackMoodImage(event, m.image) : event.currentTarget.remove()}
            />
            <div className="slide-grade" style={{ background: m.gradeOverlay }} />
            <div className="slide-content">
              <span className="slide-eyebrow">{SLIDE_TAGLINES[i % SLIDE_TAGLINES.length]}</span>
              <div className="slide-title">
                {capitalize(m.title)}
                <em>{m.subtitle}</em>
              </div>
              <button
                type="button"
                className="slide-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/mood/${m.id}`);
                }}
              >
                Shop {capitalize(m.title)}&nbsp;›
              </button>
            </div>
            <div className="slide-brand">
              <div className="slide-brand-name">{m.brand}</div>
              <span className="slide-brand-offer">{m.offer}</span>
              <button
                type="button"
                className="slide-explore"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/mood/${m.id}`);
                }}
              >
                + Explore
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="s-arrow s-prev" onClick={() => goTo(current - 1)}>
        &#8592;
      </button>
      <button type="button" className="s-arrow s-next" onClick={() => goTo(current + 1)}>
        &#8594;
      </button>
      <div id="slider-dots">
        {moods.map((m, i) => (
          <button
            key={m.id}
            type="button"
            className={`dot${i === current ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
