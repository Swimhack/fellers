
import React, { useEffect } from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminRoute from '@/components/admin/AdminRoute';

const AdminDashboardPage = () => {
  useEffect(() => {
    document.title = "Admin Dashboard | Fellers Resources";
  }, []);

  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  );
};

export default AdminDashboardPage;
