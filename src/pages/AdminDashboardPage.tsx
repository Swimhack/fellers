
import React, { useEffect } from 'react';
import AdminGallery from '@/components/admin/AdminGallery';
import AdminRoute from '@/components/admin/AdminRoute';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';

const AdminDashboardPage = () => {
  useEffect(() => {
    document.title = "Gallery Management | Admin Dashboard | Fellers Resources";
  }, []);

  return (
    <AdminRoute>
      <AdminDashboardLayout activeTab="gallery">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Gallery Management</h2>
          <p className="text-gray-500 text-sm mt-1">
            Add, remove, and reorder images in your gallery. Don't forget to click "Save Changes" when you're done.
          </p>
        </div>
        <AdminGallery />
      </AdminDashboardLayout>
    </AdminRoute>
  );
};

export default AdminDashboardPage;
