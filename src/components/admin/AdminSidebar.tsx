
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Gallery, Upload } from 'lucide-react';
import FellersLogo from '@/components/FellersLogo';
import { 
  Sidebar, 
  SidebarHeader,
  SidebarContent, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const AdminSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="mb-2">
        <div className="px-3 py-2">
          <FellersLogo size="small" className="mx-auto" />
          <h2 className="text-lg font-semibold text-center mt-2">Admin Dashboard</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Gallery Management">
              <NavLink 
                to="/admin/dashboard" 
                className={({ isActive }) => 
                  isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                }
              >
                <Gallery className="mr-2" />
                <span>Gallery Management</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Bulk Upload">
              <NavLink 
                to="/admin/bulk-upload" 
                className={({ isActive }) => 
                  isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                }
              >
                <Upload className="mr-2" />
                <span>Bulk Upload</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
