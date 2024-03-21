import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export function ProtectedRoute({ children }) {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = !!authCtx?.userAuthDetails.token;

  if (!isLoggedIn) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" replace />;
  }

  return children;
}
