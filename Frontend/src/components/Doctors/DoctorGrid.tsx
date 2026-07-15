import { FaChevronLeft, FaChevronRight, FaStethoscope } from "react-icons/fa6";
import DoctorCard from "../Doctor/DoctorCard";
import NetworkError from "../common/NetworkError";
import type { DoctorListItem } from "../../types/public";

interface DoctorGridProps {
  error: string | null;
  isLoading: boolean;
  doctors: DoctorListItem[];
  totalCount: number;
  totalPages: number;
  filter: any;
  setFilter: any;
  setSearchTerm: (t: string) => void;
  setSelectedSpecialty: (s: number | "") => void;
  setMinPrice: (p: string) => void;
  setMaxPrice: (p: string) => void;
  handleStartChat: (id: number, doctor: DoctorListItem) => void;
  handleStartVideoCall: (id: number) => void;
  handleBookAppointment: (id: number) => void;
  handlePageChange: (newPage: number) => void;
}

export default function DoctorGrid({
  error,
  isLoading,
  doctors,
  totalCount,
  totalPages,
  filter,
  setFilter,
  setSearchTerm,
  setSelectedSpecialty,
  setMinPrice,
  setMaxPrice,
  handleStartChat,
  handleStartVideoCall,
  handleBookAppointment,
  handlePageChange
}: DoctorGridProps) {
  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-primary/10 overflow-hidden min-h-[400px] flex items-center justify-center">
        <NetworkError message="Failed to load doctors. Please check your connection and try again." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (doctors.length > 0) {
    return (
      <div className="space-y-6">
        <div className="text-text-muted font-medium px-2">
          Found {totalCount} doctor{totalCount !== 1 ? 's' : ''} matching your criteria
        </div>
        {doctors.map(doctor => (
          <DoctorCard
            key={doctor.doctorId}
            doctor={doctor}
            onStartChat={(id) => handleStartChat(id, doctor)}
            onStartCall={(id) => handleStartVideoCall(id)}
            onBookAppointment={handleBookAppointment}
          />
        ))}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-12 mb-8">
            <button
              onClick={() => handlePageChange((filter.page || 1) - 1)}
              disabled={(filter.page || 1) === 1}
              className={`p-3 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                (filter.page || 1) === 1
                  ? 'bg-surface-variant/40 text-outline-variant cursor-not-allowed'
                  : 'bg-white text-primary shadow-sm hover:shadow-md hover:bg-surface-container'
              }`}
            >
              <FaChevronLeft />
            </button>

            <span className="font-semibold text-on-surface-variant">
              Page {filter.page} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange((filter.page || 1) + 1)}
              disabled={(filter.page || 1) === totalPages}
              className={`p-3 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                (filter.page || 1) === totalPages
                  ? 'bg-surface-variant/40 text-outline-variant cursor-not-allowed'
                  : 'bg-white text-primary shadow-sm hover:shadow-md hover:bg-surface-container'
              }`}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-primary/10 p-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-variant/50 mb-4 flex items-center justify-center mx-auto">
        <FaStethoscope size={28} className="text-primary-light" />
      </div>
      <h3 className="text-2xl font-bold text-primary-dark mb-2 tracking-tight">No doctors found</h3>
      <p className="text-text-muted">Try adjusting your filters to find what you're looking for.</p>
      <button
        onClick={() => {
          setSearchTerm("");
          setSelectedSpecialty("");
          setMinPrice("");
          setMaxPrice("");
          setFilter({ page: 1, pageSize: 10, bookingTypes: [] });
        }}
        className="mt-6 text-primary hover:text-primary-dark font-semibold transition-colors cursor-pointer"
      >
        Clear all filters
      </button>
    </div>
  );
}
