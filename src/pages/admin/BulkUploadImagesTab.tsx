
import React, { useEffect } from 'react';
import AdminBulkUpload from '@/components/admin/AdminBulkUpload';

export default function BulkUploadImagesTab() {
  useEffect(() => {
    document.title = "Bulk Upload | Admin Dashboard | Fellers Resources";
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Bulk Image Upload</h1>
        <p className="text-muted-foreground">Upload multiple images at once and manage your uploaded images.</p>
      </div>
      <AdminBulkUpload />
    </div>
  );
}
