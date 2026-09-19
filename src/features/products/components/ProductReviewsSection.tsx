import { useEffect, useRef, useState } from 'react';
import { apiClient } from '../../../services/api/apiClient';

interface Review {
  id: number;
  userId: number;
  userInitial: string;
  rating: number;
  title?: string;
  comment?: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

interface ReviewsPageResponse {
  content: Review[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface ProductReviewsSectionProps {
  productSlug: string;
  pageSize?: number;
}

export function ProductReviewsSection({ productSlug, pageSize = 3 }: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allReviewsLoaded, setAllReviewsLoaded] = useState<Review[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadMoreReviews = async () => {
    if (displayedCount === 0) {
      // First load
      setLoading(true);
      setError(null);
      try {
        let page = 0;
        let allReviews: Review[] = [];
        let hasMorePages = true;

        while (hasMorePages) {
          const response = await apiClient.get<ReviewsPageResponse>(`/products/${productSlug}/reviews?page=${page}&size=${pageSize}`);
          allReviews = [...allReviews, ...response.content];
          hasMorePages = page + 1 < response.totalPages;
          page++;
        }

        setAllReviewsLoaded(allReviews);
        setTotalElements(allReviews.length);
        setReviews(allReviews.slice(0, pageSize));
        setDisplayedCount(pageSize);
        setHasMore(allReviews.length > pageSize);
      } catch {
        setError('Could not load reviews');
      } finally {
        setLoading(false);
      }
    } else {
      // Load more - slide up and show next batch
      const nextCount = Math.min(displayedCount + pageSize, allReviewsLoaded.length);
      setReviews(allReviewsLoaded.slice(0, nextCount));

      // Smooth scroll animation
      if (containerRef.current) {
        containerRef.current.style.scrollBehavior = 'smooth';
        containerRef.current.scrollTop = pageSize * 100;
      }

      setDisplayedCount(nextCount);
      setHasMore(nextCount < allReviewsLoaded.length);
    }
  };

  const loadMore = async () => {
    await loadMoreReviews();
  };

  useEffect(() => {
    if (isOpen && displayedCount === 0) {
      void loadMoreReviews();
    }
  }, [isOpen, productSlug, pageSize]);

  return (
    <div className="pd-accordion">
      <div className={`pd-acc-item${isOpen ? ' open' : ''}`}>
        <button
          type="button"
          className="pd-acc-head"
          onClick={() => setIsOpen(!isOpen)}
        >
          Customer Reviews {isOpen && `(${totalElements})`} <span className="pd-acc-icon">{isOpen ? '−' : '+'}</span>
        </button>
        {isOpen && (
          <div className="pd-acc-body">
            {loading ? (
              <div className="reviews-loading">Loading reviews...</div>
            ) : error ? (
              <div className="reviews-error">{error}</div>
            ) : reviews.length === 0 ? (
              <div className="reviews-empty">No reviews yet. Be the first to review!</div>
            ) : (
              <>
                <div className="reviews-container" ref={containerRef}>
                  {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div className="review-avatar">{review.userInitial}</div>
                        <div className="review-meta">
                          <div className="review-rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={`star${i < review.rating ? ' filled' : ''}`}>★</span>
                            ))}
                          </div>
                          <div className="review-title">{review.title}</div>
                          {review.verifiedPurchase && <span className="verified-badge">✓ Verified</span>}
                        </div>
                      </div>
                      {review.comment && <p className="review-comment">{review.comment}</p>}
                      <div className="review-footer">
                        <span className="review-date">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="reviews-footer">
                  <div className="reviews-count">Showing {reviews.length} of {totalElements} reviews</div>
                  {hasMore && (
                    <button
                      type="button"
                      className="load-more-btn"
                      onClick={loadMore}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load more'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
