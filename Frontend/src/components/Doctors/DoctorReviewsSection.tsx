import { FaStar } from "react-icons/fa";
interface DoctorReviewsSectionProps {
  user: any;
  reviews: any[];
  reviewsTotal: number;
  reviewsLoading: boolean;
  reviewsPage: number;
  setReviewsPage: React.Dispatch<React.SetStateAction<number>>;
  handleRateDoctor: () => void;
  getConsultationTypeName: (type: number) => string;
}

export default function DoctorReviewsSection({
  user,
  reviews,
  reviewsTotal,
  reviewsLoading,
  reviewsPage,
  setReviewsPage,
  handleRateDoctor,
  getConsultationTypeName
}: DoctorReviewsSectionProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-primary/10 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary-dark tracking-tight">Patient Reviews {reviewsTotal > 0 && `(${reviewsTotal})`}</h2>
        {user?.activeRole?.toLowerCase() === "user" && (
          <button
            onClick={handleRateDoctor}
            className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            Rate this Doctor
          </button>
        )}
      </div>
      <div className="space-y-6">
        {reviewsLoading ? (
          <div className="flex justify-center py-8 text-primary">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : !reviews || reviews.length === 0 ? (
          <p className="text-text-muted text-center py-8">No reviews available for this doctor yet.</p>
        ) : (
          <>
            {reviews?.map(review => (
              <div key={review.reviewId} className="border-b border-surface-variant/60 last:border-0 pb-6 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-on-surface">{review.patientName}
                      {review.consultationType !== undefined && (
                        <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] uppercase font-bold tracking-wider">
                          {getConsultationTypeName(review.consultationType)}
                        </span>
                      )}
                      </div>
                    <div className="text-xs text-text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? "" : "text-surface-variant"} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-text-muted text-sm leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}

            {reviewsTotal > reviews?.length && (
              <div className="flex justify-center pt-4 border-t border-surface-variant/60 gap-4 items-center">
                 <button
                   onClick={() => setReviewsPage(p => Math.max(1, p - 1))}
                   disabled={reviewsPage === 1}
                   className="text-sm font-semibold text-primary disabled:text-outline-variant cursor-pointer disabled:cursor-not-allowed hover:underline"
                 >
                   Previous
                 </button>
                 <span className="text-sm text-text-muted">Page {reviewsPage}</span>
                 <button
                   onClick={() => setReviewsPage(p => p + 1)}
                   disabled={reviewsPage * 5 >= reviewsTotal}
                   className="text-sm font-semibold text-primary disabled:text-outline-variant cursor-pointer disabled:cursor-not-allowed hover:underline"
                 >
                   Next
                 </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
