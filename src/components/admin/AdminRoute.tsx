
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Protected route component for admin pages
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
  const loginTime = localStorage.getItem("adminLoginTime");

  useEffect(() => {
    // Check authentication on component mount
    if (!isAuthenticated) {
      console.log("User is not authenticated, redirecting to admin login");
    } else {
      console.log("User is authenticated, login time:", loginTime);
      
      // Optional: Check if session is older than 24 hours and auto-logout
      if (loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursSinceLogin = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLogin > 24) {
          console.log("Session expired, logging out");
          localStorage.removeItem("adminAuthenticated");
          localStorage.removeItem("adminLoginTime");
          window.location.href = "/admin";
        }
      }
    }
  }, [isAuthenticated, loginTime]);

  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" replace />;
};

export default AdminRoute;
