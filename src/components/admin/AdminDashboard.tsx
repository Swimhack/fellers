
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import AdminGallery from './AdminGallery';
import FellersLogo from '@/components/FellersLogo';
import { toast } from "@/components/ui/sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/admin");
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    // Simulate saving process
    setTimeout(() => {
      setIsSaving(false);
      toast.success("All changes saved successfully");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <FellersLogo size="small" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="bg-fellers-green hover:bg-fellers-green/90"
            >
              <Save className="mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Gallery Management</h2>
            <p className="text-gray-500 text-sm mt-1">
              Add, remove, and reorder images in your gallery. Don't forget to click "Save Changes" when you're done.
            </p>
          </div>
          <AdminGallery />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
