import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("currentUser")); // Check user from localStorage
  const token = user?.token; // Extract the token

  if (!user || !token) {
    // If user is not logged in or token is missing, redirect to login page
    return <Navigate to="/login" />;
  }

  // If user is logged in and token is valid, render the children components
  return children;
}

export default ProtectedRoute;
