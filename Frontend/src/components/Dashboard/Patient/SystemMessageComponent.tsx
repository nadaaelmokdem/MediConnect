import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdClose, MdArrowOutward } from "react-icons/md";
import { CachedImage } from "../../../components/common/CachedImage";
import type { StarRatingProps, SystemMessageComponentProps } from "../../../types/dashboardProps";
import { CARD_BASE } from "./PatientDashboardHeader";

function StarRating({ rating, onRate }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex gap-1 text-amber-500">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-4xl transition-colors ${
            star <= (hoveredRating || rating)
              ? 'text-amber-500'
              : 'text-surface-variant'
          } hover:text-amber-400 focus:outline-none`}
          onClick={() => onRate(Number(star), '')}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function SystemMessageComponent({ doctorName, doctorId, doctorProfilePictureUrl, onRate, onDiscard }: SystemMessageComponentProps) {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const fallbackInitial = doctorName.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase() || 'D';

  return (
    <div className={`${CARD_BASE} p-6 bg-surface-container-lowest flex flex-col h-full`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
            {doctorProfilePictureUrl ? (
              <CachedImage
                src={doctorProfilePictureUrl}
                alt={doctorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{fallbackInitial}</span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-on-surface text-base leading-snug">Rate your visit</h4>
            {doctorId ? (
              <button
                type="button"
                onClick={() => navigate(`/doctors/${doctorId}`)}
                className="group inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline underline-offset-2 decoration-primary/50 transition-colors focus:outline-none focus:underline"
                title={`View Dr. ${doctorName}'s profile`}
              >
                Dr. {doctorName}
                <MdArrowOutward className="text-[13px] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </button>
            ) : (
              <p className="text-xs text-on-surface-variant font-medium">Dr. {doctorName}</p>
            )}
          </div>
        </div>
        <button
          onClick={onDiscard}
          className="text-on-surface-variant hover:text-error transition-colors p-1.5 rounded-full hover:bg-error/10 shrink-0"
          aria-label="Dismiss"
        >
          <MdClose className="text-lg" />
        </button>
      </div>

      {/* Rating Input */}
      <div className="flex items-center justify-center py-3 mb-4 rounded-lg border border-surface-variant/60 bg-surface-dim/10">
        <StarRating rating={rating} onRate={(val) => setRating(val)} />
      </div>

      {/* Optional Comment Input */}
      <div className="flex-grow mb-4">
        <textarea
          rows={2}
          className="w-full h-full min-h-[60px] border border-surface-variant/60 rounded-lg p-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none placeholder:text-on-surface-variant/50"
          placeholder="Share your experience (optional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={() => rating > 0 && onRate(rating, comment)}
        disabled={rating === 0}
        className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all ${
          rating > 0
            ? 'bg-primary text-on-primary hover:shadow-md hover:bg-primary-dark'
            : 'bg-surface-variant/50 text-on-surface-variant/50 cursor-not-allowed'
        }`}
      >
        Submit Feedback
      </button>
    </div>
  );
}
