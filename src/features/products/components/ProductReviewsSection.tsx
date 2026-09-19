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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  const loadInitialReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ReviewsPageResponse>(`/products/${productSlug}/reviews?page=0&size=${pageSize}`);
      setAllReviews(response.content);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
      setCurrentPage(0);
    } catch {
      setError('Could not load reviews');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (currentPage + 1 >= totalPages || loading) return;

    setLoading(true);
    setIsSliding(true);

    try {
      const response = await apiClient.get<ReviewsPageResponse>(
        `/products/${productSlug}/reviews?page=${currentPage + 1}&size=${pageSize}`
      );

      setTimeout(() => {
        setAllReviews((prev) => [...prev, ...response.content]);
        setCurrentPage((prev) => prev + 1);
        setIsSliding(false);
      }, 400);
    } catch {
      setError('Could not load more reviews');
      setIsSliding(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && allReviews.length === 0) {
      void loadInitialReviews();
    }
  }, [isOpen, productSlug, pageSize]);

  const displayedReviews = allReviews.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const hasMore = (currentPage + 1) * pageSize < allReviews.length || currentPage + 1 < totalPages;
  const displayedCount = Math.min((currentPage + 1) * pageSize, allReviews.length);

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
            {loading && allReviews.length === 0 ? (
              <div className="reviews-loading">Loading reviews...</div>
            ) : error && allReviews.length === 0 ? (
              <div className="reviews-error">{error}</div>
            ) : allReviews.length === 0 ? (
              <div className="reviews-empty">No reviews yet. Be the first to review!</div>
            ) : (
              <>
                <div className={`reviews-carousel ${isSliding ? 'sliding' : ''}`}>
                  <div className="reviews-list">
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
                </div>

                <div className="reviews-footer">
                  <div className="reviews-count">Showing {displayedCount} of {totalElements} reviews</div>
                  {hasMore && (
                    <button
                      type="button"
                      className="load-more-btn"
                      onClick={loadMore}
                      disabled={loading || isSliding}
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
