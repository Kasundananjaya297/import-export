/** @format */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles = [],
}) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  console.log("currentUser", currentUser);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no roles are specified or user is admin, allow access
  if (roles.length === 0 || (currentUser && currentUser.role === "admin")) {
    return <>{children}</>;
  }

  // For non-admin users, check if they have the required role
  if (currentUser && !roles.includes(currentUser.role)) {
    // Redirect based on user role
    switch (currentUser.role) {
      case "importer":
      case "buyer":
        return <Navigate to="/importer/dashboard" replace />;
      case "exporter":
      case "seller":
        return <Navigate to="/exporter/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
