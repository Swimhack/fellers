
import React, { useEffect } from 'react';
import AdminBulkUpload from '@/components/admin/AdminBulkUpload';

export default function BulkUploadImagesTab() {
  useEffect(() => {
    document.title = "Bulk Upload | Admin Dashboard | Fellers Resources";
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Bulk Image Upload</h1>
        <p className="text-gray-300">Upload multiple images at once and manage your uploaded images.</p>
      </div>
      <AdminBulkUpload />
    </div>
  );
}
