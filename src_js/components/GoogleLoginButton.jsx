import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const GoogleLoginButton = ({ role }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWakeMessage, setShowWakeMessage] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    if (!isConnecting) return undefined;

    const timer = window.setTimeout(() => setShowWakeMessage(true), 2500);
    return () => window.clearTimeout(timer);
  }, [isConnecting]);

  const handleLogin = async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    setShowWakeMessage(false);
    setConnectionError(false);

    const url = `${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/auth/google?role=${role || ''}`;

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 30000);
      const response = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/health`, {
        signal: controller.signal,
        credentials: 'include'
      });
      window.clearTimeout(timeout);
      if (!response.ok) throw new Error('Backend health check failed');
      window.location.href = url;
    } catch (error) {
      setIsConnecting(false);
      setShowWakeMessage(false);
      setConnectionError(true);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleLogin}
        disabled={isConnecting}
        className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white border-none"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "500"
        }}
      >
        {isConnecting ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            style={{ width: 20, height: 20 }}
          />
        )}
        {isConnecting ? 'Connecting to Voyagery...' : 'Login with Google'}
      </Button>
      {showWakeMessage && (
        <p className="text-center text-xs text-muted-foreground" role="status">
          The server is waking up. This may take a few seconds.
        </p>
      )}
      {connectionError && (
        <p className="text-center text-xs text-destructive" role="alert">
          The server took too long to respond. Please try again.
        </p>
      )}
    </div>
  );
};

export default GoogleLoginButton;
