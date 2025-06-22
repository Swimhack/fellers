
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Protected route component for admin pages
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";

  useEffect(() => {
    // Check authentication on component mount
    if (!isAuthenticated) {
      console.log("User is not authenticated, redirecting to admin login");
    }
  }, [isAuthenticated]);

  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" replace />;
};

export default AdminRoute;
