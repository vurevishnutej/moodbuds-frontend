import { useNavigate } from 'react-router-dom';

export function FeaturedPanels() {
  const navigate = useNavigate();

  return (
    <div id="featured">
      <div className="feat-panel" onClick={() => navigate('/mood/confident')}>
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80&fit=crop&crop=top"
          alt="Confident"
          loading="lazy"
        />
        <div className="feat-shade" />
        <div className="feat-info">
          <div className="feat-tag">Trending Mood</div>
          <div className="feat-title">
            Walk in.
            <br />
            Own it.
          </div>
          <span className="feat-cta">Shop Confident →</span>
        </div>
      </div>
      <div className="feat-panel" onClick={() => navigate('/mood/romantic')}>
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&fit=crop&crop=top"
          alt="Romantic"
          loading="lazy"
        />
        <div className="feat-shade" />
        <div className="feat-info">
          <div className="feat-tag">New Arrivals</div>
          <div className="feat-title">
            Soft evenings,
            <br />
            slow hearts.
          </div>
          <span className="feat-cta">Shop Romantic →</span>
        </div>
      </div>
    </div>
  );
}
