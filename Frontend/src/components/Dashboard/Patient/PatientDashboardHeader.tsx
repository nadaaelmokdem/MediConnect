import { MdCalendarToday } from "react-icons/md";
import { useNavigate } from "react-router-dom";

// Standardizing card base class based on the dashboard design
export const CARD_SHADOW = "shadow-[0_12px_24px_-4px_rgba(42,36,85,0.08),0_4px_12px_-2px_rgba(42,36,85,0.04)]";
export const CARD_BASE = `${CARD_SHADOW} rounded-xl border border-surface-variant/60 transition-shadow duration-300 hover:shadow-[0_16px_32px_-4px_rgba(42,36,85,0.12),0_6px_16px_-2px_rgba(42,36,85,0.06)]`;

interface PatientDashboardHeaderProps {
  fullName: string;
  getGreeting: () => string;
  formattedDate: string;
}

export default function PatientDashboardHeader({
  fullName,
  getGreeting,
  formattedDate
}: PatientDashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <section className="mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-on-surface">
          {getGreeting()}, {fullName.split(' ')[0]}.
        </h1>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <MdCalendarToday className="text-xl" />
          <span className="text-sm font-medium">{formattedDate}</span>
        </div>
      </div>

      <div className={`relative overflow-hidden ${CARD_BASE} h-48 group`}>
        <img
          alt="Find Doctors"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src="find-doctors.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent"></div>
        <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-8 text-on-primary">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Find the right care</h2>
          <p className="text-sm md:text-base mb-4 opacity-90 max-w-md">Search through our network of certified specialists and book your next appointment instantly.</p>
          <button
            onClick={() => navigate('/doctors')}
            className="cursor-pointer w-fit px-4 py-1.5 md:px-6 md:py-2 bg-surface-container-lowest text-primary rounded-lg text-xs md:text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
          >
            Search Doctors
          </button>
        </div>
      </div>
    </section>
  );
}
