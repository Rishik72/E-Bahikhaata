import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import AppLayout from "./components/AppLayout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import FamilyList from "./pages/FamilyList";
import FamilyDetail from "./pages/FamilyDetail";
import FamilyForm from "./pages/FamilyForm";
import VisitLog from "./pages/VisitLog";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import FloatingContactCard from "./components/FloatingContactCard";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
    <Route path="/families" element={<ProtectedRoute><AppLayout><FamilyList /></AppLayout></ProtectedRoute>} />
    <Route path="/families/new" element={<ProtectedRoute><AppLayout><FamilyForm /></AppLayout></ProtectedRoute>} />
    <Route path="/families/:id" element={<ProtectedRoute><AppLayout><FamilyDetail /></AppLayout></ProtectedRoute>} />
    <Route path="/visits" element={<ProtectedRoute><AppLayout><VisitLog /></AppLayout></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <FloatingContactCard />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
