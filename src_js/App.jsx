import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { CalculatorProvider } from "./contexts/CalculatorContext";
import { AuthProvider } from "./contexts/AuthContext";

import CostCalculatorWidget from "./components/CostCalculatorWidget";
import FloatingCalculatorButton from "./components/FloatingCalculatorButton";
import Index from "./pages/Index";
import Cover from "./pages/Cover";
import RoleSelection from "./pages/RoleSelect";
const HomeGuide = lazy(() => import("./pages/HomeGuide"));
const Community = lazy(() => import("./pages/Community"));
const Guides = lazy(() => import("./pages/Guides"));
const MigrantRequests = lazy(() => import("./pages/MigrantRequests"));
const Profile = lazy(() => import("./pages/Profile"));
const CallRequest = lazy(() => import("./pages/CallRequest"));
const CostOfLiving = lazy(() => import("./pages/CostOfLiving"));
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import ManualLogin from "./pages/ManualLogin";
const DashboardGuide = lazy(() => import("./pages/DashboardGuide"));
const DashboardMigrant = lazy(() => import("./pages/DashboardMigrant"));
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const PageLoading = () => {
  const [showWakeUpMessage, setShowWakeUpMessage] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowWakeUpMessage(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center" role="status" aria-live="polite">
        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="font-medium">Loading Voyagery...</p>
        {showWakeUpMessage && (
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            The server is waking up. This may take a few seconds.
          </p>
        )}
      </div>
    </div>
  );
};

const AppShell = () => {
  const location = useLocation();
  const hiddenHeaderPaths = new Set(["/", "/role", "/manual-login"]);
  const isCover = hiddenHeaderPaths.has(location.pathname);
  const showCalculatorButton = !isCover;

  return (
    <div className="min-h-screen bg-background">
      {!isCover && <Header />}
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <Routes>
          <Route path="/" element={<Cover />} />
          <Route path="/role" element={<RoleSelection />} />
          <Route path="/manual-login" element={<ManualLogin />} />

          {/* Guide-only routes */}
          <Route path="/home/guide" element={
            <ProtectedRoute requireRole="guide">
              <HomeGuide />
            </ProtectedRoute>
          } />
          <Route path="/dashboard-guide" element={
            <ProtectedRoute requireRole="guide">
              <DashboardGuide />
            </ProtectedRoute>
          } />
          <Route path="/migrant-requests" element={
            <ProtectedRoute requireRole="guide">
              <MigrantRequests />
            </ProtectedRoute>
          } />
          <Route path="/guide/profile" element={
            <ProtectedRoute requireRole="guide">
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/guide/community" element={
            <ProtectedRoute requireRole="guide">
              <Community />
            </ProtectedRoute>
          } />

          {/* Migrant-only routes */}
          <Route path="/guides" element={
            <ProtectedRoute requireRole="migrant">
              <Guides />
            </ProtectedRoute>
          } />
          <Route path="/cost-of-living" element={
            <ProtectedRoute requireRole="migrant">
              <CostOfLiving />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requireRole="migrant">
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/call-request" element={
            <ProtectedRoute requireRole="migrant">
              <CallRequest />
            </ProtectedRoute>
          } />
          <Route path="/dashboard-migrant" element={
            <ProtectedRoute requireRole="migrant">
              <DashboardMigrant />
            </ProtectedRoute>
          } />

          {/* Shared authenticated routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      {showCalculatorButton && <FloatingCalculatorButton />}
      <CostCalculatorWidget />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CalculatorProvider>
            <AppShell />
          </CalculatorProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
