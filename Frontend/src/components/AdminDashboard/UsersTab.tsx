import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { confirmDialog, showErrorAlert } from "../../utils/swalTheme";
import AdminService from "../../services/adminService";
import type { AdminUser, AdminUserQuery } from "../../types/admin";
import { formatMoney } from "../../utils/formatMoney";
import Skeleton from "../common/Skeleton";
import NetworkError from "../common/NetworkError";
import Pagination from "../common/Pagination";
import SortableTh from "../common/SortableTh";
import UserDetailModal from "./UserDetailModal";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const PAGE_SIZE = 20;

export default function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<"" | "active" | "inactive">("");
  const [sortBy, setSortBy] = useState<NonNullable<AdminUserQuery["sortBy"]>>("CreatedAt");
  const [sortDescending, setSortDescending] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, role, status]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role, status, sortBy, sortDescending, page]);

  function load() {
    setLoading(true);
    AdminService.getAllUsers({
      search: search || undefined,
      role: role || undefined,
      isActive: status === "" ? undefined : status === "active",
      sortBy,
      sortDescending,
      page,
      pageSize: PAGE_SIZE,
    })
      .then((res) => {
        setUsers(res.items);
        setTotalCount(res.totalCount);
      })
      .catch((err) => setError(err.message ?? "Failed to load users"))
      .finally(() => setLoading(false));
  }

  function handleSort(key: string) {
    if (key === sortBy) {
      setSortDescending((d) => !d);
    } else {
      setSortBy(key as NonNullable<AdminUserQuery["sortBy"]>);
      setSortDescending(true);
    }
  }

  async function handleToggleActive(user: AdminUser) {
    const action = user.isActive ? "deactivate" : "reactivate";
    const confirmed = await confirmDialog({
      title: `${action === "deactivate" ? "Deactivate" : "Reactivate"} ${user.fullName}?`,
      text: action === "deactivate"
        ? "They will no longer be able to log in. Their history is kept and this can be reversed."
        : "They will be able to log in again.",
      icon: "warning",
      confirmText: action === "deactivate" ? "Deactivate" : "Reactivate",
      danger: action === "deactivate",
    });
    if (!confirmed) return;

    setActioningId(user.id);
    try {
      await AdminService.setUserActive(user.id, !user.isActive);
      load();
    } catch (err) {
      showErrorAlert({ text: err instanceof Error ? err.message : "Action failed" });
    } finally {
      setActioningId(null);
    }
  }

  if (error && !loading) return <NetworkError message={error} />;

  return (
    <div className="bg-white border border-surface-variant rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-surface-variant flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-surface-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-surface-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
        >
          <option value="">All roles</option>
          <option value="User">Patient</option>
          <option value="Doctor">Doctor</option>
          <option value="Admin">Admin</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="px-3 py-2 text-sm rounded-lg border border-surface-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Deactivated</option>
        </select>
      </div>

      {loading ? (
        <div className="p-4"><Skeleton className="h-64 w-full" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container text-left text-primary-dark/70">
                <SortableTh label="Name" sortKey="FullName" activeSortKey={sortBy} sortDescending={sortDescending} onSort={handleSort} className="sticky left-0 z-10 bg-surface-container" />
                <SortableTh label="Email" sortKey="Email" activeSortKey={sortBy} sortDescending={sortDescending} onSort={handleSort} />
                <th className="px-4 py-3 font-semibold">Role</th>
                <SortableTh label="Joined" sortKey="CreatedAt" activeSortKey={sortBy} sortDescending={sortDescending} onSort={handleSort} />
                <SortableTh label="Total Spent" sortKey="TotalSpent" activeSortKey={sortBy} sortDescending={sortDescending} onSort={handleSort} />
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container/40 transition-colors">
                  <td
                    className="px-4 py-3 font-medium text-primary-dark sticky left-0 z-10 bg-white cursor-pointer hover:text-primary hover:underline"
                    onClick={() => setSelectedUserId(u.id)}
                  >
                    {u.fullName}
                  </td>
                  <td className="px-4 py-3 text-primary-dark/70">{u.email}</td>
                  <td className="px-4 py-3 text-primary-dark/70">{u.role}</td>
                  <td className="px-4 py-3 text-primary-dark/70">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-primary-dark/70">
                    {u.totalSpent != null ? formatMoney(u.totalSpent) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        u.isActive
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {u.isActive ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      disabled={actioningId === u.id}
                      onClick={() => handleToggleActive(u)}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold disabled:opacity-50 cursor-pointer ${
                        u.isActive
                          ? "bg-red-50 text-red-500 hover:bg-red-100"
                          : "bg-primary text-white hover:bg-primary-dark"
                      }`}
                    >
                      {u.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-outline-variant">
                    No users match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} pageSize={PAGE_SIZE} totalCount={totalCount} onPageChange={setPage} />

      <UserDetailModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
    </div>
  );
}
