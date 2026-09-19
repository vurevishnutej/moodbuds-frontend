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
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadAllReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      let allReviewsData: Review[] = [];
      let pageNum = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await apiClient.get<ReviewsPageResponse>(`/products/${productSlug}/reviews?page=${pageNum}&size=${pageSize}`);
        allReviewsData = [...allReviewsData, ...response.content];
        hasMore = pageNum + 1 < response.totalPages;
        pageNum++;
      }

      setAllReviews(allReviewsData);
      setTotalElements(allReviewsData.length);
    } catch {
      setError('Could not load reviews');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);

    // Scroll to top of container smoothly
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  useEffect(() => {
    if (isOpen && allReviews.length === 0) {
      void loadAllReviews();
    }
  }, [isOpen, productSlug, pageSize]);

  const displayedReviews = allReviews.slice(page * pageSize, (page + 1) * pageSize);
  const hasMore = (page + 1) * pageSize < allReviews.length;
  const displayedCount = Math.min((page + 1) * pageSize, allReviews.length);

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
            ) : allReviews.length === 0 ? (
              <div className="reviews-empty">No reviews yet. Be the first to review!</div>
            ) : (
              <>
                <div className="reviews-container" ref={containerRef}>
                  {displayedReviews.map((review) => (
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
                  <div className="reviews-count">Showing {displayedCount} of {totalElements} reviews</div>
                  {hasMore && (
                    <button
                      type="button"
                      className="load-more-btn"
                      onClick={loadMore}
                      disabled={loading}
                    >
                      Load more
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
