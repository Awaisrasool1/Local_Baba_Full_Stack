import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }: any) => {
  const role = localStorage.getItem("userRole");

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
