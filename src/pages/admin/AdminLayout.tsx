
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-muted">
        <Outlet />
      </main>
    </div>
  );
}
