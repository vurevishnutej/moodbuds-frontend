import { Link } from 'react-router-dom';
import { StorefrontSocialLinks } from './StorefrontSocialLinks';

export function Footer() {
  return (
    <footer className="mb-footer">
      <div className="mbf-top">
        <div className="mbf-brand-col">
          <Link className="mbf-logo" to="/">Mood<em>Buds</em></Link>
          <p className="mbf-tagline">
            Dress the feeling. Shop by mood, discover your style, and wear what you truly feel — every single day.
          </p>
          <StorefrontSocialLinks className="mbf-social" itemClassName="mbf-soc-btn" />
        </div>

        <div>
          <span className="mbf-col-head">Shop</span>
          <ul className="mbf-links">
            <li><Link to="/">New Arrivals</Link></li>
            <li><Link to="/">Shop by Mood</Link></li>
            <li><Link to="/">Best Sellers</Link></li>
            <li><Link to="/">Sale</Link></li>
            <li><Link to="/">Gift Cards</Link></li>
          </ul>
        </div>

        <div>
          <span className="mbf-col-head">Help</span>
          <ul className="mbf-links">
            <li><a href="#">Sizing Guide</a></li>
            <li><a href="#">Track My Order</a></li>
            <li><a href="#">Returns &amp; Exchanges</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>

        <div>
          <span className="mbf-col-head">Company</span>
          <ul className="mbf-links">
            <li><Link to="/about-us">About MoodBuds</Link></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press &amp; Media</a></li>
            <li><a href="#">Affiliate Program</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
      </div>

      <div className="mbf-bottom">
        <span className="mbf-copy">© 2026 MoodBuds. All rights reserved.</span>
        <div className="mbf-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms &amp; Conditions</a>
          <a href="#">Cookie Policy</a>
          <a href="#">Accessibility</a>
        </div>
        <span className="mbf-made">Made with intention ✦</span>
      </div>
    </footer>
  );
}
