import { useState } from 'react';

export function OfferBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div id="offer-banner">
      <div className="banner-inner">
        <span className="banner-badge">🔥 Hot Deal</span>
        <div className="banner-sep" />
        <span className="banner-main">FLAT <em>₹300 OFF</em> on your first order</span>
        <div className="banner-sep" />
        <span className="banner-sub">Wear what you feel</span>
        <div className="banner-sep" />
        <span className="banner-code">CODE: MOOD300</span>
      </div>
      <button className="banner-close" type="button" onClick={() => setVisible(false)}>✕</button>
    </div>
  );
}
