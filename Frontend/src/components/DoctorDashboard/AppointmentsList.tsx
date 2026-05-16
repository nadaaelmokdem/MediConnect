import type { Dispatch, SetStateAction } from 'react';
import { MdArrowForward, MdVideocam, MdLocalHospital } from 'react-icons/md';


export interface Appointment {
  id: number | string;
  time: string;
  duration: string;
  patientName: string;
  type: string;
  method: "Video" | "In-Person" | string;
  isActive: boolean;
  avatar?: string;
  initials?: string;
}

interface AppointmentsListProps {
  appointments: Appointment[];
  setAppointments: Dispatch<SetStateAction<Appointment[]>>;
}

export default function AppointmentsList({ appointments, setAppointments }: AppointmentsListProps) {
  
  const handleAppointmentClick = (id: number | string) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, isActive: true } : { ...app, isActive: false }
      )
    );
  };

  return (
    <section className="lg:col-span-2 bg-white rounded-xl shadow-ambient-card border border-surface-variant overflow-hidden flex flex-col">
      <div className="p-lg border-b border-surface-variant flex justify-between items-center bg-custom-light-bg/50">
        <h3 className="font-h3 text-h3 text-custom-text">Daily Schedule</h3>
        <button className="font-label-sm text-label-sm text-custom-primary hover:text-custom-secondary flex items-center gap-xs transition-colors">
          View Calendar <MdArrowForward className="text-[16px]" />
        </button>
      </div>

      <div className="p-lg space-y-md flex-1">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            onClick={() => handleAppointmentClick(appointment.id)}
            className={`flex items-center gap-md p-md rounded-lg transition-all duration-200 cursor-pointer border group overflow-hidden relative ${
              appointment.isActive
                ? "bg-indigo-50 border-custom-secondary shadow-sm"
                : "bg-custom-light-bg border-transparent hover:border-outline-variant hover:bg-surface-variant"
            }`}
          >
            {appointment.isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-custom-primary"></div>
            )}
            
            <div className="text-center w-16 flex-shrink-0">
              <p className={`font-label-md text-label-md ${appointment.isActive ? "text-custom-primary" : "text-custom-text"}`}>
                {appointment.time}
              </p>
              <p className={`font-body-sm text-body-sm ${appointment.isActive ? "text-custom-primary/80" : "text-on-surface-variant"}`}>
                {appointment.duration}
              </p>
            </div>
            
            <div className={`w-1 h-12 rounded-full ${appointment.isActive ? "bg-custom-primary/20" : "bg-custom-secondary"}`}></div>
            
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-md">
                {appointment.avatar ? (
                  <img
                    alt={appointment.patientName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    src={appointment.avatar}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-md border-2 border-white shadow-sm">
                    {appointment.initials}
                  </div>
                )}
                <div>
                  <p className="font-label-md text-label-md text-custom-text">{appointment.patientName}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{appointment.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <span className={`font-label-sm text-label-sm px-sm py-xs rounded-full flex items-center gap-xs ${
                  appointment.isActive 
                    ? "bg-custom-primary/10 text-custom-primary" 
                    : "bg-surface-container-highest text-on-surface-variant"
                }`}>
                  <span className="text-[14px]">
                    {appointment.method === "Video" ? <MdVideocam /> : <MdLocalHospital />}
                  </span>
                  {appointment.method}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}