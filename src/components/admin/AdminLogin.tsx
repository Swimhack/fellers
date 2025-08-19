
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

    // Clear any previous authentication
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminLoginTime");

    // Add detailed debugging info
    console.log("=== LOGIN ATTEMPT DEBUG ===");
    console.log("Entered username:", `"${username}"`);
    console.log("Entered password:", `"${password}"`);
    console.log("Expected username:", `"${DEFAULT_USERNAME}"`);
    console.log("Expected password:", `"${DEFAULT_PASSWORD}"`);
    console.log("Username length:", username.length);
    console.log("Password length:", password.length);
    console.log("Expected username length:", DEFAULT_USERNAME.length);
    console.log("Expected password length:", DEFAULT_PASSWORD.length);

    // Simulate API call delay
    setTimeout(() => {
      // Trim whitespace and check credentials
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      console.log("After trimming:");
      console.log("Trimmed username:", `"${trimmedUsername}"`);
      console.log("Trimmed password:", `"${trimmedPassword}"`);
      console.log("Username match:", trimmedUsername === DEFAULT_USERNAME);
      console.log("Password match:", trimmedPassword === DEFAULT_PASSWORD);
      
      if (trimmedUsername === DEFAULT_USERNAME && trimmedPassword === DEFAULT_PASSWORD) {
        // Set admin authentication in localStorage
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminLoginTime", new Date().toISOString());
        
        console.log("✅ LOGIN SUCCESSFUL for user:", trimmedUsername);
        console.log("Auth stored in localStorage:", localStorage.getItem("adminAuthenticated"));
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        
        navigate("/admin/dashboard");
      } else {
        console.log("❌ LOGIN FAILED - credential mismatch");
        console.log("Username comparison:", {
          entered: trimmedUsername,
          expected: DEFAULT_USERNAME,
          match: trimmedUsername === DEFAULT_USERNAME
        });
        console.log("Password comparison:", {
          entered: trimmedPassword,
          expected: DEFAULT_PASSWORD,
          match: trimmedPassword === DEFAULT_PASSWORD
        });
        
        toast({
          title: "Login failed",
          description: `Invalid username or password. Expected: "${DEFAULT_USERNAME}" / "${DEFAULT_PASSWORD}"`,
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500); // Reduced delay for faster testing
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
            <div className="mt-2 text-xs text-blue-600">
              <p>Debug info (check browser console for detailed logs)</p>
              <p>Current values: "{username}" / "{password}"</p>
            </div>
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
