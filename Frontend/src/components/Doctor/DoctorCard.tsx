import React, { useState } from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaBriefcase,
  FaVideo,
  FaCommentDots,
  FaPhone,
  FaClinicMedical,
  FaCheckCircle,
  FaRegCalendarAlt,
  FaCalendarCheck,
} from "react-icons/fa";
import type { DoctorListItem } from "../../types/public";

interface DoctorCardProps {
  doctor: DoctorListItem;
  onBookAppointment: (doctorId: number) => void;
  onStartChat: (doctorId: number) => void;
  /** Index used for staggered entry animation delay */
  index?: number;
}

// Color palette for specialty pills — cycles through hues
const SPECIALTY_COLORS: string[] = [
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-sky-100 text-sky-700 border-sky-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-teal-100 text-teal-700 border-teal-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
];

function hashStringToIndex(str: string, len: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % len;
  return hash;
}

function renderStars(rating: number) {
  const stars = [];
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5;
  for (let i = 0; i < 5; i++) {
    stars.push(
      <FaStar
        key={i}
        className={
          i < full
            ? "text-amber-400"
            : i === full && half
            ? "text-amber-300"
            : "text-gray-200"
        }
        size={11}
      />,
    );
  }
  return stars;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onBookAppointment,
  onStartChat,
  index = 0,
}) => {
  const [showFullBio, setShowFullBio] = useState(false);

  // Minimum prices
  const minPrices = { clinic: Infinity, video: Infinity, call: Infinity, chat: Infinity };
  doctor.specialties.forEach((spec) => {
    if (spec.clinicPrice > 0 && spec.clinicPrice < minPrices.clinic) minPrices.clinic = spec.clinicPrice;
    if (spec.chatPrice  > 0 && spec.chatPrice  < minPrices.chat)   minPrices.chat   = spec.chatPrice;
    if (spec.videoPrice > 0 && spec.videoPrice < minPrices.video)  minPrices.video  = spec.videoPrice;
    if (spec.callPrice  > 0 && spec.callPrice  < minPrices.call)   minPrices.call   = spec.callPrice;
  });

  const hasAnyPrice =
    minPrices.clinic !== Infinity ||
    minPrices.video  !== Infinity ||
    minPrices.call   !== Infinity ||
    minPrices.chat   !== Infinity;

  const lowestPrice = Math.min(
    ...[minPrices.clinic, minPrices.video, minPrices.call, minPrices.chat].filter(
      (p) => p !== Infinity,
    ),
  );

  const handleStartChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStartChat?.(doctor.doctorId);
  };

  const handleBookAppointment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookAppointment?.(doctor.doctorId);
  };

  // Stagger entry animation
  const animDelay = `${index * 0.07}s`;

  return (
    <div
      className="card-enter bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
      style={{ animationDelay: animDelay }}
    >
      {/* Top accent bar (verified = gradient, unverified = gray) */}
      <div
        className={`h-1 w-full ${
          doctor.isVerified
            ? "bg-gradient-to-r from-primary via-indigo-500 to-blue-500"
            : "bg-gray-100"
        }`}
      />

      <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">

        {/* ── Avatar Column ── */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className="relative">
            {doctor.profilePictureUrl ? (
              <img
                src={doctor.profilePictureUrl}
                alt={doctor.fullName}
                className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-primary/10 group-hover:border-primary/30 transition-colors"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-200 flex items-center justify-center text-primary text-3xl font-bold shadow-md border-2 border-primary/10 group-hover:border-primary/30 transition-colors select-none">
                {doctor.fullName.charAt(0)}
              </div>
            )}

            {/* Available now badge — pulsing dot */}
            {doctor.isAvailableNow && (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white pulse-ring-green"
                title="Available now"
              />
            )}
          </div>

          {/* Star rating */}
          <div className="flex items-center gap-0.5">
            {renderStars(doctor.averageRating)}
          </div>
          <p className="text-xs font-bold text-gray-700">
            {doctor.averageRating.toFixed(1)}
          </p>
        </div>

        {/* ── Content Column ── */}
        <div className="flex-grow min-w-0 flex flex-col justify-between gap-3">

          {/* Name + badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                Dr. {doctor.fullName}
              </h3>

              {doctor.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-primary/10 to-indigo-100 text-primary border border-primary/20 verified-badge-shimmer">
                  <FaCheckCircle className="text-[9px]" />
                  Verified
                </span>
              )}

              {!doctor.isAvailableNow && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-400">
                  Offline
                </span>
              )}
            </div>

            {/* Specialty pills */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {doctor.specialties.map((spec) => {
                const colorClass =
                  SPECIALTY_COLORS[
                    hashStringToIndex(spec.name, SPECIALTY_COLORS.length)
                  ];
                return (
                  <span
                    key={spec.specialtyId}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${colorClass}`}
                  >
                    {spec.name}
                  </span>
                );
              })}
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
              {doctor.yearsOfExperience != null && (
                <span className="flex items-center gap-1">
                  <FaBriefcase className="text-primary/60" />
                  {doctor.yearsOfExperience} yrs experience
                </span>
              )}
              {doctor.clinicLocation && (
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-primary/60" />
                  {doctor.clinicLocation}
                </span>
              )}
            </div>

            {/* Bio */}
            {doctor.bio && (
              <div className="text-xs text-gray-500 leading-relaxed">
                <span>
                  {showFullBio || doctor.bio.length <= 100
                    ? doctor.bio
                    : `${doctor.bio.slice(0, 100)}…`}
                </span>
                {doctor.bio.length > 100 && (
                  <button
                    type="button"
                    onClick={() => setShowFullBio((v) => !v)}
                    className="ml-1 text-primary font-semibold hover:underline cursor-pointer"
                  >
                    {showFullBio ? "less" : "more"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Footer row: prices + actions ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">

            {/* Prices */}
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {!hasAnyPrice ? (
                <span className="text-xs text-gray-400 italic">Pricing not set</span>
              ) : (
                <>
                  {/* Show "from X EGP" summary */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-400">From</span>
                    <span className="text-sm font-bold text-primary">
                      {lowestPrice} EGP
                    </span>
                  </div>

                  {/* Consultation type icons with prices */}
                  <div className="flex items-center gap-2 text-gray-400">
                    {minPrices.clinic !== Infinity && (
                      <span title={`Clinic: ${minPrices.clinic} EGP`} className="hover:text-primary transition-colors cursor-default">
                        <FaClinicMedical size={13} />
                      </span>
                    )}
                    {minPrices.video !== Infinity && (
                      <span title={`Video: ${minPrices.video} EGP`} className="hover:text-primary transition-colors cursor-default">
                        <FaVideo size={13} />
                      </span>
                    )}
                    {minPrices.call !== Infinity && (
                      <span title={`Call: ${minPrices.call} EGP`} className="hover:text-primary transition-colors cursor-default">
                        <FaPhone size={13} />
                      </span>
                    )}
                    {minPrices.chat !== Infinity && (
                      <span title={`Chat: ${minPrices.chat} EGP`} className="hover:text-primary transition-colors cursor-default">
                        <FaCommentDots size={13} />
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={handleStartChat}
                id={`chat-btn-${doctor.doctorId}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 hover:border-purple-300 transition-all cursor-pointer"
              >
                <FaCommentDots size={12} />
                Chat
              </button>

              <button
                type="button"
                onClick={handleBookAppointment}
                id={`schedule-btn-${doctor.doctorId}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white text-xs font-semibold shadow-md shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <FaRegCalendarAlt size={12} />
                View Schedule
              </button>

              <button
                type="button"
                onClick={handleBookAppointment}
                id={`book-btn-${doctor.doctorId}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <FaCalendarCheck size={12} />
                Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
