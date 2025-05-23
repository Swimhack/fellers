
import React, { useEffect } from 'react';
import AdminBulkUpload from '@/components/admin/AdminBulkUpload';

export default function BulkUploadImagesTab() {
  useEffect(() => {
    document.title = "Bulk Upload | Admin Dashboard | Fellers Resources";
  }, []);

  return <AdminBulkUpload />;
}
