import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

// Type for the ProtectedRoute's props
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = !!authCtx?.userAuthDetails.token;

  if (!isLoggedIn) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" replace />;
  }

  return children;
}
