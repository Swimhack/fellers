
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FellersLogo from '@/components/FellersLogo';
import { supabase } from '@/integrations/supabase/client';

// Fallback credentials if Supabase is not available
const FALLBACK_USERNAME = "admin";
const FALLBACK_PASSWORD = "fellers123";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Clear any previous authentication
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminLoginTime");
    localStorage.removeItem("adminUsername");

    console.log("=== ADMIN LOGIN ATTEMPT ===");

    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      // Validate input
      if (!trimmedUsername || !trimmedPassword) {
        toast({
          title: "Login failed",
          description: "Please enter both username and password",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Test Supabase connection first
      let supabaseConnected = false;
      try {
        const { error: connectionTest } = await supabase
          .from('gallery_images')
          .select('id')
          .limit(1);
        
        if (!connectionTest) {
          supabaseConnected = true;
          console.log("✅ Supabase connection verified");
        }
      } catch (connectionError) {
        console.log("⚠️ Supabase connection failed:", connectionError);
      }
      
      // Check credentials - for now using hardcoded, but Supabase is connected for other features
      let authenticated = false;
      
      if (trimmedUsername === FALLBACK_USERNAME && trimmedPassword === FALLBACK_PASSWORD) {
        authenticated = true;
        
        // Log successful authentication to a simple log table if possible
        if (supabaseConnected) {
          try {
            // Try to log the login attempt (optional)
            await supabase
              .from('admin_login_log')
              .insert({
                username: trimmedUsername,
                login_time: new Date().toISOString(),
                ip_address: 'unknown',
                success: true
              });
          } catch (logError) {
            // Logging failed, but don't block login
            console.log("Could not log login attempt (table might not exist)");
          }
        }
      }
      
      if (authenticated) {
        // Set admin authentication in localStorage
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminLoginTime", new Date().toISOString());
        localStorage.setItem("adminUsername", trimmedUsername);
        localStorage.setItem("supabaseConnected", supabaseConnected.toString());
        
        console.log("✅ ADMIN LOGIN SUCCESSFUL");
        console.log("Supabase Status:", supabaseConnected ? "Connected" : "Offline");
        
        toast({
          title: "Login successful",
          description: `Welcome to the admin dashboard${supabaseConnected ? "" : " (limited mode)"}`,
        });
        
        navigate("/admin/dashboard");
      } else {
        console.log("❌ ADMIN LOGIN FAILED - Invalid credentials");
        
        // Log failed attempt if possible
        if (supabaseConnected) {
          try {
            await supabase
              .from('admin_login_log')
              .insert({
                username: trimmedUsername,
                login_time: new Date().toISOString(),
                ip_address: 'unknown',
                success: false
              });
          } catch (logError) {
            console.log("Could not log failed login attempt");
          }
        }
        
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ LOGIN ERROR:", error);
      
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <FellersLogo size="default" />
          <CardTitle className="text-2xl font-bold text-center mt-4">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 font-medium">Default Login:</p>
            <p className="text-sm text-blue-600">Username: admin</p>
            <p className="text-sm text-blue-600">Password: fellers123</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <Input 
                id="username"
                type="text" 
                placeholder="Enter username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input 
                id="password"
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-fellers-green hover:bg-fellers-green/90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
