
import React, { useEffect } from 'react';
import AdminBulkUpload from '@/components/admin/AdminBulkUpload';
import AdminRoute from '@/components/admin/AdminRoute';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';

const AdminBulkUploadPage = () => {
  useEffect(() => {
    document.title = "Bulk Upload | Admin Dashboard | Fellers Resources";
  }, []);

  return (
    <AdminRoute>
      <AdminDashboardLayout activeTab="bulk-upload">
        <AdminBulkUpload />
      </AdminDashboardLayout>
    </AdminRoute>
  );
};

export default AdminBulkUploadPage;
