import { MdCalendarToday, MdEventBusy } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CARD_BASE } from "./PatientDashboardHeader";
import { CachedImage } from "../../../components/common/CachedImage";
import { getFileUrl } from "../../../utils/fileUtils";
import { formatTimeTo12Hour } from "../../../utils/dateUtils";

interface PatientDashboardAppointmentsProps {
  upcomingAppointments: any[];
  upcomingAppointmentsCount: number;
}

export default function PatientDashboardAppointments({
  upcomingAppointments,
  upcomingAppointmentsCount
}: PatientDashboardAppointmentsProps) {
  const navigate = useNavigate();

  return (
    <div className={`col-span-1 md:col-span-6 lg:col-span-6 bg-surface-container-lowest ${CARD_BASE} p-6 flex flex-col`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-on-surface">Upcoming Appointments</h2>
          {upcomingAppointmentsCount > 0 && <span className="text-sm font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{upcomingAppointmentsCount} total</span>}
        </div>
        <button onClick={() => navigate('/patient-appointments')} className="cursor-pointer text-sm font-medium text-primary hover:underline">View all</button>
      </div>
      <div className="space-y-4 flex-1">
        {upcomingAppointments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-8">
            <MdEventBusy className="text-4xl text-on-surface-variant/30 mb-2" />
            <p className="text-sm text-on-surface-variant/80 text-center mb-4">
              No upcoming appointments yet.
            </p>
            <button onClick={() => navigate('/doctors')} className="cursor-pointer inline-flex items-center gap-2 px-5 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 transition-colors">
              <MdCalendarToday className="text-lg" />
              Book an appointment
            </button>
          </div>
        ) : (
          upcomingAppointments.map((a, i) => (
            <div key={a.appointmentId}>
              <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-surface-container-low transition-colors border border-transparent hover:border-surface-variant/60 cursor-pointer">
                {a.doctorProfilePictureUrl ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                    <CachedImage
                      src={getFileUrl(a.doctorProfilePictureUrl)}
                      alt={a.doctorName || "Doctor"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-sm text-lg font-bold">
                    {(a.doctorName || "D").replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase() || "D"}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-base text-on-surface font-semibold">
                    {(a.doctorName || "").startsWith("Dr.") ? a.doctorName : `Dr. ${a.doctorName || "Doctor"}`}
                  </h4>
                  <p className="text-sm text-on-surface-variant">{a.consultationType}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-on-surface font-semibold">
                    {new Date(a.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}, {formatTimeTo12Hour(new Date(a.scheduledAt))}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-xs font-medium rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    {a.status}
                  </span>
                </div>
              </div>
              {i < upcomingAppointments.length - 1 && <hr className="border-surface-variant/60 mt-4" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
