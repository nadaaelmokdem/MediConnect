import React from "react";
import { FaStar, FaMapMarkerAlt, FaBriefcase, FaVideo, FaCommentDots, FaPhone, FaClinicMedical, FaCalendarCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { DoctorListItem } from "../../types/public";

interface DoctorCardProps {
  doctor: DoctorListItem;
  onStartChat: (doctorId: number) => void;
  onBookAppointment?: (doctorId: number) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onStartChat, onBookAppointment }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isSelf = user?.id === doctor.userId;
  // Use prices directly from the doctor profile
  const minPrices = {
    clinic: doctor.isClinicEnabled && doctor.clinicPrice != null ? doctor.clinicPrice : null,
    video: doctor.isVideoEnabled && doctor.videoPrice != null ? doctor.videoPrice : null,
    call: doctor.isCallEnabled && doctor.callPrice != null ? doctor.callPrice : null,
    chat: doctor.isChatEnabled && doctor.chatPrice != null ? doctor.chatPrice : null,
  };

  const activePrices = [minPrices.clinic, minPrices.video, minPrices.call, minPrices.chat].filter((p): p is number => p !== null);
  const hasAnyPrice = activePrices.length > 0;

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

  const handleCardClick = () => {
    navigate(`/doctors/${doctor.doctorId}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/40 flex flex-col sm:flex-row gap-6 group cursor-pointer"
    >
      <div className="flex-shrink-0 flex justify-center items-center">
        {doctor.profilePictureUrl ? (
          <img
            src={doctor.profilePictureUrl}
            alt={doctor.fullName}
            className="w-28 h-28 rounded-full object-cover shadow-md border-4 border-primary/20 group-hover:border-primary/50 transition-colors"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary text-3xl font-bold shadow-md border-4 border-white">
            {doctor.fullName.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">
              Dr. {doctor.fullName} {isSelf && <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-md font-semibold tracking-wide uppercase">You</span>}
            </h3>
            <div className="flex items-center bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-semibold">
              <FaStar className="mr-1" /> {doctor.averageRating.toFixed(1)}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {doctor.specialties.map(spec => (
              <span key={spec.specialtyId} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                {spec.name}
              </span>
            ))}
          </div>

          <div className="space-y-1 text-sm text-gray-600 mb-4">
            {doctor.yearsOfExperience !== undefined && doctor.yearsOfExperience !== null && (
              <p className="flex items-center"><FaBriefcase className="mr-2 text-primary/70" /> {doctor.yearsOfExperience} Years Experience</p>
            )}
            {doctor.clinicLocation && (
              <p className="flex items-center"><FaMapMarkerAlt className="mr-2 text-primary/70" /> {doctor.clinicLocation}</p>
            )}
          </div>

          {/* Consultation Types Icons */}
          <div className="flex gap-3 text-gray-400 mb-4">
             {minPrices.clinic !== null && <FaClinicMedical title="Clinic Visit" className="hover:text-primary transition-colors cursor-pointer" />}
             {minPrices.video !== null && <FaVideo title="Video Call" className="hover:text-primary transition-colors cursor-pointer" />}
             {minPrices.call !== null && <FaPhone title="Voice Call" className="hover:text-primary transition-colors cursor-pointer" />}
             {minPrices.chat !== null && <FaCommentDots title="Chat" onClick={handleStartChat} className="hover:text-primary transition-colors cursor-pointer" />}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mt-2 border-t border-gray-100 pt-4 gap-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-700 font-medium w-full sm:w-auto">
            {!hasAnyPrice && <span className="text-sm text-gray-400">Price not set</span>}
            {hasAnyPrice && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Starting From</span>
                <span className="text-lg font-extrabold text-primary">
                  {Math.min(...activePrices)} EGP
                </span>
              </div>
            )}
          </div>
          {!isSelf && (doctor.isChatEnabled || doctor.isClinicEnabled || doctor.isVideoEnabled || doctor.isCallEnabled) && (
            <div className="flex gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
              {onBookAppointment && (doctor.isClinicEnabled || doctor.isVideoEnabled || doctor.isCallEnabled) && (
                <button
                  type="button"
                  onClick={handleBookAppointment}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FaCalendarCheck className="text-base" /> Book
                </button>
              )}
              {doctor.isChatEnabled && (
                <button
                  type="button"
                  onClick={handleStartChat}
                  className="w-full sm:w-auto bg-white border-2 border-primary text-primary px-6 py-2.5 rounded-full font-medium shadow hover:shadow-md hover:bg-primary/5 transform hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FaCommentDots className="text-base" /> Chat
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
