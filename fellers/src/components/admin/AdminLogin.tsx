
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FellersLogo from '@/components/FellersLogo';

// Simple admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "fellers123";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("=== ADMIN LOGIN ATTEMPT ===");
    console.log("Username:", username);
    console.log("Password:", password);

    // Clear any previous authentication
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminLoginTime");
    localStorage.removeItem("adminUsername");

    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      // Validate input
      if (!trimmedUsername || !trimmedPassword) {
        toast.error("Please enter both username and password");
        setIsLoading(false);
        return;
      }

      // Simple credential check
      if (trimmedUsername === ADMIN_USERNAME && trimmedPassword === ADMIN_PASSWORD) {
        // Set admin authentication in localStorage
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminLoginTime", new Date().toISOString());
        localStorage.setItem("adminUsername", trimmedUsername);
        
        console.log("✅ ADMIN LOGIN SUCCESSFUL");
        
        toast.success("Login successful! Redirecting to dashboard...");
        
        // Small delay to show success message
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        console.log("❌ ADMIN LOGIN FAILED - Invalid credentials");
        console.log("Expected:", ADMIN_USERNAME, ADMIN_PASSWORD);
        console.log("Received:", trimmedUsername, trimmedPassword);
        
        toast.error("Invalid username or password");
      }
    } catch (error) {
      console.error("❌ LOGIN ERROR:", error);
      toast.error("An unexpected error occurred. Please try again.");
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
