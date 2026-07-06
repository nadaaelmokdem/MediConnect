
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import type { ProtectedRouteProps } from "../types/props";

/**
 * Route guard component that redirects to login if user is not authenticated
 */
export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  if (allowedRoles) {
    if (user?.activeRole) {
      const activeRoleMatch = allowedRoles.some((r) => r.toLowerCase() === user?.activeRole?.toLowerCase());
      if (!activeRoleMatch) {
        return <Navigate to="/" replace />;
      }
    } else {
      const hasAllowedRole = user?.roles?.some((role) =>
        allowedRoles.some(t => role.toLowerCase() === t.toLowerCase())
      );
      
      if (!hasAllowedRole) {
        return <Navigate to="/" replace />;
      }
    }
  }

  return <>{children}</>;
}
