import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import type { ProtectedRouteProps } from "../types/props";

/**
 * Route guard component that redirects to login if user is not authenticated
 */
export function ProtectedRoute({
  children,
  allowedUserTypes,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

 if (
  allowedUserTypes &&
  user?.userType &&
  !allowedUserTypes.map((t) => t.toLowerCase()).includes(user.userType.toLowerCase())
) {
  return <Navigate to="/" replace />;
}

  return <>{children}</>;
}
