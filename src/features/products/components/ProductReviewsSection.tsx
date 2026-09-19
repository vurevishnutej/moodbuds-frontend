import { useEffect, useState } from 'react';
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
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ReviewsPageResponse>(`/products/${productSlug}/reviews?page=${page}&size=${pageSize}`);
      setReviews(response.content);
      setTotalPages(response.totalPages);
    } catch {
      setError('Could not load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, [page, productSlug, pageSize]);

  if (error) {
    return (
      <div className="product-reviews-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="product-reviews-section">
      <h3 className="reviews-title">Customer Reviews</h3>

      {loading ? (
        <div className="reviews-loading">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="reviews-empty">No reviews yet. Be the first to review!</div>
      ) : (
        <>
          <div className="reviews-list">
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
                    {review.verifiedPurchase && <span className="verified-badge">✓ Verified Purchase</span>}
                  </div>
                </div>
                {review.comment && <p className="review-comment">{review.comment}</p>}
                <div className="review-footer">
                  <span className="review-date">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="reviews-pagination">
              <button
                type="button"
                className="pagination-btn prev"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                ← Previous
              </button>
              <span className="pagination-info">
                <span className="page-number">{page + 1}</span>
                <span className="page-separator">/</span>
                <span className="total-pages">{totalPages}</span>
              </span>
              <button
                type="button"
                className="pagination-btn next"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
