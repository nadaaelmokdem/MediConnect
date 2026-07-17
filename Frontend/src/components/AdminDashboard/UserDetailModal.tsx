import { useEffect, useState } from "react";
import { MdClose, MdPerson, MdEmail, MdPhone, MdCalendarToday, MdPayments, MdEventNote } from "react-icons/md";
import AdminService from "../../services/adminService";
import type { AdminUserDetail } from "../../types/admin";
import { formatMoney } from "../../utils/formatMoney";
import Skeleton from "../common/Skeleton";
import NetworkError from "../common/NetworkError";

interface UserDetailModalProps {
  userId: string | null;
  onClose: () => void;
}

export default function UserDetailModal({ userId, onClose }: UserDetailModalProps) {
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    setDetail(null);
    setError(null);
    setLoading(true);
    AdminService.getUserDetail(userId)
      .then((res) => { if (active) setDetail(res); })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : "Failed to load user"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId]);

  if (!userId) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-surface-variant overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-surface-variant bg-surface-container">
          <h2 className="text-lg font-bold text-primary-dark">User Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-variant text-text-muted transition-colors cursor-pointer"
            aria-label="Close"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {loading && (
            <div className="p-6 space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}
          {error && !loading && <div className="p-6"><NetworkError message={error} /></div>}
          {detail && !loading && (
            <>
              <div className="p-6 border-b border-surface-variant">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary-dark">{detail.fullName}</h3>
                    <span className="inline-block mt-1 text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      {detail.role || "No role"}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      detail.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                    }`}
                  >
                    {detail.isActive ? "Active" : "Deactivated"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <MdEmail className="text-primary/70 shrink-0" /> <span className="truncate">{detail.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <MdPhone className="text-primary/70 shrink-0" /> {detail.phoneNumber || "—"}
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <MdCalendarToday className="text-primary/70 shrink-0" />
                    Joined {new Date(detail.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <MdPerson className="text-primary/70 shrink-0" /> ID: {detail.id}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-surface-container rounded-xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <MdEventNote size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-outline-variant">Appointments</p>
                      <p className="text-lg font-extrabold text-primary-dark">{detail.appointmentCount}</p>
                    </div>
                  </div>
                  <div className="bg-surface-container rounded-xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <MdPayments size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-outline-variant">Total Spent</p>
                      <p className="text-lg font-extrabold text-primary-dark">
                        {detail.totalSpent != null ? formatMoney(detail.totalSpent) : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-sm font-bold text-on-surface mb-3">Recent Appointments</h4>
                {detail.recentAppointments.length === 0 ? (
                  <p className="text-sm text-outline-variant text-center py-6">No appointments yet.</p>
                ) : (
                  <div className="border border-surface-variant rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-surface-container text-left text-primary-dark/70">
                            <th className="px-3 py-2 font-semibold">Patient</th>
                            <th className="px-3 py-2 font-semibold">Doctor</th>
                            <th className="px-3 py-2 font-semibold">Date</th>
                            <th className="px-3 py-2 font-semibold">Status</th>
                            <th className="px-3 py-2 font-semibold">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container">
                          {detail.recentAppointments.map((a) => (
                            <tr key={a.appointmentId}>
                              <td className="px-3 py-2 text-primary-dark/80">{a.patientName}</td>
                              <td className="px-3 py-2 text-primary-dark/80">{a.doctorName}</td>
                              <td className="px-3 py-2 text-primary-dark/80 whitespace-nowrap">
                                {new Date(a.scheduledAt).toLocaleDateString()}
                              </td>
                              <td className="px-3 py-2 text-primary-dark/80">{a.status}</td>
                              <td className="px-3 py-2 text-primary-dark/80">{formatMoney(a.price)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
