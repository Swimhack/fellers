
import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Save, LogOut } from "lucide-react";
import FellersLogo from '@/components/FellersLogo';
import { toast } from "@/components/ui/sonner";

interface AdminHeaderProps {
  onSave?: () => void;
}

const AdminHeader = ({ onSave }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/admin");
  };

  const handleSaveChanges = () => {
    if (onSave) {
      onSave();
    } else {
      setIsSaving(true);
      // Simulate saving process
      setTimeout(() => {
        setIsSaving(false);
        toast.success("All changes saved successfully");
      }, 800);
    }
  };

  return (
    <header className="bg-fellers-brightPurple text-white px-6 py-4 fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center">
        {/* Logo on the left */}
        <div className="flex items-center">
          <FellersLogo size="small" className="filter brightness-150" />
        </div>
        
        {/* Navigation in the middle */}
        <nav className="hidden md:flex space-x-6">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => 
              `text-white hover:text-fellers-green transition-colors ${isActive ? 'text-fellers-green font-bold' : ''}`
            }
          >
            Gallery Management
          </NavLink>
          <NavLink 
            to="/admin/bulk-upload" 
            className={({ isActive }) => 
              `text-white hover:text-fellers-green transition-colors ${isActive ? 'text-fellers-green font-bold' : ''}`
            }
          >
            Bulk Upload
          </NavLink>
        </nav>
        
        {/* Actions on the right */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="admin-btn-primary"
          >
            <Save className="mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-white text-white hover:bg-white/10"
          >
            <LogOut className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
