import { useEffect, useState } from "react";
import AdminService from "../../services/adminService";
import type { AdminAppointment } from "../../types/admin";
import { formatMoney } from "../../utils/formatMoney";

import Skeleton from "../common/Skeleton";
import NetworkError from "../common/NetworkError";

export default function AppointmentsTab() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AdminService.getAppointments()
      .then(setAppointments)
      .catch((err) => setError(err.message ?? "Failed to load appointments"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (error) return <NetworkError message={error} />;

  return (
    <div className="bg-white border border-surface-variant rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-container text-left text-primary-dark/70">
              <th className="px-4 py-3 font-semibold sticky left-0 z-10 bg-surface-container">Patient</th>
              <th className="px-4 py-3 font-semibold">Doctor</th>
              <th className="px-4 py-3 font-semibold">Scheduled</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {appointments.map((a) => (
              <tr key={a.appointmentId}>
                <td className="px-4 py-3 font-medium text-primary-dark sticky left-0 z-10 bg-white">{a.patientName}</td>
                <td className="px-4 py-3 text-primary-dark/70">{a.doctorName}</td>
                <td className="px-4 py-3 text-primary-dark/70">
                  {new Date(a.scheduledAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-primary-dark/70">{a.consultationType}</td>
                <td className="px-4 py-3 text-primary-dark/70">{a.status}</td>
                <td className="px-4 py-3 text-primary-dark/70">{formatMoney(a.price)}</td>
                <td className="px-4 py-3 text-primary-dark/70">
                  {a.paymentStatus ?? "No payment"}
                  {a.amountPaid != null && ` (${formatMoney(a.amountPaid)})`}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-outline-variant">
                  No appointments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
