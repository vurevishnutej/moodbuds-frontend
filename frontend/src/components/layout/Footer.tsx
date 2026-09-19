import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mb-footer">
      <div className="mbf-news">
        <div className="mbf-news-inner">
          <div className="mbf-news-text">
            <div className="mbf-news-head">Stay in the mood</div>
            <div className="mbf-news-sub">New arrivals, mood edits and exclusive drops — straight to your inbox.</div>
          </div>
          <div className="mbf-news-form">
            <input className="mbf-news-input" type="email" placeholder="your@email.com" aria-label="Email" />
            <button className="mbf-news-btn" type="button">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="mbf-top">
        <div className="mbf-brand-col">
          <Link className="mbf-logo" to="/">Mood<em>Buds</em></Link>
          <p className="mbf-tagline">
            Dress the feeling. Shop by mood, discover your style, and wear what you truly feel — every single day.
          </p>
          <div className="mbf-social">
            <a className="mbf-soc-btn" href="#" aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a className="mbf-soc-btn" href="#" aria-label="Pinterest">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.86 6.36 9.31-.09-.79-.17-2 .03-2.87.18-.78 1.17-4.97 1.17-4.97s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.85 0 1.27.64 1.27 1.41 0 .86-.55 2.14-.83 3.33-.24 1 .5 1.81 1.48 1.81 1.77 0 3.13-1.87 3.13-4.56 0-2.38-1.72-4.05-4.16-4.05-2.84 0-4.5 2.13-4.5 4.33 0 .86.33 1.77.74 2.28a.3.3 0 01.07.28c-.08.31-.24 1-.28 1.13-.04.18-.15.22-.34.13-1.25-.58-2.03-2.41-2.03-3.87 0-3.15 2.29-6.05 6.61-6.05 3.47 0 6.16 2.47 6.16 5.78 0 3.45-2.17 6.22-5.19 6.22-1.01 0-1.97-.53-2.29-1.15l-.62 2.38c-.23.87-.84 1.96-1.24 2.62.94.29 1.93.45 2.96.45C17.52 22 22 17.52 22 12S17.52 2 12 2z" />
              </svg>
            </a>
            <a className="mbf-soc-btn" href="#" aria-label="X / Twitter">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a className="mbf-soc-btn" href="#" aria-label="YouTube">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="5" width="20" height="14" rx="3" />
                <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
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
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>

        <div>
          <span className="mbf-col-head">Company</span>
          <ul className="mbf-links">
            <li><a href="#">About MoodBuds</a></li>
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
