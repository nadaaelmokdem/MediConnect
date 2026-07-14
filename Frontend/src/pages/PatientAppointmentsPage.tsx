import { useState, useEffect } from "react";
import PatientService from "../services/patientService";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { MdSearch, MdFilterList, MdClear, MdAccessTime, MdChat } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { LuCalendarDays } from "react-icons/lu";
import AppointmentDetailModal from "../components/Appointments/AppointmentDetailModal";
import NetworkError from "../components/common/NetworkError";
import {
  CONSULTATION_TYPE_OPTIONS,
  STATUS_OPTIONS,
  type AppointmentListItem,
  getConsultationTypeIcon,
  getConsultationTypeLabel,
  getStatusLabel,
  getStatusBadgeClasses,
  isChatConsultation,
  MdCircle,
} from "../utils/appointmentUtils";
import { CachedImage } from "../components/common/CachedImage";
import { getFileUrl } from "../utils/fileUtils";

export default function PatientAppointmentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ status: "", type: "", fromDate: "", toDate: "", search: "" });
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentListItem | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await PatientService.getAppointments(filters);
      setAppointments(data);
    } catch (err: any) {
      toast.error("Failed to load appointments.");
      setError(err.message || "Network Error");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchAppointments(); }, [filters, user?.id, user?.activeRole]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ status: "", type: "", fromDate: "", toDate: "", search: "" });
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="w-full bg-background p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-primary-dark">My Appointments</h1>
            <p className="text-sm text-text-muted mt-0.5">View all your past and upcoming consultations.</p>
          </div>
          <div className="flex gap-3 items-center">
            {hasActiveFilters && (
              <button onClick={clearFilters} className="cursor-pointer flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
                <MdClear size={16} /> Clear filters
              </button>
            )}
            <button
              onClick={() => navigate("/doctors")}
              className="cursor-pointer flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-primary-dark transition-all"
            >
              + Book New
            </button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-variant p-5 space-y-5">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <MdFilterList size={18} />
            <span>Filter Appointments</span>
          </div>

          {/* Top row of inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-outline-variant flex items-center gap-1">
                <MdSearch size={13} /> Search Doctor
              </label>
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
                <input
                  type="text"
                  name="search"
                  placeholder="Type a doctor name..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full pl-9 pr-3 py-2 border border-surface-variant rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            </div>

            {/* From Date */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-outline-variant flex items-center gap-1">
                <LuCalendarDays size={13} /> From Date
              </label>
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-surface-variant rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-outline-variant flex items-center gap-1">
                <LuCalendarDays size={13} /> To Date
              </label>
              <input
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-surface-variant rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
          </div>

          {/* Bottom row of pill selections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
            {/* Status pills */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-outline-variant">Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => {
                  const active = filters.status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFilters(f => ({ ...f, status: opt.value }))}
                      className={`cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        active
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-on-surface-variant border-surface-variant hover:border-primary hover:text-primary"
                      }`}
                    >
                      <MdCircle size={8} className={active ? "text-white" : opt.color} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Type pills */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-outline-variant">Consultation Type</label>
              <div className="flex flex-wrap gap-2">
                {CONSULTATION_TYPE_OPTIONS.map((opt) => {
                  const active = filters.type === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFilters(f => ({ ...f, type: opt.value }))}
                      className={`cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        active
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-on-surface-variant border-surface-variant hover:border-primary hover:text-primary"
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active filter pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-1 border-t border-surface-container">
              <span className="text-xs text-outline-variant font-medium mt-1">Active:</span>
              {filters.search && <Pill label={`Doctor: "${filters.search}"`} onRemove={() => setFilters(f => ({ ...f, search: "" }))} />}
              {filters.status && <Pill label={`Status: ${filters.status}`} onRemove={() => setFilters(f => ({ ...f, status: "" }))} />}
              {filters.type !== "" && <Pill label={`Type: ${getConsultationTypeLabel(filters.type)}`} onRemove={() => setFilters(f => ({ ...f, type: "" }))} />}
              {filters.fromDate && <Pill label={`From: ${format(new Date(filters.fromDate), "MMM d, yyyy")}`} onRemove={() => setFilters(f => ({ ...f, fromDate: "" }))} />}
              {filters.toDate && <Pill label={`To: ${format(new Date(filters.toDate), "MMM d, yyyy")}`} onRemove={() => setFilters(f => ({ ...f, toDate: "" }))} />}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-variant overflow-hidden">
          {error ? (
            <NetworkError message="Failed to load appointments. Please check your connection and try again." />
          ) : loading ? (
            <div className="p-12 text-center text-outline-variant">
              <LuCalendarDays className="mx-auto text-3xl mb-3 opacity-30" />
              Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center text-outline-variant space-y-2">
              <LuCalendarDays className="mx-auto text-4xl opacity-20 mb-3" />
              <p className="font-medium">No appointments found</p>
              {hasActiveFilters ? (
                <p className="text-sm">Try adjusting or clearing your filters.</p>
              ) : (
                <>
                  <p className="text-sm">You haven't booked any appointments yet.</p>
                  <Link to="/doctors" className="inline-block mt-2 px-5 py-2 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all">
                    Find a Doctor
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="px-6 py-3 bg-surface-container border-b border-surface-variant">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    {appointments.length} result{appointments.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <table className="w-full text-left text-sm text-on-surface-variant">
                  <thead className="bg-surface-container text-primary-dark uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold">Doctor</th>
                      <th className="px-6 py-4 font-bold">Date & Time</th>
                      <th className="px-6 py-4 font-bold">Type</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant">
                    {appointments.map((app) => (
                      <tr key={app.appointmentId} className="hover:bg-surface-container transition-colors group cursor-default">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {app.doctorProfilePictureUrl ? (
                             <CachedImage
                                src={getFileUrl(app.doctorProfilePictureUrl)}
                                alt={app.doctorName}
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-surface-variant"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {(app.doctorName || "D")[0].toUpperCase()}
                              </div>
                            )}
                            <div className="font-semibold text-primary-dark">
                              <Link to={`/doctors/${app.doctorId}`} className="hover:underline hover:text-primary">
                                {(app.doctorName || "").startsWith("Dr.") ? app.doctorName : `Dr. ${app.doctorName || "Doctor"}`}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-primary-dark">{format(new Date(app.scheduledAt), "MMM d, yyyy")}</div>
                          <div className="text-xs text-outline-variant mt-0.5 flex items-center gap-1">
                            <MdAccessTime size={11} />
                            {format(new Date(app.scheduledAt), "h:mm a")} · {app.durationMins} mins
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-full bg-primary/10 text-primary font-bold border border-primary/15 uppercase tracking-wide w-fit">
                            {getConsultationTypeIcon(app.consultationType)}
                            {getConsultationTypeLabel(app.consultationType)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider rounded-full font-bold border w-fit ${getStatusBadgeClasses(app.status)}`}>
                            <MdCircle size={7} />
                            {getStatusLabel(app.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {isChatConsultation(app.consultationType) && app.sessionId ? (
                            <Link
                              to={`/chat/${app.sessionId}`}
                              className="flex items-center gap-1.5 text-white bg-primary hover:bg-primary-dark px-4 py-1.5 rounded-lg font-semibold text-sm transition-all shadow-sm group-hover:shadow-md w-fit"
                              title="Open your active chat session with this doctor"
                            >
                              <MdChat size={14} /> Open Chat
                            </Link>
                          ) : (
                            <button
                              onClick={() => setSelectedAppointment(app)}
                              className="cursor-pointer text-primary bg-surface-container hover:bg-surface-variant px-4 py-1.5 rounded-lg font-semibold text-sm transition-all border border-surface-variant"
                              title="View full appointment details"
                            >
                              View Details
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <AppointmentDetailModal
        appointment={selectedAppointment}
        partyLabel="Doctor"
        partyName={
          selectedAppointment
            ? (selectedAppointment.doctorName || "").startsWith("Dr.")
              ? selectedAppointment.doctorName!
              : `Dr. ${selectedAppointment.doctorName || "Doctor"}`
            : ""
        }
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}

function Pill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1 px-2.5 py-1 bg-surface-container text-primary text-xs font-semibold rounded-full border border-primary-light">
      {label}
      <button onClick={onRemove} className="cursor-pointer hover:text-red-500 transition-colors ml-0.5">
        <MdClear size={12} />
      </button>
    </span>
  );
}
