import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMoods } from '../../moods/hooks/useMoods';
import { PRODUCTS } from '../../../data/products';
import { capitalize } from '../../../utils/format';
import { useQuizModal } from '../../../app/providers/QuizProvider';
import { MobileProductCarousel } from './MobileProductCarousel';
import { moodBannerBackground } from '../../moods/utils/moodBanner';
import { useHomepageCoupon } from '../../coupons/hooks/useHomepageCoupon';
import { couponOffer } from '../../coupons/services/couponService';

const QUIZ_FIELD_EMOJIS = ['💫', '✨', '🌙', '💖', '⚡', '🌈', '🌹', '🦋', '👑', '🎵', '☁️', '🌟', '💝', '🎀', '🔥', '😊'];

const QUIZ_FIELD_POS = [
  { x: 3, y: 12, s: 15, o: 0.18, r: -12, d: 8, dl: 0 },
  { x: 14, y: 72, s: 12, o: 0.14, r: 8, d: 11, dl: -3 },
  { x: 22, y: 35, s: 18, o: 0.2, r: -5, d: 9, dl: -6 },
  { x: 32, y: 82, s: 13, o: 0.15, r: 15, d: 7, dl: -2 },
  { x: 42, y: 18, s: 16, o: 0.18, r: -20, d: 10, dl: -8 },
  { x: 52, y: 60, s: 12, o: 0.12, r: 6, d: 12, dl: -4 },
  { x: 62, y: 8, s: 15, o: 0.16, r: -8, d: 8, dl: -1 },
  { x: 72, y: 45, s: 19, o: 0.2, r: 18, d: 9, dl: -5 },
  { x: 82, y: 78, s: 13, o: 0.14, r: -14, d: 11, dl: -7 },
  { x: 91, y: 22, s: 16, o: 0.18, r: 10, d: 7, dl: -3 },
  { x: 8, y: 50, s: 10, o: 0.12, r: 25, d: 13, dl: -9 },
  { x: 48, y: 88, s: 15, o: 0.15, r: -6, d: 8, dl: -2 },
  { x: 78, y: 15, s: 12, o: 0.13, r: 12, d: 10, dl: -6 },
  { x: 26, y: 58, s: 16, o: 0.16, r: -18, d: 9, dl: -4 },
  { x: 58, y: 38, s: 10, o: 0.11, r: 8, d: 11, dl: -1 },
  { x: 88, y: 55, s: 13, o: 0.14, r: -10, d: 8, dl: -5 },
];

export function MobileHome() {
  const quiz = useQuizModal();
  const { moods } = useMoods();
  const homepageCoupon = useHomepageCoupon();
  const heroMoods = moods.slice(0, 5);

  const newArrivals = useMemo(
    () => PRODUCTS.filter((p) => p.badge === 'New').slice(0, 10),
    []
  );
  const trending = useMemo(
    () => [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 10),
    []
  );

  return (
    <div className="mmb-home">
      <div className="mmb-home-content">
        <div className="mmb-cat-strip">
          {moods.map((m) => (
            <Link
              key={m.id}
              to={`/mood/${m.id}`}
              className="mmb-cat-item"
              style={{ ['--mmb-accent' as string]: m.accentColor }}
            >
              <div className="mmb-cat-item-ring">
                <div className="mmb-cat-item-img" style={{ backgroundImage: moodBannerBackground(m) }} />
              </div>
              <span className="mmb-cat-item-lbl">{m.title}</span>
            </Link>
          ))}
        </div>

        {homepageCoupon && <div className="mmb-coupon-banner">
          <span className="mmb-coupon-percent">%</span>
          <div className="mmb-coupon-main">
            <div className="mmb-coupon-headline"><em>{couponOffer(homepageCoupon)}</em> on your first order</div>
            <div className="mmb-coupon-sub">{homepageCoupon.minOrderValue ? `Min. order value ₹${Math.round(homepageCoupon.minOrderValue / 100).toLocaleString('en-IN')}` : 'A little welcome sparkle, just for you'} · T&amp;C apply</div>
          </div>
          <span className="mmb-coupon-code">{homepageCoupon.code}</span>
        </div>}

        <div className="mmb-hero-scroll">
          {heroMoods.map((m) => (
            <Link
              key={m.id}
              to={`/mood/${m.id}`}
              className="mmb-hero-card"
              style={{ backgroundImage: moodBannerBackground(m) }}
            >
              <span className="mmb-hero-eyebrow">{m.offer}</span>
              <span className="mmb-hero-title">{capitalize(m.title)}<br />{m.subtitle}</span>
              <span className="mmb-hero-cta">Shop {capitalize(m.title)} →</span>
            </Link>
          ))}
        </div>

        <MobileProductCarousel title="New" emphasis="Arrivals" products={newArrivals} seeAllTo="/mood/happy" />

        <div className="mmb-quiz-card" onClick={() => quiz.open()}>
          <div className="mmb-quiz-emoji-field">
            {QUIZ_FIELD_POS.map((p, i) => (
              <span
                key={i}
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
                {QUIZ_FIELD_EMOJIS[i % QUIZ_FIELD_EMOJIS.length]}
              </span>
            ))}
          </div>
          <span className="mmb-quiz-eyebrow">Dress the feeling</span>
          <div className="mmb-quiz-title">Not sure how<br />you&apos;re feeling?</div>
          <p className="mmb-quiz-sub">Take our 60-second mood quiz and we&apos;ll build a wardrobe that matches your energy right now.</p>
          <button
            type="button"
            className="mmb-quiz-btn"
            onClick={(e) => {
              e.stopPropagation();
              quiz.open();
            }}
          >
            Find my mood →
          </button>
        </div>

        <MobileProductCarousel title="Trending" emphasis="Now" products={trending} seeAllTo="/mood/cool" />
      </div>
    </div>
  );
}
