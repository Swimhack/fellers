
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Save, Images } from "lucide-react";
import FellersLogo from '@/components/FellersLogo';
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  activeTab: "gallery" | "bulk-upload";
}

const AdminDashboardLayout = ({ children, activeTab }: AdminDashboardLayoutProps) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = React.useState(false);

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

  const handleTabChange = (value: string) => {
    if (value === "gallery") {
      navigate("/admin/dashboard");
    } else if (value === "bulk-upload") {
      navigate("/admin/bulk-upload");
    }
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
      
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="gallery">Gallery Management</TabsTrigger>
            <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="bg-white rounded-lg shadow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
