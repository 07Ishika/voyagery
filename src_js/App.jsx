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
import HomeGuide from "./pages/HomeGuide";
import Community from "./pages/Community";
import Guides from "./pages/Guides";
import MigrantRequests from "./pages/MigrantRequests";
import Profile from "./pages/Profile";
import CallRequest from "./pages/CallRequest";
import CostOfLiving from "./pages/CostOfLiving";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import ManualLogin from "./pages/ManualLogin";
import DashboardGuide from "./pages/DashboardGuide";
import DashboardMigrant from "./pages/DashboardMigrant";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppShell = () => {
  const location = useLocation();
  const hiddenHeaderPaths = new Set(["/", "/role", "/manual-login"]);
  const isCover = hiddenHeaderPaths.has(location.pathname);
  const showCalculatorButton = !isCover;

  return (
    <div className="min-h-screen bg-background">
      {!isCover && <Header />}
      <ErrorBoundary>
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
