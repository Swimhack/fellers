
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-muted">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
