import { useEffect, useState } from "react";
import { confirmDialog, showErrorAlert } from "../../utils/swalTheme";
import AdminService from "../../services/adminService";
import type { AdminUser } from "../../types/admin";
import { formatMoney } from "../../utils/formatMoney";
import Skeleton from "../common/Skeleton";
import NetworkError from "../common/NetworkError";

export default function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    AdminService.getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message ?? "Failed to load users"))
      .finally(() => setLoading(false));
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

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (error) return <NetworkError message={error} />;

  return (
    <div className="bg-white border border-surface-variant rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-container text-left text-primary-dark/70">
              <th className="px-4 py-3 font-semibold sticky left-0 z-10 bg-surface-container">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
              <th className="px-4 py-3 font-semibold">Total Spent</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-primary-dark sticky left-0 z-10 bg-white">{u.fullName}</td>
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
                    className={`rounded-lg px-3 py-1 text-xs font-semibold disabled:opacity-50 ${
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
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
