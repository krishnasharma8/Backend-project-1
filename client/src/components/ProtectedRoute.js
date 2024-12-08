import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("currentUser")); // Check user from localStorage

  if (!user) {
    // If user is not logged in, redirect to register page
    return <Navigate to="/register" />;
  }

  // If user is logged in, render the children components
  return children;
}

export default ProtectedRoute;
