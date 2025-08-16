
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FellersLogo from '@/components/FellersLogo';

// Simple default credentials for admin access
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "fellers123";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Add debugging info (remove in production)
    console.log("Login attempt:", { username, password: "***" });
    console.log("Expected credentials:", { username: DEFAULT_USERNAME, password: "***" });

    // Simulate API call delay
    setTimeout(() => {
      // Trim whitespace and check credentials
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      if (trimmedUsername === DEFAULT_USERNAME && trimmedPassword === DEFAULT_PASSWORD) {
        // Set admin authentication in localStorage
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminLoginTime", new Date().toISOString());
        
        console.log("Login successful for user:", trimmedUsername);
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        
        navigate("/admin/dashboard");
      } else {
        console.log("Login failed - credential mismatch");
        
        toast({
          title: "Login failed",
          description: `Invalid username or password. Use: ${DEFAULT_USERNAME} / ${DEFAULT_PASSWORD}`,
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
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
            <p className="text-sm text-blue-800">
              <strong>Admin Credentials:</strong><br />
              Username: <code className="bg-blue-100 px-1 rounded">admin</code><br />
              Password: <code className="bg-blue-100 px-1 rounded">fellers123</code>
            </p>
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
