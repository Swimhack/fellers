
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import AdminGallery from './AdminGallery';
import FellersLogo from '@/components/FellersLogo';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <FellersLogo size="small" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Gallery Management</h2>
          </div>
          <AdminGallery />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
