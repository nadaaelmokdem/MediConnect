import { FaStar, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import { CachedImage } from "../common/CachedImage";
import { getFileUrl } from "../../utils/fileUtils";
import type { DoctorListItem } from "../../types/public";

interface DoctorInfoCardProps {
  doctor: DoctorListItem;
  isSelf: boolean;
}

export default function DoctorInfoCard({ doctor, isSelf }: DoctorInfoCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-primary/10 p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

      <div className="shrink-0 relative">
        {doctor.profilePictureUrl ? (
          <CachedImage
            src={getFileUrl(doctor.profilePictureUrl)}
            alt={doctor.fullName}
            className="w-40 h-40 rounded-2xl object-cover shadow-lg border-4 border-white"
          />
        ) : (
          <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary text-5xl font-bold shadow-lg border-4 border-white">
            {doctor.fullName.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase()}
          </div>
        )}
        {isSelf && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-primary-light text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">
            You
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-dark tracking-tight mb-2">
              Dr. {doctor.fullName}
            </h1>
            <div className="flex flex-wrap gap-2">
              {doctor.specialties.map(spec => (
                <span key={spec.specialtyId} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {spec.name}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex flex-col items-center shadow-sm">
            <div className="flex items-center text-yellow-500 font-bold text-xl gap-1">
              <FaStar /> {doctor.averageRating.toFixed(1)}
            </div>
            <span className="text-xs text-text-muted font-medium">Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-text-muted font-medium text-sm">
          {doctor.yearsOfExperience !== undefined && doctor.yearsOfExperience !== null && (
            <div className="flex items-center gap-2">
              <FaBriefcase className="text-primary/70 text-lg" /> {doctor.yearsOfExperience} Years Experience
            </div>
          )}
          {doctor.clinicLocation && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary/70 text-lg" /> {doctor.clinicLocation}
            </div>
          )}
        </div>

        {doctor.bio && (
          <div className="mt-4">
            <h3 className="font-bold text-primary-dark mb-1">About</h3>
            <p className="text-text-muted leading-relaxed">{doctor.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
