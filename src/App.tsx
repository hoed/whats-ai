
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AuthDialog from '@/components/auth/AuthDialog';
import Index from "./pages/Index";
import Contacts from "./pages/Contacts";
import Chats from "./pages/Chats";
import Templates from "./pages/Templates";
import AIProfiles from "./pages/AIProfiles";
import ChatDetail from "./pages/ChatDetail";
import Settings from "./pages/Settings";
import SetupWhatsApp from "./pages/SetupWhatsApp";
import Analytics from "./pages/Analytics";
import Training from "./pages/Training";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Manual from "./pages/Manual";
import { ToastProvider } from "@/hooks/use-toast";

const queryClient = new QueryClient();

// ProtectedRoute component to restrict access to authenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, setShowAuthDialog } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/auth', '/manual'];
  if (!user && !publicRoutes.includes(location.pathname)) {
    // Open AuthDialog for protected routes
    setShowAuthDialog(true);
    return null; // Prevent rendering the protected route
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/manual" element={<Manual />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contacts"
                  element={
                    <ProtectedRoute>
                      <Contacts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/templates"
                  element={
                    <ProtectedRoute>
                      <Templates />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-profiles"
                  element={
                    <ProtectedRoute>
                      <AIProfiles />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat/:sessionId"
                  element={
                    <ProtectedRoute>
                      <ChatDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/setup-whatsapp"
                  element={
                    <ProtectedRoute>
                      <SetupWhatsApp />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/training"
                  element={
                    <ProtectedRoute>
                      <Training />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chats"
                  element={
                    <ProtectedRoute>
                      <Chats />
                    </ProtectedRoute>
                  }
                />

                {/* Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <AuthDialog isOpen={false} onClose={() => {}} />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
