
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import GalleryPage from "./pages/GalleryPage";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLayout from "./pages/admin/AdminLayout";
import BulkUploadImagesTab from "./pages/admin/BulkUploadImagesTab";
import ContactSubmissionsPage from "./pages/admin/ContactSubmissionsPage";
import AdminRoute from "./components/admin/AdminRoute";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* Protected Admin Dashboard Layout with Sidebar */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<AdminDashboardPage />} />
          </Route>
          
          <Route path="/admin/bulk-upload" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<BulkUploadImagesTab />} />
          </Route>
          
          <Route path="/admin/contacts" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<ContactSubmissionsPage />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
