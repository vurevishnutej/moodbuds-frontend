import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOODS } from '../../../data/moods';
import { capitalize } from '../../../utils/format';

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

  const goTo = useCallback((n: number) => {
    setCurrent((n + MOODS.length) % MOODS.length);
  }, []);

  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % MOODS.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

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
        {MOODS.map((m, i) => (
          <div
            key={m.id}
            className={`slide${i === current ? ' active' : ''}`}
            onClick={() => navigate(`/mood/${m.id}`)}
          >
            <img src={m.image} alt={m.title} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="slide-grade" style={{ background: m.gradeOverlay }} />
            <div className="slide-content">
              <span className="slide-eyebrow">{SLIDE_TAGLINES[i]}</span>
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
        {MOODS.map((m, i) => (
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
