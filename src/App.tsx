import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEventsPage from "./pages/AdminEventsPage";
import AdminEventFormPage from "./pages/AdminEventFormPage";
import AdminRegistrationsPage from "./pages/AdminRegistrationsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: "admin" | "student" }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/events"} replace />;
  return <>{children}</>;
}

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? (user.role === "admin" ? "/admin" : "/events") : "/login"} replace />} />
      <Route path="/login" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/events"} replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/events" replace /> : <RegisterPage />} />

      {/* Student routes */}
      <Route path="/events" element={<ProtectedRoute role="student"><EventsPage /></ProtectedRoute>} />
      <Route path="/events/:id" element={<ProtectedRoute role="student"><EventDetailPage /></ProtectedRoute>} />
      <Route path="/my-registrations" element={<ProtectedRoute role="student"><MyRegistrationsPage /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="events/new" element={<AdminEventFormPage />} />
        <Route path="events/:id/edit" element={<AdminEventFormPage />} />
        <Route path="registrations" element={<AdminRegistrationsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
