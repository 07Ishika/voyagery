import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const DemoLoginButton = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { toast } = useToast();

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/auth/demo-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setUser(data);
        toast({
          title: "Demo login successful",
          description: `Welcome ${data.displayName} (${data.role})`,
        });

        if (role === 'guide') {
          navigate('/home/guide', { replace: true });
        } else {
          navigate('/home', { replace: true });
        }
      } else {
        toast({
          title: "Demo login failed",
          description: data.error || "Could not log in. Make sure the server is running and test users exist.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Demo login error:', error);
      toast({
        title: "Demo login error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDemoLogin}
      disabled={loading}
      variant="outline"
      className="w-full"
    >
      {loading ? 'Logging in...' : `Demo Login as ${role === 'guide' ? 'Guide' : 'Migrant'}`}
    </Button>
  );
};

export default DemoLoginButton;
