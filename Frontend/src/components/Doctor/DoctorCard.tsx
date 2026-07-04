import React from "react";
import { FaStar, FaMapMarkerAlt, FaBriefcase, FaVideo, FaCommentDots, FaPhone, FaClinicMedical } from "react-icons/fa";
import type { DoctorListItem } from "../../types/public";

interface DoctorCardProps {
  doctor: DoctorListItem;
  onBookAppointment: (doctorId: number) => void;
  onStartChat: (doctorId: number) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBookAppointment, onStartChat }) => {
  // Find minimum prices across all specialties for each consultation type
  const minPrices = {
    clinic: Infinity,
    video: Infinity,
    call: Infinity,
    chat: Infinity,
  };

  if (doctor.specialties.length > 0) {
    doctor.specialties.forEach(spec => {
      if (spec.clinicPrice < minPrices.clinic) minPrices.clinic = spec.clinicPrice;
      if (spec.chatPrice < minPrices.chat) minPrices.chat = spec.chatPrice;
      if (spec.videoPrice < minPrices.video) minPrices.video = spec.videoPrice;
      if (spec.callPrice < minPrices.call) minPrices.call = spec.callPrice;
    });
  }

  const hasAnyPrice = 
    minPrices.clinic !== Infinity || 
    minPrices.video !== Infinity || 
    minPrices.call !== Infinity || 
    minPrices.chat !== Infinity;

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

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/40 flex flex-col sm:flex-row gap-6 group">
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
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors cursor-pointer">
              Dr. {doctor.fullName}
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
             <FaClinicMedical title="Clinic Visit" className="hover:text-primary transition-colors cursor-pointer" />
             <FaVideo title="Video Call" className="hover:text-primary transition-colors cursor-pointer" />
             <FaPhone title="Voice Call" className="hover:text-primary transition-colors cursor-pointer" />
             <FaCommentDots title="Chat" onClick={handleStartChat} className="hover:text-primary transition-colors cursor-pointer" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mt-2 border-t border-gray-100 pt-4 gap-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-700 font-medium w-full sm:w-auto">
            {!hasAnyPrice && <span className="text-sm text-gray-400">Price not set</span>}
            {minPrices.clinic !== Infinity && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase">Clinic</span>
                <span className="text-sm font-bold text-primary">{minPrices.clinic} EGP</span>
              </div>
            )}
            {minPrices.video !== Infinity && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase">Video</span>
                <span className="text-sm font-bold text-primary">{minPrices.video} EGP</span>
              </div>
            )}
            {minPrices.call !== Infinity && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase">Call</span>
                <span className="text-sm font-bold text-primary">{minPrices.call} EGP</span>
              </div>
            )}
            {minPrices.chat !== Infinity && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase">Chat</span>
                <span className="text-sm font-bold text-primary">{minPrices.chat} EGP</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
            <button 
              type="button"
              onClick={handleStartChat}
              className="flex-1 sm:flex-none bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium hover:bg-purple-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <FaCommentDots /> Chat
            </button>
            <button 
              type="button"
              onClick={handleBookAppointment}
              className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
