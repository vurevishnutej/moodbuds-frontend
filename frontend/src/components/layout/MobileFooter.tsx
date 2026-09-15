import { Link } from 'react-router-dom';

export function MobileFooter() {
  return (
    <footer className="mmb-footer">
      <div className="mmb-footer-logo">Mood<em>Buds</em></div>
      <p className="mmb-footer-tagline">
        Dress the feeling. Shop by mood, discover your style, and wear what you truly feel — every single day.
      </p>
      <div className="mmb-footer-social">
        <a href="#" aria-label="Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" />
          </svg>
        </a>
        <a href="#" aria-label="Pinterest">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="10" /><path d="M9 17c1-3 2-9 2-9M12 12c1 1 3 1 4-1s0-4-2-4-3 2-2 5" />
          </svg>
        </a>
        <a href="#" aria-label="X / Twitter">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>

      <details className="mmb-footer-accordion">
        <summary>Shop</summary>
        <div className="mmb-footer-acc-links">
          <a href="#">New Arrivals</a>
          <a href="#">Shop by Mood</a>
          <a href="#">Best Sellers</a>
          <a href="#">Sale</a>
        </div>
      </details>
      <details className="mmb-footer-accordion">
        <summary>Help</summary>
        <div className="mmb-footer-acc-links">
          <a href="#">Sizing Guide</a>
          <a href="#">Track My Order</a>
          <a href="#">Returns &amp; Exchanges</a>
          <Link to="/contact-us">Contact Us</Link>
        </div>
      </details>
      <details className="mmb-footer-accordion">
        <summary>Company</summary>
        <div className="mmb-footer-acc-links">
          <Link to="/about-us">About MoodBuds</Link>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
        </div>
      </details>

      <div className="mmb-footer-bottom">
        <span>© 2026 MoodBuds. All rights reserved.</span>
        <span>Made with intention ✦</span>
      </div>
    </footer>
  );
}
