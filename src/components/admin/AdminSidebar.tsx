
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Image, Upload, Users } from 'lucide-react';
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
    <Sidebar className="border-r border-gray-700">
      <SidebarHeader className="mb-2 bg-fellers-brightPurple">
        <div className="px-3 py-4">
          <FellersLogo size="small" className="mx-auto filter brightness-150" />
          <h2 className="text-lg font-semibold text-center mt-2 text-white">Admin Dashboard</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Gallery Management">
              <NavLink 
                to="/admin/dashboard" 
                className={({ isActive }) => 
                  isActive 
                    ? "bg-fellers-brightPurple text-white" 
                    : "text-gray-200 hover:bg-gray-700 hover:text-fellers-green"
                }
              >
                <Image className="mr-2 text-fellers-green" />
                <span>Gallery Management</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Bulk Upload">
              <NavLink 
                to="/admin/bulk-upload" 
                className={({ isActive }) => 
                  isActive 
                    ? "bg-fellers-brightPurple text-white" 
                    : "text-gray-200 hover:bg-gray-700 hover:text-fellers-green"
                }
              >
                <Upload className="mr-2 text-fellers-green" />
                <span>Bulk Upload</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Contact Submissions">
              <NavLink 
                to="/admin/contacts" 
                className={({ isActive }) => 
                  isActive 
                    ? "bg-fellers-brightPurple text-white" 
                    : "text-gray-200 hover:bg-gray-700 hover:text-fellers-green"
                }
              >
                <Users className="mr-2 text-fellers-green" />
                <span>Contact Submissions</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
