
import React, { useEffect } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';

const Admin = () => {
  useEffect(() => {
    document.title = "Admin Login | Fellers Resources";
  }, []);
  
  return <AdminLogin />;
};

export default Admin;
