import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import AdminService from "../../services/adminService";
import type { AdminAppointment, AdminAppointmentQuery } from "../../types/admin";
import { formatMoney } from "../../utils/formatMoney";
import Skeleton from "../common/Skeleton";
import NetworkError from "../common/NetworkError";
import Pagination from "../common/Pagination";
import SortableTh from "../common/SortableTh";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const PAGE_SIZE = 20;

const STATUS_BADGE: Record<string, string> = {
  Confirmed: "bg-blue-50 text-blue-600",
  Completed: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-500",
  Pending: "bg-yellow-50 text-yellow-600",
};

export default function AppointmentsTab() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput);
  const [status, setStatus] = useState("");
  const [consultationType, setConsultationType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState<NonNullable<AdminAppointmentQuery["sortBy"]>>("ScheduledAt");
  const [sortDescending, setSortDescending] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, status, consultationType, fromDate, toDate]);

  useEffect(() => {
    setLoading(true);
    AdminService.getAppointments({
      search: search || undefined,
      status: status || undefined,
      consultationType: consultationType || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      sortBy,
      sortDescending,
      page,
      pageSize: PAGE_SIZE,
    })
      .then((res) => {
        setAppointments(res.items);
        setTotalCount(res.totalCount);
      })
      .catch((err) => setError(err.message ?? "Failed to load appointments"))
      .finally(() => setLoading(false));
  }, [search, status, consultationType, fromDate, toDate, sortBy, sortDescending, page]);

  function handleSort(key: string) {
    if (key === sortBy) {
      setSortDescending((d) => !d);
    } else {
      setSortBy(key as NonNullable<AdminAppointmentQuery["sortBy"]>);
      setSortDescending(true);
    }
  }

  if (error && !loading) return <NetworkError message={error} />;

  return (
    <div className="bg-white border border-surface-variant rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-surface-variant flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by patient or doctor name..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-surface-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-surface-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
        >
          <option value="">All statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Pending">Pending</option>
        </select>
        <select
          value={consultationType}
          onChange={(e) => setConsultationType(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-surface-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
        >
          <option value="">All types</option>
          <option value="Chat">Chat</option>
          <option value="VideoCall">Video Call</option>
          <option value="Clinic">Clinic</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-surface-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            aria-label="From date"
          />
          <span className="text-outline-variant text-sm">–</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-surface-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            aria-label="To date"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-4"><Skeleton className="h-64 w-full" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container text-left text-primary-dark/70">
                <th className="px-4 py-3 font-semibold sticky left-0 z-10 bg-surface-container">Patient</th>
                <th className="px-4 py-3 font-semibold">Doctor</th>
                <SortableTh label="Scheduled" sortKey="ScheduledAt" activeSortKey={sortBy} sortDescending={sortDescending} onSort={handleSort} />
                <th className="px-4 py-3 font-semibold">Type</th>
                <SortableTh label="Status" sortKey="Status" activeSortKey={sortBy} sortDescending={sortDescending} onSort={handleSort} />
                <SortableTh label="Price" sortKey="Price" activeSortKey={sortBy} sortDescending={sortDescending} onSort={handleSort} />
                <th className="px-4 py-3 font-semibold">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {appointments.map((a) => (
                <tr key={a.appointmentId}>
                  <td className="px-4 py-3 font-medium text-primary-dark sticky left-0 z-10 bg-white">{a.patientName}</td>
                  <td className="px-4 py-3 text-primary-dark/70">{a.doctorName}</td>
                  <td className="px-4 py-3 text-primary-dark/70 whitespace-nowrap">
                    {new Date(a.scheduledAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-primary-dark/70">{a.consultationType}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_BADGE[a.status] ?? "bg-surface-container text-on-surface-variant"}`}>
                      {a.status}
                    </span>
                  </td>
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
                    No appointments match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} pageSize={PAGE_SIZE} totalCount={totalCount} onPageChange={setPage} />
    </div>
  );
}
