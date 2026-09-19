import { Link } from 'react-router-dom';
import { StorefrontSocialLinks } from './StorefrontSocialLinks';

export function MobileFooter() {
  return (
    <footer className="mmb-footer">
      <div className="mmb-footer-logo">Mood<em>Buds</em></div>
      <p className="mmb-footer-tagline">
        Dress the feeling. Shop by mood, discover your style, and wear what you truly feel — every single day.
      </p>
      <StorefrontSocialLinks className="mmb-footer-social" />

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
