
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-fellers-darkBackground">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="admin-content-area flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
