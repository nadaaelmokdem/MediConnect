import { MdCalendarToday, MdPendingActions } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import type { DoctorDashboardData } from "../../../types/dashboard";

interface DoctorDashboardHeaderProps {
  doctorFirstName: string;
  getGreeting: () => string;
  formattedDate: string;
  isVerified: boolean;
  verificationStatus: string;
  dashboardData: DoctorDashboardData | null;
}

export default function DoctorDashboardHeader({
  doctorFirstName,
  getGreeting,
  formattedDate,
  isVerified,
  verificationStatus,
  dashboardData
}: DoctorDashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <section className="mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-on-surface">
          {getGreeting()}, Dr. {doctorFirstName}.
        </h1>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <MdCalendarToday className="text-xl" />
          <span className="text-sm font-medium">{formattedDate}</span>
        </div>
      </div>

      {!isVerified && (
        <div
          className={`mb-6 rounded-xl border p-4 flex items-start gap-3 ${
            verificationStatus === "Rejected"
              ? "bg-red-50 border-red-200 text-red-800"
              : verificationStatus === "NeedsChanges"
                ? "bg-orange-50 border-orange-200 text-orange-800"
                : "bg-yellow-50 border-yellow-200 text-yellow-800"
          }`}
        >
          <MdPendingActions className="text-2xl shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">
              {verificationStatus === "Pending" && "Your profile is pending admin verification"}
              {verificationStatus === "NeedsChanges" && "Changes requested on your profile"}
              {verificationStatus === "Rejected" && "Your application was rejected"}
            </p>
            <p className="text-sm mt-1 opacity-90">
              {verificationStatus === "Pending"
                ? "You won't appear in patient search until approved. Appointments and chats are unavailable until verification."
                : dashboardData?.adminComment || "Please review your profile and resubmit."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 relative overflow-hidden rounded-xl shadow-[0_12px_24px_-4px_rgba(42,36,85,0.08),0_4px_12px_-2px_rgba(42,36,85,0.04)] min-h-48 h-auto group">
          <img
            alt="Manage your practice"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src="/find-doctors.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-8 text-on-primary">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Manage your practice</h2>
            <p className="text-sm md:text-base mb-4 opacity-90 max-w-md">
              Review today's schedule, update your availability, and stay connected with patients.
            </p>
            <button
              onClick={() => navigate("/doctor-availability")}
              className="cursor-pointer w-fit px-4 py-1.5 md:px-6 md:py-2 bg-surface-container-lowest text-primary rounded-lg text-xs md:text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
            >
              Manage Availability
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
